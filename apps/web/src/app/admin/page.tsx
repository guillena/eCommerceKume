'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminFetchStats } from '@/lib/api';
import { formatPrice, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Calendar,
} from 'lucide-react';

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-neutral-500">{title}</CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
            <Icon className="h-4 w-4 text-neutral-700" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-black text-neutral-900">{value}</p>
        {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminFetchStats,
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">Error al cargar el dashboard.</p>
        <p className="text-neutral-400 text-sm mt-1">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Resumen general de la tienda</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas hoy"
          value={formatPrice(stats?.todaySales ?? 0)}
          icon={Calendar}
        />
        <StatCard
          title="Ventas del mes"
          value={formatPrice(stats?.monthSales ?? 0)}
          icon={DollarSign}
        />
        <StatCard
          title="Órdenes aprobadas"
          value={String(stats?.approvedOrdersCount ?? 0)}
          icon={ShoppingBag}
          subtitle="Total histórico"
        />
        <StatCard
          title="Top producto"
          value={stats?.topProducts?.[0]?.productTitle ?? '—'}
          icon={TrendingUp}
          subtitle={
            stats?.topProducts?.[0]
              ? `${stats.topProducts[0].totalSales} ventas`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 productos</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topProducts?.length === 0 ? (
              <p className="text-neutral-400 text-sm">Sin datos todavía.</p>
            ) : (
              <div className="space-y-3">
                {stats?.topProducts?.map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-300 w-5 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {p.productTitle}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {p.totalSales} venta{p.totalSales !== 1 ? 's' : ''} —{' '}
                        {formatPrice(p.totalRevenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Últimas órdenes</CardTitle>
              <Link
                href="/admin/ordenes"
                className="text-xs text-neutral-500 hover:text-black transition-colors"
              >
                Ver todas →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders?.length === 0 ? (
              <p className="text-neutral-400 text-sm">Sin órdenes todavía.</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentOrders?.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/ordenes/${order.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {order.buyerName}
                      </p>
                      <p className="text-xs text-neutral-400">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
