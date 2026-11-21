import React from 'react';
import { cn } from '../../lib/utils';
import { useFormField } from './FormField';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, error: customError, id: customId, 'aria-describedby': customDescribedBy, ...props }, ref) => {
    const formField = useFormField();
    const id = customId || formField?.id;
    const isError = customError !== undefined ? customError : formField?.hasError;
    const describedBy =
      customDescribedBy ||
      (isError
        ? formField?.errorId
        : formField?.descriptionId || undefined);

    return (
      <div className={cn("w-full", wrapperClassName)}>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={isError ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex min-h-[96px] w-full rounded-[var(--radius-12)] border bg-[var(--color-surface)] px-4 py-3 text-[length:var(--text-body)] text-[var(--color-ink)] transition-colors",
            "placeholder:text-[var(--color-ink-soft)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isError
              ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]"
              : "border-[var(--color-border)] focus-visible:border-[var(--color-focus)]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
