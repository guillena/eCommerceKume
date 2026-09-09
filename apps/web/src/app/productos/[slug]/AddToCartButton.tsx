'use client';

import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items, openCart } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  return (
    <Button
      size="lg"
      variant={inCart ? 'secondary' : 'default'}
      onClick={() => (inCart ? openCart() : addItem(product))}
      className="gap-2 w-full sm:w-auto"
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4" />
          En el carrito
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Agregar al carrito
        </>
      )}
    </Button>
  );
}
