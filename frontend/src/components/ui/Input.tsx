import React from 'react';
import { cn } from '../../lib/utils';
import { useFormField } from './FormField';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      error: customError,
      id: customId,
      'aria-describedby': customDescribedBy,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
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
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={isError ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-12 w-full rounded-[var(--radius-12)] border bg-[var(--color-surface)] px-4 py-2 text-[length:var(--text-body)] text-[var(--color-ink)] transition-colors",
            "placeholder:text-[var(--color-ink-soft)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            isError
              ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)] text-[var(--color-danger)]"
              : "border-[var(--color-border)] focus-visible:border-[var(--color-focus)]",
            "min-h-[44px]", // Minimum WCAG touch target
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
