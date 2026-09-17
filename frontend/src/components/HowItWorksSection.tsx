import React, { useRef, useEffect } from 'react';
import { Fingerprint, Share2, Scan } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white text-[#241812] py-16 sm:py-20 lg:py-24" id="how-it-works">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-[32px] sm:text-[40px] text-[#241812] tracking-tight">
            How SafePaws Works
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#55463D] max-w-2xl">
            A cohesive safety system starting from the tip of their nose to the community around you.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-[#FAF6F0] rounded-3xl border border-[#EDE4D8] transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#DE6828]/10 text-[#DE6828] flex items-center justify-center mb-6">
              <Fingerprint className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-sans font-semibold text-[20px] mb-3">Biometric Identification</h3>
            <p className="text-[#55463D] leading-relaxed">
              Scan your pet's nose print to create a secure identity that cannot be lost or removed.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-[#FAF6F0] rounded-3xl border border-[#EDE4D8] transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#DE6828]/10 text-[#DE6828] flex items-center justify-center mb-6">
              <Scan className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-sans font-semibold text-[20px] mb-3">Smart Tag Support</h3>
            <p className="text-[#55463D] leading-relaxed">
              Pair with a smart QR tag for quick scanning, giving anyone the ability to securely help your pet.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-[#FAF6F0] rounded-3xl border border-[#EDE4D8] transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#DE6828]/10 text-[#DE6828] flex items-center justify-center mb-6">
              <Share2 className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-sans font-semibold text-[20px] mb-3">Community Recovery</h3>
            <p className="text-[#55463D] leading-relaxed">
              Instantly share verified alerts with neighbors to organize a coordinated search when every second counts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
