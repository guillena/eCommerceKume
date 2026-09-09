import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Política de privacidad</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">1. Información que recopilamos</h2>
            <p>
              Al realizar una compra, recopilamos su nombre y dirección de correo electrónico únicamente para
              procesar el pedido y enviarle el enlace de descarga del producto adquirido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">2. Uso de la información</h2>
            <p>Utilizamos sus datos para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Procesar y entregar su compra.</li>
              <li>Enviarle el enlace de descarga por email.</li>
              <li>Comunicarnos con usted en caso de problemas con su pedido.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">3. Compartir información</h2>
            <p>
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto con
              Mercado Pago para procesar el pago de forma segura. Mercado Pago tiene su propia política de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">4. Seguridad</h2>
            <p>
              Implementamos medidas de seguridad para proteger su información personal. Los datos de pago
              son procesados directamente por Mercado Pago y no son almacenados en nuestros servidores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">5. Cookies</h2>
            <p>
              Este sitio puede utilizar cookies técnicas necesarias para su funcionamiento.
              No utilizamos cookies de seguimiento o publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">6. Sus derechos</h2>
            <p>
              Puede solicitar la eliminación de sus datos personales escribiéndonos a{' '}
              <a href="mailto:hola@kumespacio.com.ar" className="text-purple-600 hover:underline">
                hola@kumespacio.com.ar
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">7. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta política, escríbanos a{' '}
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
