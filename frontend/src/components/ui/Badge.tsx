import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'alert' | 'scout' | 'telemetry' | 'outline' | 'neutral';
  pulse?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', pulse = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[length:var(--text-metadata)] font-medium transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2",
          {
            // Default: Carbon Ink on Bone
            'bg-[var(--color-ink)] text-[var(--color-bone)]': variant === 'default',
            // Accent: Safety Gold / Marigold
            'bg-[var(--color-accent)] text-white': variant === 'accent',
            // Success: Verified Emerald
            'bg-[var(--color-success)] text-white': variant === 'success',
            // Danger: Destructive Red
            'bg-[var(--color-danger)] text-white': variant === 'danger',
            // Alert: Crisis Clay Red
            'bg-[var(--color-alert-clay)] text-white': variant === 'alert',
            // Scout: Trail Olive for volunteer network
            'bg-[var(--color-trail)] text-white': variant === 'scout',
            // Telemetry: Monospace tabular badge for vector / GPS data
            'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] font-mono text-[11px]': variant === 'telemetry',
            // Outline: Subtle border with ink text
            'border border-[var(--color-border)] text-[var(--color-ink)] bg-transparent': variant === 'outline',
            // Neutral: Soft secondary gray
            'bg-[var(--color-bone)] text-[var(--color-ink-soft)] border border-[var(--color-border)]': variant === 'neutral',
          },
          className
        )}
        {...props}
      >
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
