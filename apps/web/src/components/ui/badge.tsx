import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:   'border-transparent bg-neutral-900 text-white',
        secondary: 'border-transparent bg-neutral-100 text-neutral-700',
        outline:   'border-neutral-200 text-neutral-700',
        success:   'border-transparent text-neutral-800',
        warning:   'border-transparent text-neutral-800',
        destructive: 'border-transparent bg-red-100 text-red-700',
        info:      'border-transparent text-neutral-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Pastel background for semantic variants
const pastelBg: Record<string, string> = {
  success: '#B9FDC1',
  warning: '#FDE3B9',
  info:    '#B9D3FD',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const bg = variant && pastelBg[variant as string];
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={bg ? { backgroundColor: bg, ...style } : style}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
