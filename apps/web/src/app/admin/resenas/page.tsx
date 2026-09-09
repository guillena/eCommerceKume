'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Check, X, Trash2 } from 'lucide-react';
import { adminFetchReviews, adminApproveReview, adminDeleteReview } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/store/StarRating';

export default function AdminResenasPage() {
  const queryClient = useQueryClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: adminFetchReviews,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      adminApproveReview(id, approved),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const pending = reviews?.filter((r) => !r.approved) ?? [];
  const approved = reviews?.filter((r) => r.approved) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Reseñas</h1>
        <p className="text-neutral-500 text-sm mt-1">
          {pending.length} pendiente{pending.length !== 1 ? 's' : ''} de aprobación
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-bold text-neutral-700 mb-3 text-sm uppercase tracking-wider">
            Pendientes
          </h2>
          <div className="space-y-3">
            {pending.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                apiUrl={apiUrl}
                onApprove={() => approveMutation.mutate({ id: review.id, approved: true })}
                onReject={() => deleteMutation.mutate(review.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <h2 className="font-bold text-neutral-700 mb-3 text-sm uppercase tracking-wider">
          Aprobadas ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-neutral-400 text-sm">No hay reseñas aprobadas.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                apiUrl={apiUrl}
                onReject={() => approveMutation.mutate({ id: review.id, approved: false })}
                onDelete={() => {
                  if (confirm('¿Eliminar esta reseña definitivamente?')) {
                    deleteMutation.mutate(review.id);
                  }
                }}
                isApproved
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewRow({
  review,
  apiUrl,
  onApprove,
  onReject,
  onDelete,
  isApproved = false,
}: {
  review: {
    id: string;
    authorName: string;
    stars: number;
    comment?: string | null;
    createdAt: string;
    verified: boolean;
    product?: { title: string; coverImage: string };
  };
  apiUrl: string;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  isApproved?: boolean;
}) {
  const coverSrc = review.product?.coverImage?.startsWith('http')
    ? review.product.coverImage
    : `${apiUrl}${review.product?.coverImage}`;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4">
      {/* Product cover */}
      {review.product?.coverImage && (
        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
          <Image src={coverSrc} alt={review.product.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-medium text-sm text-neutral-900">{review.authorName}</span>
          <StarRating value={review.stars} size="sm" />
          {review.verified && (
            <Badge variant="success" className="text-[10px]">Verificada</Badge>
          )}
          <span className="text-xs text-neutral-400">{formatDate(review.createdAt)}</span>
        </div>
        {review.product && (
          <p className="text-xs text-neutral-400 mb-1">{review.product.title}</p>
        )}
        {review.comment && (
          <p className="text-sm text-neutral-700 leading-relaxed">{review.comment}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!isApproved && onApprove && (
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={onApprove}
            title="Aprobar"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        {isApproved && onReject && (
          <Button
            size="icon"
            variant="ghost"
            className="text-neutral-400 hover:text-neutral-700"
            onClick={onReject}
            title="Quitar aprobación"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {(onDelete ?? onReject) && (
          <Button
            size="icon"
            variant="ghost"
            className="text-neutral-400 hover:text-red-500"
            onClick={isApproved ? onDelete : onReject}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
