import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';
import { useFormField } from './FormField';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, wrapperClassName, error: customError, id: customId, 'aria-describedby': customDescribedBy, children, ...props }, ref) => {
    const formField = useFormField();
    const id = customId || formField?.id;
    const isError = customError !== undefined ? customError : formField?.hasError;
    const describedBy =
      customDescribedBy ||
      (isError
        ? formField?.errorId
        : formField?.descriptionId || undefined);

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        <select
          ref={ref}
          id={id}
          aria-invalid={isError ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-12 w-full appearance-none items-center justify-between rounded-[var(--radius-12)] border bg-[var(--color-surface)] px-4 py-2 pr-10 text-[length:var(--text-body)] text-[var(--color-ink)] transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isError
              ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]"
              : "border-[var(--color-border)] focus-visible:border-[var(--color-focus)]",
            "min-h-[44px]", // Minimum WCAG touch target
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-soft)]"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = 'Select';
