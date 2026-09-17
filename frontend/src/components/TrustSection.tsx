import React, { useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TrustSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
      
      tl.fromTo(imgRef.current, { scale: 0.8 }, { scale: 1.1, ease: 'none' }, 0);
      tl.fromTo(textRef.current, { y: 50 }, { y: -50, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#FAF3EA] text-[#241812] py-20 sm:py-24 lg:py-32 overflow-hidden" id="trust-section">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column: Structural Nose-Print Material */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div 
            ref={imgRef}
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl"
          >
            {/* Structural Material representation of Nose Print (Image textured) */}
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop" 
              alt="Structural nose print material" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 filter contrast-125 sepia-[.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#DE6828]/20 to-[#241812]/40 mix-blend-overlay"></div>
          </div>
        </div>

        {/* Right Column: Copy */}
        <div 
          ref={textRef}
          className="w-full lg:w-1/2 flex flex-col items-start relative z-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-[#DE6828]" />
            <span className="text-[14px] font-bold tracking-widest text-[#DE6828] uppercase">
              Verifiable Identity
            </span>
          </div>
          <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.1] text-[#241812] tracking-tight mb-6">
            Their nose print is as unique as a fingerprint.
          </h2>
          <p className="text-[18px] sm:text-[20px] leading-relaxed text-[#55463D] mb-8">
            Collar tags get lost. Microchips require special scanners. But every dog's nose print is a unique, unalterable identifier. We use it as the foundational material for their security, ensuring you can always prove they belong with you.
          </p>
        </div>

      </div>
    </section>
  );
};
