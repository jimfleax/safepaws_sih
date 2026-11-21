import React, { createContext, useContext, useId } from 'react';
import { cn } from '../../lib/utils';

export interface FormFieldContextValue {
  id: string;
  hasError: boolean;
  errorId: string;
  descriptionId: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const useFormField = () => {
  return useContext(FormFieldContext);
};

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  hasError?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, id: customId, hasError = false, children, ...props }, ref) => {
    const reactId = useId();
    const id = customId || `field-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;

    return (
      <FormFieldContext.Provider value={{ id, hasError, errorId, descriptionId }}>
        <div ref={ref} className={cn("space-y-2 w-full", className)} {...props}>
          {children}
        </div>
      </FormFieldContext.Provider>
    );
  }
);
FormField.displayName = 'FormField';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, htmlFor: customHtmlFor, required, children, ...props }, ref) => {
    const context = useFormField();
    const htmlFor = customHtmlFor || context?.id;

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "block text-[length:var(--text-label-button)] font-medium text-[var(--color-ink)] select-none",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-[var(--color-alert-clay)] ml-1" aria-hidden="true">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export const FormHelperText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, id: customId, ...props }, ref) => {
    const context = useFormField();
    const id = customId || context?.descriptionId;

    return (
      <p
        ref={ref}
        id={id}
        className={cn("text-[length:var(--text-metadata)] text-[var(--color-ink-soft)]", className)}
        {...props}
      />
    );
  }
);
FormHelperText.displayName = 'FormHelperText';

export const FormError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, id: customId, children, ...props }, ref) => {
    const context = useFormField();
    const id = customId || context?.errorId;

    if (!children) return null;
    return (
      <p
        ref={ref}
        id={id}
        role="alert"
        className={cn(
          "text-[length:var(--text-error-failure)] font-medium text-[var(--color-danger)] flex items-center gap-1",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormError.displayName = 'FormError';
