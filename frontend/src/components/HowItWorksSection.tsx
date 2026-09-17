import React, { useRef, useEffect } from 'react';
import { Fingerprint, Share2, Scan } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Fingerprint,
    number: '01',
    title: 'Biometric Identity',
    body: 'Scan your pet\'s nose print to create a secure identity that cannot be lost, removed, or forgotten.',
  },
  {
    icon: Scan,
    number: '02',
    title: 'Smart Tag Support',
    body: 'Pair with a QR tag so anyone who finds them can quickly surface your contact details and pet profile.',
  },
  {
    icon: Share2,
    number: '03',
    title: 'Community Recovery',
    body: 'Share verified alerts with neighbors instantly — a coordinated local response when every second matters.',
  },
];

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Section header reveal
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards staggered reveal with clip-path wipe
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 82%',
        },
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.18,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white text-[#1C1A17] py-16 sm:py-20 lg:py-28"
      id="how-it-works"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col items-start mb-14 sm:mb-16">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-[#63684B] uppercase mb-5">
            <span className="w-5 h-px bg-[#63684B] inline-block" />
            How it works
          </span>
          <h2 className="font-serif text-[32px] sm:text-[42px] text-[#1C1A17] tracking-tight leading-[1.1] max-w-xl">
            From nose to neighborhood — a complete safety system.
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map(({ icon: Icon, number, title, body }) => (
            <div
              key={number}
              className="group flex flex-col p-7 sm:p-8 bg-[#F6F1E7] rounded-3xl border border-[#EDE4D8] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#DDD0BE]"
            >
              {/* Step number + icon row */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-serif text-[#8A8175] text-[14px] font-normal">
                  {number}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#E2811F]/10 text-[#E2811F] flex items-center justify-center transition-colors group-hover:bg-[#E2811F]/16">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
              </div>

              {/* Thin rule */}
              <div className="w-full h-px bg-[#EDE4D8] mb-6" />

              <h3 className="font-sans font-semibold text-[18px] text-[#1C1A17] mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-[#55463D] text-[15px] leading-relaxed flex-1">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
