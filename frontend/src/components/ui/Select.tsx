import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-[var(--radius-12)] border bg-[var(--color-surface)] px-4 py-2 text-[length:var(--text-body)] text-[var(--color-ink)] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]" : "border-[var(--color-border)]",
          "min-h-[44px] appearance-none",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
