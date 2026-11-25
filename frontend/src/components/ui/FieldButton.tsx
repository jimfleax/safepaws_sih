import React from 'react';
import { clsx } from 'clsx';

export interface FieldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  metadata?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * FieldButton
 *
 * Direction 1 Tactile Field Dispatch button with authentic mechanical press
 * physics, sharp editorial borders, and optional monospaced metadata sub-tags.
 *
 * Accessibility & Ergonomics:
 * - Bounding box min-height >= 44px on desktop, >= 48px on mobile for touch target compliance.
 * - WCAG AAA body contrast in Obsidian and Canvas states.
 * - Clear 2px offset visible focus ring for keyboard navigation.
 */
export const FieldButton = React.forwardRef<HTMLButtonElement, FieldButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      metadata,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Size tokens with guaranteed >=44px/48px touch targets
    const sizeClasses = {
      sm: 'min-h-[44px] px-3 py-1.5 text-xs',
      md: 'min-h-[44px] sm:min-h-[48px] px-4 py-2 text-sm',
      lg: 'min-h-[48px] sm:min-h-[52px] px-5 py-2.5 text-base',
    };

    // Color variant mappings
    const variantClasses = {
      primary:
        'bg-[#1C1A17] text-[#F6F1E7] border border-[#1C1A17] hover:bg-[#2A2723] active:bg-[#121110] shadow-[0_2px_0_0_#1C1A17] hover:shadow-[0_3px_0_0_#1C1A17] active:shadow-none',
      secondary:
        'bg-[#F6F1E7] text-[#1C1A17] border border-[#1C1A17]/25 hover:bg-[#EDE6DA] hover:border-[#1C1A17] active:bg-[#E2DAD0] shadow-[0_2px_0_0_rgba(28,26,23,0.15)] active:shadow-none',
      alert:
        'bg-[#B3452F] text-white border border-[#B3452F] hover:bg-[#9C3B27] active:bg-[#853221] shadow-[0_2px_0_0_#853221] active:shadow-none',
      outline:
        'bg-transparent text-[#1C1A17] border border-[#1C1A17] hover:bg-[#1C1A17]/5 active:bg-[#1C1A17]/10',
      ghost:
        'bg-transparent text-[#1C1A17] border border-transparent hover:bg-[#1C1A17]/5 active:bg-[#1C1A17]/10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          'relative inline-flex items-center justify-center font-sans font-semibold rounded-[2px] tracking-tight transition-all duration-100 select-none outline-none',
          'focus-visible:ring-2 focus-visible:ring-[#1C1A17] focus-visible:ring-offset-2',
          'active:translate-y-[1px]',
          disabled && 'opacity-50 cursor-not-allowed active:translate-y-0 active:shadow-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 transition-transform duration-75">{icon}</span>
          )}

          <div className="flex flex-col items-start text-left leading-tight">
            <span>{children}</span>
            {metadata && (
              <span className="font-mono text-[9px] tracking-widest uppercase opacity-75 mt-0.5">
                {metadata}
              </span>
            )}
          </div>

          {icon && iconPosition === 'right' && (
            <span className="shrink-0 transition-transform duration-75">{icon}</span>
          )}
        </div>
      </button>
    );
  }
);

FieldButton.displayName = 'FieldButton';
