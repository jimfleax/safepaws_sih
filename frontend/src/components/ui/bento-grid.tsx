import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const BentoGrid = ({ className, children, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[22rem]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  background?: React.ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
  onClick?: () => void;
}

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
  ...props
}: BentoCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-[var(--radius-24)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 shadow-[var(--shadow-card)] transition-all",
        "hover:border-[var(--color-ink-soft)] hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
      {...props}
    >
      {/* Background Layer */}
      {background && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          {background}
        </div>
      )}

      {/* Top Slot: Icon */}
      <div className="relative z-10 flex items-center justify-between">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-12)] border border-[var(--color-border)] bg-[var(--color-bone)] text-[var(--color-ink)] shadow-sm group-hover:scale-105 transition-transform">
            <Icon className="h-6 w-6 text-[var(--color-ink)]" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 flex flex-col gap-2 mt-auto">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-ink)] tracking-tight">
          {name}
        </h3>
        <p className="max-w-lg text-sm text-[var(--color-ink-soft)] leading-relaxed">
          {description}
        </p>

        {cta && (
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-marigold)] group-hover:text-[var(--color-accent-hover)] transition-colors">
            <span>{cta}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};
