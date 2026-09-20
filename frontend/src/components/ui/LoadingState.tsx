import React from 'react';
import { cn } from '../../lib/utils';

export const LoadingState = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { text?: string }>(
  ({ className, text = 'Loading...', ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}
      {...props}
    >
      <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
      {text && <p className="text-[length:var(--text-metadata)] text-[var(--color-ink-soft)]">{text}</p>}
    </div>
  )
);
LoadingState.displayName = 'LoadingState';
