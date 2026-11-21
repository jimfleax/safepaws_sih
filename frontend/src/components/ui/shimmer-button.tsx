import React from 'react';
import { cn } from '../../lib/utils';

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  children: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      className,
      children,
      shimmerColor = 'rgba(255, 255, 255, 0.4)',
      shimmerDuration = '2.5s',
      borderRadius = 'var(--radius-16)',
      background = 'var(--color-ink)',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{
          borderRadius,
          backgroundColor: background,
        }}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden px-6 py-3 font-semibold text-[var(--color-bone)] select-none shadow-md transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          "active:scale-[0.98] motion-reduce:active:scale-100",
          "min-h-[44px] min-w-[44px]", // Minimum WCAG touch target
          className
        )}
        {...props}
      >
        {/* Shimmer Sweep Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-slide motion-reduce:hidden"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            animationDuration: shimmerDuration,
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2 font-medium">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
