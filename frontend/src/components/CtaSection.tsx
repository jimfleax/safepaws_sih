import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CtaSectionProps {
  onStartClick: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartClick }) => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children || [], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24"
    >
      <div className="w-full bg-[var(--color-ink)] rounded-[var(--radius-28)] px-8 sm:px-16 py-16 sm:py-24 relative overflow-hidden flex flex-col items-center text-center">
        {/* Subtle decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[1px] border-[var(--color-bone)]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[1px] border-[var(--color-bone)]/5 pointer-events-none" />

        <div ref={contentRef} className="relative z-10 max-w-2xl flex flex-col items-center">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[var(--color-bone)]/60 uppercase mb-8">
            <span className="w-6 h-[1px] bg-[var(--color-bone)]/60" />
            Join the network
            <span className="w-6 h-[1px] bg-[var(--color-bone)]/60" />
          </span>

          {/* Big serif heading */}
          <h2 className="font-serif text-[44px] sm:text-[60px] lg:text-[72px] leading-[1.05] tracking-tight text-[var(--color-bone)] font-normal mb-12">
            The best search party is the one{' '}
            <em className="not-italic text-[var(--color-accent)] relative inline-block">
              already there.
            </em>
          </h2>

          {/* CTA Button */}
          <button
            onClick={onStartClick}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-[var(--color-bone)] font-bold text-[14px] uppercase tracking-[0.1em] rounded-full shadow-[0_8px_24px_rgba(226,129,31,0.25)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(226,129,31,0.35)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-accent)] cursor-pointer"
          >
            <span>Start with SafePaws</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
