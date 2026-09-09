'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const status = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (status === 'approved') {
      clearCart();
    }
  }, [status, clearCart]);

  if (status === 'rejected' || status === 'cancelled') {
    return (
      <div className="flex flex-col items-center text-center max-w-md mx-auto px-4 py-20">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <span className="text-2xl">❌</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-900 mb-3">Pago no procesado</h1>
        <p className="text-neutral-500 leading-relaxed mb-8">
          El pago fue {status === 'rejected' ? 'rechazado' : 'cancelado'}. No se realizó ningún
          cargo. Podés intentarlo nuevamente.
        </p>
        <Button asChild>
          <Link href="/checkout">Volver al checkout</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto px-4 py-20">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-black text-neutral-900 mb-3">¡Compra exitosa!</h1>
      <p className="text-neutral-500 leading-relaxed mb-2">
        Gracias por tu compra. En breve recibirás un email con el enlace de descarga.
      </p>
      {paymentId && (
        <p className="text-xs text-neutral-400 mb-8">
          N° de pago: <span className="font-mono">{paymentId}</span>
        </p>
      )}

      <div className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-5 mb-8">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 text-sm">Revisá tu email</p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Te enviamos un link de descarga válido por 48 horas.
              Si no lo ves, revisá la carpeta de spam.
            </p>
          </div>
        </div>
      </div>

      <Button variant="outline" asChild>
        <Link href="/productos">
          Seguir comprando <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-neutral-400">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
