import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-[var(--radius-12)] border bg-[var(--color-surface)] px-4 py-3 text-[length:var(--text-body)] text-[var(--color-ink)] transition-colors",
          "placeholder:text-[var(--color-ink-soft)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]" : "border-[var(--color-border)]",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
