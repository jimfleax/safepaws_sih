import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'danger' | 'outline';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[length:var(--text-metadata)] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2",
          {
            'bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[var(--color-ink-soft)]': variant === 'default',
            'bg-[var(--color-success)] text-white': variant === 'success',
            'bg-[var(--color-danger)] text-white': variant === 'danger',
            'border border-[var(--color-border)] text-[var(--color-ink)]': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
