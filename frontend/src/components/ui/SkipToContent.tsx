import React from 'react';
import { cn } from '../../lib/utils';

export interface SkipToContentProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
  label?: string;
}

export const SkipToContent = React.forwardRef<HTMLAnchorElement, SkipToContentProps>(
  ({ className, targetId = 'main-content', label = 'Skip to main content', ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${targetId}`}
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
          "bg-[var(--color-ink)] text-[var(--color-bone)] px-4 py-2.5 rounded-[var(--radius-12)] font-semibold text-sm",
          "shadow-lg ring-2 ring-[var(--color-focus)] outline-none min-h-[44px] inline-flex items-center justify-center",
          "transition-all duration-[var(--duration-micro)] select-none",
          className
        )}
        {...props}
      >
        {label}
      </a>
    );
  }
);

SkipToContent.displayName = 'SkipToContent';
