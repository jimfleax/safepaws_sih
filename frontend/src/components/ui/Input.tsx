import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-[var(--radius-12)] border bg-[var(--color-surface)] px-4 py-2 text-[length:var(--text-body)] text-[var(--color-ink)] transition-colors",
          "placeholder:text-[var(--color-ink-soft)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]" : "border-[var(--color-border)]",
          "min-h-[44px]", // minimum touch target
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
