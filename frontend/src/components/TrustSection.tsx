import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TrustSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Entrance reveal for text
      gsap.from(textRef.current?.children || [], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: 'power3.out',
      });

      // Subtle parallax: image drifts on scroll
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      st.fromTo(imgRef.current, { scale: 1.08 }, { scale: 1.0, ease: 'none' }, 0);
      st.fromTo(imgWrapRef.current, { y: 20 }, { y: -20, ease: 'none' }, 0);
      st.fromTo(textRef.current, { y: 40 }, { y: -40, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[var(--color-bone)] text-[var(--color-ink)] py-20 sm:py-24 lg:py-32 overflow-hidden"
      id="trust-section"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Column: Structural Nose-Print Material */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-start">
          <div
            ref={imgWrapRef}
            className="relative w-72 h-72 sm:w-[22rem] sm:h-[22rem] lg:w-[26rem] lg:h-[26rem]"
          >
            {/* Outer ring — structural material indicator */}
            <div className="absolute inset-0 rounded-full border border-[var(--color-accent)]/20" />
            <div className="absolute inset-3 rounded-full border border-[var(--color-accent)]/10" />

            {/* Image circle */}
            <div className="absolute inset-6 rounded-full overflow-hidden shadow-[0_20px_60px_rgba(26,17,7,0.18)]">
              <img
                ref={imgRef}
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200&auto=format&fit=crop"
                alt="Close-up of a dog's nose texture — the unique biometric material"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-[var(--color-ink)]/25" />
            </div>

            {/* Single nose-print identity badge */}
            <div
              className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-2 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg border border-[var(--color-border)]"
              aria-hidden="true"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] inline-block animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.1em] text-[var(--color-ink)] uppercase">
                Unique Identity
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Copy */}
        <div
          ref={textRef}
          className="w-full lg:w-7/12 flex flex-col items-start"
        >
          <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] text-[var(--color-trail)] uppercase mb-6">
            <span className="w-6 h-px bg-[var(--color-trail)] inline-block" />
            Verifiable identity
          </span>

          <h2 className="font-serif text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.05] text-[var(--color-ink)] tracking-tight mb-8">
            Their nose print is as unique as a fingerprint.
          </h2>

          <p className="text-[18px] sm:text-[20px] leading-relaxed text-[var(--color-ink-soft)] mb-6">
            Collar tags get lost. Microchips require special scanners. But
            every dog's nose print is a unique, unalterable identifier. We use
            it as the foundational biometric material for their security —
            ensuring you can always prove they belong with you.
          </p>

          <p className="text-[15px] leading-relaxed text-[var(--color-ink-soft)]/70">
            No accuracy percentages. No fabricated claims. Just real biometric
            infrastructure designed to help reunite families with their
            companions.
          </p>
        </div>

      </div>
    </section>
  );
};
