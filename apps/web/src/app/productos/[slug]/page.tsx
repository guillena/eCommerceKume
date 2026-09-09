export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, FileText, Download, Check, ArrowLeft } from 'lucide-react';
import { fetchProductBySlug, fetchProductReviews } from '@/lib/api';
import { formatPrice, formatDate, formatFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/store/StarRating';
import { ProductPreview } from '@/components/store/ProductPreview';
import { AddToCartButton } from './AddToCartButton';
import { ReviewForm } from './ReviewForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProductBySlug(slug);
    return {
      title: product.title,
      description: product.tagline,
      openGraph: {
        title: product.title,
        description: product.tagline,
        images: product.coverImage ? [product.coverImage] : [],
      },
    };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    notFound();
  }

  const reviews = await fetchProductReviews(product.id).catch(() => []);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const coverSrc = product.coverImage?.startsWith('http')
    ? product.coverImage
    : `${apiUrl}${product.coverImage}`;

  const avgStars =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Volver */}
      <Link
        href="/productos"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Cover */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-2xl">
            {product.coverImage ? (
              <Image
                src={coverSrc}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">📄</div>
            )}
          </div>

          {/* File info */}
          <div className="max-w-sm mx-auto lg:mx-0 rounded-xl border border-neutral-200 p-4 bg-neutral-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Tipo</p>
                <p className="font-semibold text-sm uppercase">{product.fileType}</p>
              </div>
              {product.pageCount && (
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Páginas</p>
                  <p className="font-semibold text-sm">{product.pageCount}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Tamaño</p>
                <p className="font-semibold text-sm">{formatFileSize(product.fileSizeBytes)}</p>
              </div>
            </div>
            
            {/* Preview (Left Column) */}
            {product.previewUrl && (
              <div className="max-w-sm mx-auto lg:mx-0 w-full mt-8">
                <ProductPreview 
                  previewUrl={product.previewUrl.startsWith('/api/') ? product.previewUrl : `${apiUrl}${product.previewUrl}`}
                  previewPages={product.previewPages} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{product.category?.name}</Badge>
              {product.isFeatured && <Badge variant="default">Destacado</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {product.title}
            </h1>
            <p className="mt-3 text-lg text-neutral-500">{product.tagline}</p>
          </div>

          {/* Rating */}
          {avgStars !== null && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgStars)} size="md" />
              <span className="text-sm text-neutral-600">
                {avgStars.toFixed(1)} ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-4xl font-black">
              {formatPrice(product.price, product.currency)}
            </span>
            <AddToCartButton product={product} />
          </div>

          <Separator />

          {/* Additional Info */}
          {(product.duration || product.targetAudience || product.attendeeCount) && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
              <div className="space-y-2 text-sm text-neutral-700">
                {product.duration && (
                  <p><span className="font-semibold text-neutral-900">Duración:</span> {product.duration}</p>
                )}
                {product.targetAudience && (
                  <p><span className="font-semibold text-neutral-900">Destinatarios:</span> {product.targetAudience}</p>
                )}
                {product.attendeeCount && (
                  <p><span className="font-semibold text-neutral-900">Cantidad de asistentes:</span> {product.attendeeCount}</p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-bold text-neutral-900 mb-3">Descripción</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Benefits */}
          {product.benefits?.length > 0 && (
            <div>
              <h2 className="font-bold text-neutral-900 mb-3">¿Qué vas a aprender?</h2>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Objectives */}
          {product.objectives?.length > 0 && (
            <div>
              <h2 className="font-bold text-neutral-900 mb-3">Objetivos del producto</h2>
              <ul className="space-y-2">
                {product.objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Reviews */}
      <Separator className="my-16" />
      <div className="max-w-2xl">
        <h2 className="text-2xl font-black tracking-tight mb-8">
          Reseñas {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length === 0 && (
          <p className="text-neutral-500 mb-8">Todavía no hay reseñas. ¡Sé el primero!</p>
        )}

        <div className="space-y-6 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarRating value={review.stars} size="sm" />
                  <span className="text-sm font-medium text-neutral-700">
                    {review.authorName}
                  </span>
                  {review.verified && (
                    <Badge variant="success" className="text-[10px]">
                      Compra verificada
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-neutral-400">{formatDate(review.createdAt)}</span>
              </div>
              {review.comment && (
                <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>

        <ReviewForm productId={product.id} />
      </div>
    </div>
  );
}
