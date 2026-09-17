import React from 'react';
import { cn } from '../../lib/utils';

export const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode }
>(({ className, title, description, action, icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center p-8 text-center rounded-[var(--radius-24)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-background)]",
      className
    )}
    {...props}
  >
    {icon && <div className="mb-4 text-[var(--color-ink-soft)]">{icon}</div>}
    <h3 className="text-[length:var(--text-card-heading)] font-semibold text-[var(--color-ink)] mb-2">{title}</h3>
    {description && <p className="text-[length:var(--text-body)] text-[var(--color-ink-soft)] mb-6 max-w-md">{description}</p>}
    {action && <div>{action}</div>}
  </div>
));
EmptyState.displayName = 'EmptyState';
