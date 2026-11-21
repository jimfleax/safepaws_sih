import React from 'react';
import { PawIcon } from './Header';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenGuidelines?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenGuidelines,
  onOpenContact,
}) => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 pt-20">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
        {/* Left: Brand */}
        <div className="flex flex-col items-center md:items-start gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <PawIcon className="w-6 h-6 text-[var(--color-ink)] transition-transform group-hover:scale-105" />
            <span className="font-serif text-[22px] tracking-tight text-[var(--color-ink)]">
              SafePaws
            </span>
          </div>
          <p className="text-[14px] text-[var(--color-ink-soft)] max-w-xs text-center md:text-left">
            The world's first biometric identity platform for dogs. Built for recovery, driven by community.
          </p>
        </div>

        {/* Right: Essential Links & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex items-center gap-6 sm:gap-10 font-bold text-[11px] tracking-[0.1em] uppercase text-[var(--color-ink)]">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={onOpenGuidelines}
              className="hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            >
              Guidelines
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
          
          <div className="text-[var(--color-trail)] text-[12px] font-medium tracking-wide">
            © 2026 SafePaws System
          </div>
        </div>
      </div>
    </footer>
  );
};
