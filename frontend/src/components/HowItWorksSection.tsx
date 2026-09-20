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

        {/* Sequential Steps */}
        <div ref={cardsRef} className="flex flex-col gap-12 sm:gap-16 max-w-4xl">
          {steps.map(({ icon: Icon, number, title, body }, index) => (
            <div
              key={number}
              className="group flex flex-col md:flex-row md:items-start gap-6 md:gap-12"
            >
              {/* Number and Icon column */}
              <div className="flex items-center md:flex-col md:items-start gap-4 md:w-32 shrink-0">
                <span className="font-serif text-[#1C1A17] text-[32px] sm:text-[48px] leading-none">
                  {number}
                </span>
                <div className="hidden md:flex w-12 h-12 rounded-full bg-[#F6F1E7] text-[#1C1A17] items-center justify-center transition-transform group-hover:scale-110">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
              </div>

              {/* Text column */}
              <div className="flex-1 border-t border-[#1C1A17] pt-6 mt-2 md:mt-0 md:border-t-0 md:border-l md:pl-10 md:pt-0">
                <div className="flex items-center gap-3 md:hidden mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#F6F1E7] text-[#1C1A17] flex items-center justify-center">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="font-sans font-semibold text-[20px] text-[#1C1A17]">
                    {title}
                  </h3>
                </div>
                
                <h3 className="hidden md:block font-sans font-semibold text-[24px] text-[#1C1A17] mb-4">
                  {title}
                </h3>
                
                <p className="text-[#55463D] text-[16px] sm:text-[18px] leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
