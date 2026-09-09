'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, ShoppingBag, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { createCheckout } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { items, removeItem, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Por favor completá tu nombre y email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El email no tiene un formato válido.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await createCheckout({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        buyerName: name,
        buyerEmail: email,
      });

      // Redirect to MercadoPago
      const isProd = process.env.NODE_ENV === 'production';
      window.location.href = isProd ? data.initPoint : data.sandboxInitPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-2">Tu carrito está vacío</h1>
        <p className="text-neutral-500 mb-6">Agregá productos para continuar con la compra.</p>
        <Button onClick={() => router.push('/productos')}>Ver productos</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-black tracking-tight mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-neutral-200 p-6 space-y-5">
            <h2 className="font-bold text-neutral-900">Tus datos</h2>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Nombre completo
              </label>
              <Input
                placeholder="Ej. María García"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-neutral-400 mt-1">
                El enlace de descarga se enviará a este email.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 p-5 bg-neutral-50">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Lock className="h-4 w-4 text-green-600" />
              Pago 100% seguro procesado por{' '}
              <span className="font-semibold text-neutral-800">MercadoPago</span>
            </div>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 p-5 sticky top-20">
            <h2 className="font-bold text-neutral-900 mb-4">Resumen del pedido</h2>

            <div className="space-y-3 mb-4">
              {items.map(({ product }) => {
                const coverSrc = product.coverImage?.startsWith('http')
                  ? product.coverImage
                  : `${apiUrl}${product.coverImage}`;
                return (
                  <div key={product.id} className="flex gap-3 items-start">
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                      {product.coverImage && (
                        <Image
                          src={coverSrc}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">
                        {product.title}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between mb-5">
              <span className="font-medium text-neutral-600">Total</span>
              <span className="text-xl font-black">{formatPrice(totalPrice(), 'ARS')}</span>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-3 bg-red-50 rounded-lg p-3">{error}</p>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
            >
              {loading ? 'Redirigiendo...' : 'Ir a pagar con MercadoPago'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
