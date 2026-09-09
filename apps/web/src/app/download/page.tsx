'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Download, AlertCircle, Loader2 } from 'lucide-react';
import { verifyDownloadToken } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface DownloadItem {
  title: string;
  downloadUrl: string;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<DownloadItem[]>([]);

  useEffect(() => {
    if (!token) {
      setError('Token de descarga no válido o expirado.');
      setLoading(false);
      return;
    }

    verifyDownloadToken(token)
      .then((data) => {
        if (data.valid && data.items) {
          setItems(data.items);
        } else {
          setError('El enlace de descarga no es válido o expiró.');
        }
      })
      .catch(() => {
        setError('Error al verificar el enlace. Intentá nuevamente.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-neutral-500">Verificando enlace de descarga...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-center py-20 max-w-sm mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-xl font-black text-neutral-900 mb-2">Enlace inválido</h1>
        <p className="text-neutral-500 text-sm">{error}</p>
        <p className="text-xs text-neutral-400 mt-3">
          Si creés que es un error, contactanos a hola@kume.com con tu número de pedido.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center py-16 max-w-md mx-auto px-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <Download className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-black text-neutral-900 mb-2">
        ¡Tu descarga está lista!
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Hacé clic en el botón para descargar tu producto.
      </p>

      <div className="w-full space-y-3">
        {items.map((item, i) => (
          <a
            key={i}
            href={`/api${item.downloadUrl}`}
            download
            className="flex items-center justify-between w-full rounded-xl border border-neutral-200 bg-white p-4 hover:border-black hover:shadow-sm transition-all group"
          >
            <span className="font-medium text-neutral-800 text-sm text-left">
              {item.title}
            </span>
            <Button size="sm" className="gap-1.5 ml-4 shrink-0">
              <Download className="h-3.5 w-3.5" />
              Descargar
            </Button>
          </a>
        ))}
      </div>

      <p className="text-xs text-neutral-400 mt-8">
        Este enlace tiene una vigencia limitada. Guardá el archivo una vez descargado.
      </p>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-neutral-400">Cargando...</div>}>
      <DownloadContent />
    </Suspense>
  );
}
