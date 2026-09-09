'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const coverSrc = product.coverImage?.startsWith('http')
    ? product.coverImage
    : `${apiUrl}${product.coverImage}`;

  const fileLabel = product.fileType?.toUpperCase() ?? 'PDF';
  const pagesLabel = product.pageCount ? `${product.pageCount} págs.` : '';

  return (
    <div className="group flex flex-col justify-between bg-surface-subtle rounded-2xl p-space-md hover:shadow-md transition-all">
      <div>
        <Link href={`/productos/${product.slug}`}>
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-space-md bg-secondary-container/30">
            {product.coverImage ? (
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={coverSrc}
                alt={product.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <span className="material-symbols-outlined text-[48px]">description</span>
              </div>
            )}
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pastel-mint text-on-surface font-caption text-[11px] font-bold shadow-sm">
              <span className="material-symbols-outlined text-[14px]">download</span>
              {fileLabel} descargable
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-space-xs text-caption font-caption text-text-muted mb-1">
          <span className="material-symbols-outlined text-[14px]">menu_book</span>
          {fileLabel}{pagesLabel ? ` • ${pagesLabel}` : ''}
        </div>
        <Link href={`/productos/${product.slug}`}>
          <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h4>
        </Link>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2">
          {product.tagline}
        </p>
      </div>
      <div className="mt-space-lg pt-space-sm border-t-0 flex items-center justify-between">
        <div>
          <span className="font-caption text-caption text-text-muted block">Precio</span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        <button
          className={`px-space-md py-2.5 rounded-xl font-label-md text-label-md font-medium transition-all flex items-center gap-1.5 shadow-sm ${
            inCart
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-on-surface text-on-primary hover:bg-inverse-surface'
          }`}
          type="button"
          onClick={() => !inCart && addItem(product)}
          disabled={inCart}
        >
          <span className="material-symbols-outlined text-[18px]">
            {inCart ? 'check' : 'add_shopping_cart'}
          </span>
          <span>{inCart ? 'Agregado' : 'Añadir'}</span>
        </button>
      </div>
    </div>
  );
}

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col bg-surface-subtle rounded-2xl p-space-md">
          <div className="w-full aspect-[4/3] rounded-xl bg-neutral-200 animate-pulse mb-space-md" />
          <div className="h-3 w-1/3 bg-neutral-200 animate-pulse rounded mb-2" />
          <div className="h-5 w-full bg-neutral-200 animate-pulse rounded mb-1.5" />
          <div className="h-3 w-2/3 bg-neutral-200 animate-pulse rounded" />
          <div className="mt-auto pt-space-lg flex items-center justify-between">
            <div className="h-6 w-20 bg-neutral-200 animate-pulse rounded" />
            <div className="h-10 w-24 bg-neutral-200 animate-pulse rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 4 })
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(() => {
        // Fallback: fetch all and take first 4
        fetchProducts({ limit: 4 })
          .then((data) => setProducts(data.slice(0, 4)))
          .catch(console.error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
      {loading ? (
        <SkeletonCards />
      ) : products.length === 0 ? (
        <div className="col-span-full py-12 text-center text-neutral-400">
          <p>No hay productos destacados aún.</p>
        </div>
      ) : (
        products.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}
