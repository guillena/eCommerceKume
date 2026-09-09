'use client';

import { X, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  // Don't render anything until client-side to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
          <h2 className="text-base font-semibold">
            Tu carrito{' '}
            {items.length > 0 && (
              <span className="text-neutral-400">({items.length})</span>
            )}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-neutral-300" />
              <div>
                <p className="font-medium text-neutral-600">Tu carrito está vacío</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Agregá productos para comenzar
                </p>
              </div>
              <Button variant="outline" onClick={closeCart} asChild>
                <Link href="/productos">Ver productos</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product }) => {
                const coverSrc = product.coverImage?.startsWith('http')
                  ? product.coverImage
                  : `${apiUrl}${product.coverImage}`;
                return (
                  <li key={product.id} className="flex gap-3">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {product.coverImage && (
                        <Image src={coverSrc} alt={product.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <p className="text-sm font-medium leading-tight line-clamp-2">
                        {product.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-neutral-400 hover:text-red-500"
                          onClick={() => removeItem(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-bold text-lg">{formatPrice(totalPrice(), 'ARS')}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full" size="lg">
                Ir al checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
