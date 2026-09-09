import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-white hover:bg-black shadow-sm hover:shadow-md',
        outline:
          'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300',
        ghost:
          'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        secondary:
          'bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        // Pastel variants from kume design system
        blue:
          'text-neutral-900 hover:opacity-90 shadow-sm',
        lila:
          'text-neutral-900 hover:opacity-90 shadow-sm',
        mint:
          'text-neutral-900 hover:opacity-90 shadow-sm',
        cream:
          'text-neutral-900 hover:opacity-90 shadow-sm',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        link:
          'text-neutral-900 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Pastel background map for inline styles
const pastelBg: Record<string, string> = {
  blue: '#B9D3FD',
  lila: '#E3B9FD',
  mint: '#B9FDC1',
  cream: '#FDE3B9',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    void asChild; // consumed, not passed to DOM
    const pastel = variant && pastelBg[variant as string];
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={pastel ? { backgroundColor: pastel, ...style } : style}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
