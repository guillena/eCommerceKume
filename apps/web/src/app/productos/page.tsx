'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import type { Category, Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/ProductCard';
import { fetchProducts, fetchCategories } from '@/lib/api';

function CatalogFiltersInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';
  const currentSearch = searchParams.get('search') ?? '';

  const [search, setSearch] = useState(currentSearch);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Load products when filters change
  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: currentCategory || undefined,
      search: currentSearch || undefined,
    })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentCategory, currentSearch]);

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter('search', search);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">
          {currentCategory
            ? (categories.find((c) => c.slug === currentCategory)?.name ?? 'Productos')
            : 'Todos los productos'}
        </h1>
        <p className="mt-1 text-neutral-500 text-sm">
          Recursos digitales listos para descargar
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </form>

        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={currentCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('category', '')}
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={currentCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('category', cat.slug)}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border border-neutral-200 overflow-hidden">
              <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200 rounded-none" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 w-1/3 animate-pulse bg-neutral-200 rounded" />
                <div className="h-5 w-full animate-pulse bg-neutral-200 rounded" />
                <div className="h-4 w-2/3 animate-pulse bg-neutral-200 rounded" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 w-20 animate-pulse bg-neutral-200 rounded" />
                  <div className="h-8 w-24 animate-pulse bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-2xl font-bold text-neutral-900 mb-2">Sin resultados</p>
            <p className="text-neutral-500">
              No encontramos productos con esos filtros. Intentá con otros criterios.
            </p>
          </div>
        ) : (
          products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i === 0} />
          ))
        )}
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-neutral-400">Cargando productos...</div>}>
      <CatalogFiltersInner />
    </Suspense>
  );
}
