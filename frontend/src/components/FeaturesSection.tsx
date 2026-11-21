import React, { useRef, useEffect } from 'react';
import { Fingerprint, Share2, Scan, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeaturesSectionProps {
  onOpenBiometric: () => void;
  onOpenNetwork: () => void;
  onOpenQrTags: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onOpenBiometric,
  onOpenNetwork,
  onOpenQrTags,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
      });

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
          opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
      {/* Editorial Header */}
      <div ref={headerRef} className="flex flex-col mb-16 sm:mb-24">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[var(--color-trail)] uppercase mb-4 inline-flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[var(--color-trail)]" />
          The SafePaws System
        </span>
        <h2 className="font-serif text-[40px] sm:text-[56px] text-[var(--color-ink)] leading-[1.1] max-w-2xl">
          Complete protection,<br/>built on certainty.
        </h2>
      </div>

      {/* Asymmetrical Layout */}
      <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Primary Feature: Biometric AI */}
        <div
          onClick={onOpenBiometric}
          className="group relative lg:col-span-12 flex flex-col md:flex-row gap-8 lg:gap-16 cursor-pointer"
        >
          {/* Left Text */}
          <div className="md:w-5/12 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full border border-[var(--color-ink)]/20 flex items-center justify-center mb-8 text-[var(--color-ink)] transition-colors group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-bone)]">
              <Fingerprint className="w-5 h-5" />
            </div>
            
            <h3 className="font-serif text-[32px] sm:text-[44px] text-[var(--color-ink)] leading-tight mb-6">
              Nose-print Biometrics
            </h3>
            <p className="text-[16px] sm:text-[18px] leading-relaxed text-[var(--color-ink-soft)] mb-10">
              We turn your dog's unique nose pattern into an unlosable identity record. It's like a fingerprint, but for your best friend.
            </p>
            <div className="flex items-center gap-3 text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--color-ink)]">
              Explore Technology <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
          
          {/* Right Image */}
          <div className="md:w-7/12 relative bg-[var(--color-surface)] aspect-[4/3] md:aspect-[3/2] overflow-hidden border border-[var(--color-ink)]/5">
             <div className="absolute inset-0 bg-[var(--color-ink)]/5 transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 flex items-center justify-center text-[var(--color-ink)]/5 font-serif text-[180px] md:text-[240px] italic select-none">
               ID
             </div>
             <div className="absolute top-6 right-6 text-[10px] tracking-[0.15em] uppercase text-[var(--color-ink)]/40 font-medium">
               Feature // 01
             </div>
          </div>
        </div>

        {/* Secondary Feature 1: Sensor Network */}
        <div
          onClick={onOpenNetwork}
          className="group relative lg:col-span-6 flex flex-col cursor-pointer border-t border-[var(--color-ink)]/15 pt-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="w-10 h-10 rounded-full border border-[var(--color-ink)]/20 flex items-center justify-center text-[var(--color-ink)] transition-colors group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-bone)]">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-ink)]/40 font-medium">
               Feature // 02
            </div>
          </div>

          <h3 className="font-serif text-[28px] sm:text-[36px] text-[var(--color-ink)] mb-4">
            Neighborhood Network
          </h3>
          <p className="text-[16px] leading-relaxed text-[var(--color-ink-soft)] mb-10 max-w-sm">
            Activate a local search instantly. Our system alerts nearby SafePaws members so your community becomes an active recovery team.
          </p>
          <div className="mt-auto flex items-center gap-3 text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--color-ink)]">
             View Network <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>

        {/* Secondary Feature 2: Smart QR Tags */}
        <div
          onClick={onOpenQrTags}
          className="group relative lg:col-span-6 flex flex-col cursor-pointer border-t border-[var(--color-ink)]/15 pt-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="w-10 h-10 rounded-full border border-[var(--color-ink)]/20 flex items-center justify-center text-[var(--color-ink)] transition-colors group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-bone)]">
              <Scan className="w-4 h-4" />
            </div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-ink)]/40 font-medium">
               Feature // 03
            </div>
          </div>

          <h3 className="font-serif text-[28px] sm:text-[36px] text-[var(--color-ink)] mb-4">
            Smart QR Tags
          </h3>
          <p className="text-[16px] leading-relaxed text-[var(--color-ink-soft)] mb-10 max-w-sm">
            Every pet profile generates a unique QR code. Print it, tag it, and let anyone who finds your dog instantly pull up their critical details.
          </p>
          <div className="mt-auto flex items-center gap-3 text-[12px] font-bold tracking-[0.15em] uppercase text-[var(--color-ink)]">
             View Tags <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>

      </div>
    </section>
  );
};
