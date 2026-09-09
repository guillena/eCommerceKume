'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, items, openCart } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const coverSrc = product.coverImage?.startsWith('http')
    ? product.coverImage
    : `${apiUrl}${product.coverImage}`;

  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: product.currency ?? 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white hover:shadow-lg transition-all duration-300">
      {/* Cover */}
      <Link href={`/productos/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-neutral-50">
        {product.coverImage ? (
          <Image
            src={coverSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: '#B9D3FD' }}
          >
            <span className="text-5xl">📄</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category pill */}
        {product.category && (
          <span
            className="self-start text-[10px] font-semibold uppercase tracking-widest rounded-full px-2.5 py-1 mb-3"
            style={{ background: '#FDE3B9', color: '#78350f' }}
          >
            {product.category.name}
          </span>
        )}

        <Link href={`/productos/${product.slug}`} className="flex-1">
          <h3 className="font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-black transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{product.tagline}</p>
        </Link>

        {/* Stars */}
        {product.avgStars != null && (
          <div className="flex items-center gap-1.5 mt-3">
            <StarRating value={Math.round(product.avgStars)} size="sm" />
            <span className="text-xs text-neutral-400">({product.avgStars.toFixed(1)})</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
          <span className="text-lg font-extrabold text-neutral-900">{priceFormatted}</span>
          <Button
            size="sm"
            variant={inCart ? 'mint' : 'default'}
            onClick={() => (inCart ? openCart() : addItem(product))}
            className="gap-1.5"
          >
            {inCart ? (
              <>
                <Check className="h-3.5 w-3.5" />
                En carrito
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
