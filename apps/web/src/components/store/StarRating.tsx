import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, max = 5, className, size = 'md' }: StarRatingProps) {
  const sizeMap = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < value ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-200 text-neutral-200',
          )}
        />
      ))}
    </div>
  );
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function InteractiveStarRating({
  value,
  onChange,
  max = 5,
}: InteractiveStarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors cursor-pointer',
              i < value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-neutral-200 text-neutral-200 hover:fill-yellow-200 hover:text-yellow-200',
            )}
          />
        </button>
      ))}
    </div>
  );
}
