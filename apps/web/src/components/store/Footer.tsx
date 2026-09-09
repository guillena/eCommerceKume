import Link from 'next/link';

const storeLinks = [
  { href: '/productos', label: 'Todos los productos' },
  { href: '/productos?category=ebooks', label: 'Ebooks' },
  { href: '/productos?category=plantillas', label: 'Plantillas' },
];

const helpLinks = [
  { label: 'Contacto', href: 'mailto:hola@kume.com' },
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="kume logo" className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
              Activos digitales de calidad para profesionales y emprendedores.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Tienda
            </h4>
            <ul className="space-y-2">
              {storeLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Ayuda
            </h4>
            <ul className="space-y-2">
              {helpLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Legal
            </h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Los productos son digitales y no son reembolsables una vez descargados.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          {/* suppressHydrationWarning prevents mismatch from timezone differences between server/client */}
          <p className="text-xs text-neutral-400" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} Kume. Todos los derechos reservados.
          </p>
          <p className="text-xs text-neutral-400">
            Pagos procesados de forma segura por MercadoPago.
          </p>
        </div>
      </div>
    </footer>
  );
}
