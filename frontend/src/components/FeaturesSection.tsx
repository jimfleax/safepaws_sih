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
      // Header entrance
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'back.out(1.2)'
      });

      // Cards staggered entrance with slight scale
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power4.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={containerRef} className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16">
      {/* Section Eyebrow */}
      <div ref={headerRef} className="flex items-center gap-2 mb-8 sm:mb-10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#DE6828] inline-block animate-pulse" />
        <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.12em] text-[#3F3127] uppercase">
          ONE PLACE TO KEEP THEM SAFE
        </span>
      </div>

      {/* Asymmetrical Feature Layout */}
      <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Primary Feature: Biometric AI */}
        <div
          id="feature-card-biometric"
          onClick={onOpenBiometric}
          className="group relative bg-[#FDE8DC] rounded-[var(--radius-24)] p-10 sm:p-14 lg:col-span-12 flex flex-col md:flex-row justify-between cursor-pointer border border-[#F4D3C2] transition-all hover:bg-[#FBE0D0] hover:-translate-y-1 hover:shadow-lg min-h-[360px]"
        >
          <div className="md:w-1/2 flex flex-col justify-between">
            <div className="w-16 h-16 rounded-[var(--radius-16)] bg-[#F8D4C1] text-[#422B1F] flex items-center justify-center mb-10 shadow-inner">
              <Fingerprint className="w-8 h-8 stroke-[1.5]" />
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-serif text-[40px] sm:text-[48px] text-[#241812] leading-none tracking-tight">
                  Nose-print Biometrics
                </h3>
                <ArrowUpRight className="w-8 h-8 text-[#7A6458] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <p className="text-[18px] sm:text-[20px] leading-relaxed text-[#5C4A3F] max-w-md">
                We turn your dog's unique nose pattern into an un-losable identity record. It's like a fingerprint, but for your best friend.
              </p>
              <span className="inline-block mt-8 text-[12px] font-bold tracking-[0.15em] uppercase text-[#DE6828]">
                Identity Verification Rolling Out Soon
              </span>
            </div>
          </div>
          <div className="hidden md:block md:w-5/12 rounded-[var(--radius-24)] overflow-hidden bg-[#F4D3C2]/50 relative border border-[#F4D3C2]">
             <div className="absolute inset-0 flex items-center justify-center text-[#DE6828]/20 font-serif text-[180px] italic select-none">ID</div>
          </div>
        </div>

        {/* Secondary Feature 1: Sensor Network */}
        <div
          id="feature-card-sensor-network"
          onClick={onOpenNetwork}
          className="group relative bg-[#ECE0D2] rounded-[var(--radius-24)] p-10 lg:col-span-6 flex flex-col justify-between cursor-pointer border border-[#E0D0BF] transition-all hover:bg-[#E4D5C5] hover:-translate-y-1 hover:shadow-md min-h-[320px]"
        >
          <div className="w-14 h-14 rounded-[var(--radius-12)] bg-[#DFCDBD] text-[#3D291E] flex items-center justify-center mb-8 shadow-inner">
            <Share2 className="w-7 h-7 stroke-[1.5]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-[28px] text-[#241812] tracking-tight">
                Neighborhood Network
              </h3>
              <ArrowUpRight className="w-6 h-6 text-[#7A6458] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#5C4A3F]">
              Activate a local search instantly. Our system alerts nearby SafePaws members so your community becomes an active recovery team.
            </p>
          </div>
        </div>

        {/* Secondary Feature 2: Smart QR Tags */}
        <div
          id="feature-card-smart-qr"
          onClick={onOpenQrTags}
          className="group relative bg-[#D7ECEB] rounded-[var(--radius-24)] p-10 lg:col-span-6 flex flex-col justify-between cursor-pointer border border-[#C5E1DF] transition-all hover:bg-[#CDE6E5] hover:-translate-y-1 hover:shadow-md min-h-[320px]"
        >
          <div className="w-14 h-14 rounded-[var(--radius-12)] bg-[#C1E2E0] text-[#1E3B3A] flex items-center justify-center mb-8 shadow-inner">
            <Scan className="w-7 h-7 stroke-[1.5]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-[28px] text-[#1E3B3A] tracking-tight">
                Smart QR Tags
              </h3>
              <ArrowUpRight className="w-6 h-6 text-[#356361] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#3D5B59]">
              Every pet profile generates a unique QR code. Print it, tag it, and let anyone who finds your dog instantly pull up their critical details.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
