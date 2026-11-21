import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'crisis' | 'dark' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-24)] transition-all",
        {
          // Default: Crisp White surface with subtle boundary
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-card)]': variant === 'default',
          // Interactive: Hover elevation and tactile cursor
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-card)] hover:border-[var(--color-ink-soft)] hover:shadow-[var(--shadow-card-hover)] cursor-pointer': variant === 'interactive',
          // Crisis: High-urgency alert container with clay border
          'border-2 border-[var(--color-alert-clay)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-md': variant === 'crisis',
          // Dark: Deep Carbon HUD card for scanner mode
          'border border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] text-[var(--color-ink-dark)] shadow-lg': variant === 'dark',
          // Glass: Translucent blurred surface
          'border border-[var(--color-border)] bg-[var(--color-surface-raised)] backdrop-blur-md text-[var(--color-ink)] shadow-sm': variant === 'glass',
        },
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-[length:var(--text-card-heading)] font-semibold leading-tight tracking-tight text-[var(--color-ink)]", className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[length:var(--text-metadata)] text-[var(--color-ink-soft)] leading-normal", className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 border-t border-[var(--color-border)]/60 mt-4", className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
