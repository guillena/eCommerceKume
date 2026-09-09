'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminFetchProducts, adminDeleteProduct, adminUpdateProduct } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductosPage() {
  const queryClient = useQueryClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: adminFetchProducts,
  });

  const toggleActive = useMutation({
    mutationFn: async (product: { id: string; isActive: boolean }) => {
      const fd = new FormData();
      fd.append('isActive', String(!product.isActive));
      return adminUpdateProduct(product.id, fd);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => adminDeleteProduct(id, false),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Productos</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {products?.length ?? 0} producto{products?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500">No hay productos todavía.</p>
            <Button className="mt-4" asChild>
              <Link href="/admin/productos/nuevo">Crear el primero</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {products.map((product) => {
              const coverSrc = product.coverImage?.startsWith('http')
                ? product.coverImage
                : `${apiUrl}${product.coverImage}`;

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  {/* Cover */}
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                    {product.coverImage && (
                      <Image src={coverSrc} alt={product.title} fill className="object-cover" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-500">
                        {product.category?.name}
                      </span>
                      <span className="text-xs text-neutral-300">·</span>
                      <span className="text-xs text-neutral-500">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.totalSales !== undefined && (
                        <>
                          <span className="text-xs text-neutral-300">·</span>
                          <span className="text-xs text-neutral-500">
                            {product.totalSales} ventas
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <Badge variant={product.isActive ? 'success' : 'secondary'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={product.isActive ? 'Desactivar' : 'Activar'}
                      onClick={() =>
                        toggleActive.mutate({ id: product.id, isActive: product.isActive })
                      }
                    >
                      {product.isActive ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-neutral-400" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/productos/${product.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-red-500"
                      onClick={() => {
                        if (confirm(`¿Desactivar "${product.title}"?`)) {
                          deleteProduct.mutate(product.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
