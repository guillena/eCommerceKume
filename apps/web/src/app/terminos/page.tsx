import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Términos y condiciones</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar la plataforma Kume Espacio, usted acepta estar sujeto a estos Términos y Condiciones.
              Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">2. Productos digitales</h2>
            <p>
              Kume Espacio ofrece productos digitales (ebooks, guías, talleres y materiales en formato PDF u otros formatos digitales).
              Al completar la compra, usted recibe acceso al producto para uso personal y no comercial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">3. Política de no reembolso</h2>
            <p>
              Dado que los productos son de naturaleza digital y se entregan de forma inmediata tras la compra,
              <strong> no se realizan devoluciones ni reembolsos</strong> una vez que el producto haya sido descargado o accedido.
              Si tiene problemas técnicos con su descarga, contáctenos a <a href="mailto:hola@kumespacio.com.ar" className="text-purple-600 hover:underline">hola@kumespacio.com.ar</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">4. Propiedad intelectual</h2>
            <p>
              Todos los materiales son propiedad de Kume Espacio y están protegidos por las leyes de derechos de autor.
              Queda prohibida su reproducción, distribución o reventa sin autorización expresa por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">5. Pagos</h2>
            <p>
              Los pagos son procesados de forma segura por Mercado Pago. No almacenamos datos de tarjetas de crédito.
              Los precios están expresados en pesos argentinos (ARS) salvo indicación contraria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">6. Contacto</h2>
            <p>
              Para consultas sobre estos términos, puede contactarnos en{' '}
              <a href="mailto:hola@kumespacio.com.ar" className="text-purple-600 hover:underline">
                hola@kumespacio.com.ar
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-neutral-500 hover:text-black transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
