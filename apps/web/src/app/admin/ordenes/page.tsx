'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminFetchOrders } from '@/lib/api';
import { formatPrice, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobada' },
  { value: 'REJECTED', label: 'Rechazada' },
  { value: 'CANCELLED', label: 'Cancelada' },
  { value: 'DELIVERED', label: 'Entregada' },
];

export default function AdminOrdenesPage() {
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', { status, email, page }],
    queryFn: () => adminFetchOrders({ status: status || undefined, email: email || undefined, page }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-44" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Órdenes</h1>
        {pagination && (
          <p className="text-neutral-500 text-sm mt-1">{pagination.total} orden{pagination.total !== 1 ? 'es' : ''} en total</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Buscar por email..."
            value={email}
            onChange={(e) => { setEmail(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="w-44"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">No hay órdenes con esos filtros.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">
                      Comprador
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900">{order.buyerName}</p>
                        <p className="text-xs text-neutral-400">{order.buyerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {order.items.map((i) => i.product.title).join(', ')}
                      </td>
                      <td className="px-4 py-3 font-bold text-neutral-900">
                        {formatPrice(order.total, order.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/ordenes/${order.id}`}>Ver</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
                <p className="text-xs text-neutral-500">
                  Página {pagination.page} de {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
