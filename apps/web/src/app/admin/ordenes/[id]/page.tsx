'use client';

import { use } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { adminFetchOrder, adminResendEmail } from '@/lib/api';
import { formatPrice, formatDateTime, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function AdminOrdenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => adminFetchOrder(id),
  });

  const resendMutation = useMutation({
    mutationFn: () => adminResendEmail(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">Orden no encontrada.</p>
        <Button className="mt-4" asChild>
          <Link href="/admin/ordenes">Volver</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/ordenes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Detalle de orden</h1>
          <p className="text-neutral-400 text-xs font-mono mt-0.5">{order.id}</p>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-neutral-900">Estado</h2>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-neutral-500 text-xs mb-1">Fecha de compra</p>
            <p className="font-medium">{formatDateTime(order.createdAt)}</p>
          </div>
          {order.mpPaymentId && (
            <div>
              <p className="text-neutral-500 text-xs mb-1">ID de pago MP</p>
              <p className="font-mono text-xs">{order.mpPaymentId}</p>
            </div>
          )}
          {order.tokenExpiresAt && (
            <div>
              <p className="text-neutral-500 text-xs mb-1">Token expira</p>
              <p className="font-medium">{formatDate(order.tokenExpiresAt)}</p>
            </div>
          )}
          {order.emailSentAt && (
            <div>
              <p className="text-neutral-500 text-xs mb-1">Email enviado</p>
              <p className="font-medium">{formatDateTime(order.emailSentAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Buyer */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-bold text-neutral-900 mb-4">Comprador</h2>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-neutral-500 text-xs mb-0.5">Nombre</p>
            <p className="font-medium">{order.buyerName}</p>
          </div>
          <div>
            <p className="text-neutral-500 text-xs mb-0.5">Email</p>
            <a
              href={`mailto:${order.buyerEmail}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {order.buyerEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-bold text-neutral-900 mb-4">Productos</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-800">{item.product.title}</p>
              <p className="text-sm font-bold">{formatPrice(item.price, order.currency)}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <p className="font-bold text-neutral-900">Total</p>
          <p className="text-xl font-black">{formatPrice(order.total, order.currency)}</p>
        </div>
      </div>

      {/* Actions */}
      {(order.status === 'APPROVED' || order.status === 'DELIVERED') && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-neutral-900 mb-2">Acciones</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Reenviar el email de descarga al comprador con un nuevo token.
          </p>

          {resendMutation.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-green-700">✓ Email reenviado correctamente.</p>
            </div>
          )}
          {resendMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-red-700">Error al reenviar el email.</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => resendMutation.mutate()}
            disabled={resendMutation.isPending}
            className="gap-2"
          >
            {resendMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Reenviar email de descarga
          </Button>
        </div>
      )}
    </div>
  );
}
