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
        <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-[#63684B] uppercase mb-7">
          <span className="w-5 h-px bg-[#63684B] inline-block" />
          Your neighborhood, connected
        </span>

        {/* Big serif heading — NO encoding corruption */}
        <h2 className="font-serif text-[36px] sm:text-[52px] lg:text-[60px] leading-[1.08] tracking-[-0.02em] text-[#1C1A17] font-normal mb-10">
          Because the best search party is the one{' '}
          <em className="not-italic text-[#E2811F]">that's already there.</em>
        </h2>

        {/* CTA Button */}
        <button
          id="cta-start-safepaws-btn"
          onClick={onStartClick}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E2811F] hover:bg-[#CA721A] active:bg-[#B06317] text-white font-semibold text-[16px] shadow-[0_6px_22px_rgba(226,129,31,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(226,129,31,0.38)] active:translate-y-0 cursor-none"
          aria-label="Get started with SafePaws"
        >
          <span>Start with SafePaws</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
};
