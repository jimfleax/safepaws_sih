import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'alert' | 'scanner';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? true : undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[var(--radius-16)] font-semibold transition-all select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          "active:scale-[0.98] motion-reduce:active:scale-100",
          "min-h-[44px] min-w-[44px]", // Minimum WCAG touch target 44x44px
          {
            // Primary: Rich Carbon Ink on Bone canvas
            'bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[#2D2A26] shadow-sm active:bg-[#121110]': variant === 'primary',
            // Accent: Safety Gold / Marigold with dark ink text (6.11:1 contrast for WCAG AA compliance)
            'bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] shadow-sm': variant === 'accent',
            // Secondary: Clean White surface with crisp boundary
            'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-bone)] hover:border-[var(--color-ink-soft)]': variant === 'secondary',
            // Outline: 2px Carbon Ink border
            'border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)]': variant === 'outline',
            // Ghost: Subtle highlight on hover
            'hover:bg-[var(--color-bone)] text-[var(--color-ink)]': variant === 'ghost',
            // Alert: High-urgency crisis clay red
            'bg-[var(--color-alert-clay)] text-white hover:bg-[#9A3926] active:bg-[#852E1D] shadow-sm': variant === 'alert',
            // Danger: Distinct destructive action red
            'bg-[var(--color-danger)] text-white hover:opacity-90 active:bg-[#B71C1C] shadow-sm': variant === 'danger',
            // Scanner: Deep carbon with translucent glass border for Biometric HUD
            'bg-[var(--color-surface-dark-raised)] text-[var(--color-ink-dark)] border border-[var(--color-border-dark)] hover:border-[var(--color-accent)] hover:shadow-glow-marigold': variant === 'scanner',

            // Sizes
            'h-11 px-5 py-2 text-[length:var(--text-label-button)]': size === 'default',
            'h-9 px-3.5 text-xs rounded-[var(--radius-12)]': size === 'sm',
            'h-14 px-8 text-base tracking-wide rounded-[var(--radius-24)]': size === 'lg',
            'h-11 w-11 p-0': size === 'icon',

            // Full Width
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
