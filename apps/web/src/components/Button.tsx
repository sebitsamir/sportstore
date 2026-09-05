import { cn } from '@/lib/config';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'light' | 'ghost' | 'danger';

const styles: Record<Variant, string> = {
  primary:
    'bg-pitch text-white hover:bg-pitch-deep shadow-sm',
  accent:
    'bg-court text-white hover:bg-court-hot shadow-sm',
  light:
    'bg-white/90 text-ink hover:bg-white border border-white/40',
  ghost:
    'bg-transparent text-ink border border-line hover:border-pitch hover:text-pitch',
  danger:
    'bg-danger text-white hover:opacity-90',
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold tracking-wide transition duration-200 disabled:opacity-50',
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
