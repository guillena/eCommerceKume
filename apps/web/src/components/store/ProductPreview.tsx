'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPreviewProps {
  previewUrl: string;
  previewPages: number;
}

export function ProductPreview({ previewUrl, previewPages }: ProductPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err.message);
      });
    } else {
      await document.exitFullscreen();
    }
  };

  // Add #toolbar=0 to disable the native download/print buttons
  const pdfUrl = `${previewUrl}#toolbar=0`;

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col w-full overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-screen p-4 bg-white z-50' : 'p-4'}`}
    >
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h2 className="font-bold text-neutral-900 mb-1 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Vista previa gratuita
          </h2>
          {!isFullscreen && (
            <p className="text-xs text-neutral-500">
              Las páginas disponibles para visualizar.
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="shrink-0 gap-2"
          type="button"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span>Salir</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              <span>Ampliar</span>
            </>
          )}
        </Button>
      </div>

      <div className={`w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 flex-1 ${!isFullscreen ? 'h-[400px]' : ''}`}>
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title="Vista previa del producto"
        />
      </div>
    </div>
  );
}

