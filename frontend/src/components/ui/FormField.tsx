import React from 'react';
import { cn } from '../../lib/utils';

export const FormField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
);
FormField.displayName = 'FormField';

export const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-[length:var(--text-label-button)] font-medium text-[var(--color-ink)]", className)}
      {...props}
    />
  )
);
FormLabel.displayName = 'FormLabel';

export const FormError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        className={cn("text-[length:var(--text-error-failure)] text-[var(--color-danger)]", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormError.displayName = 'FormError';
