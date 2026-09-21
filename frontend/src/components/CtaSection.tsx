import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';

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
        y: 32,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      <div ref={contentRef} className="max-w-3xl">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] text-[var(--color-trail)] uppercase mb-7">
          <span className="w-6 h-px bg-[var(--color-trail)] inline-block" />
          Your neighborhood, connected
        </span>

        {/* Big serif heading */}
        <h2 className="font-serif text-[40px] sm:text-[56px] lg:text-[68px] leading-[1.08] tracking-tight text-[var(--color-ink)] font-normal mb-10">
          Because the best search party is the one{' '}
          <em className="not-italic text-[var(--color-accent)]">that's already there.</em>
        </h2>

        {/* CTA Button */}
        <MagneticButton
          onClick={onStartClick}
          className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] text-white font-bold text-[15px] uppercase tracking-wide shadow-[0_8px_24px_rgba(226,129,31,0.35)] transition-colors duration-300 hover:shadow-[0_16px_32px_rgba(226,129,31,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-accent)] cursor-pointer"
        >
          <span>Start with SafePaws</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </MagneticButton>
      </div>
    </section>
  );
};
