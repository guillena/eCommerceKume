'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitReview } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InteractiveStarRating } from '@/components/store/StarRating';

export function ReviewForm({ productId }: { productId: string }) {
  const [stars, setStars] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () => submitReview({ productId, stars, authorName: name, comment }),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">¡Gracias por tu reseña!</p>
        <p className="text-sm text-green-700 mt-1">
          Será revisada y publicada pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-6 space-y-4">
      <h3 className="font-bold text-neutral-900">Dejá tu reseña</h3>

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-2 block">
          Calificación
        </label>
        <InteractiveStarRating value={stars} onChange={setStars} />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
          Nombre
        </label>
        <Input
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
          Comentario (opcional)
        </label>
        <Textarea
          placeholder="¿Qué te pareció el producto?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">
          Error al enviar la reseña. Intenta nuevamente.
        </p>
      )}

      <Button
        onClick={() => mutation.mutate()}
        disabled={stars === 0 || !name.trim() || mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? 'Enviando...' : 'Enviar reseña'}
      </Button>
    </div>
  );
}
