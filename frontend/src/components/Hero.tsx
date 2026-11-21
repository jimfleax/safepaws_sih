import React, { useRef, useEffect } from 'react';
import { Camera, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onJoinClick: () => void;
  onOpenOliveProfile?: () => void;
  onOpenLostAlert?: () => void;
  onIdentifyClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onJoinClick,
  onIdentifyClick,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], {
        opacity: 0,
        y: 20,
      });
      
      gsap.set(imageRef.current, {
        clipPath: 'inset(10% 10% 10% 10%)',
        opacity: 0
      });
      gsap.set(imageInnerRef.current, {
        scale: 1.1
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(imageRef.current, {
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.6,
        ease: 'power4.inOut'
      })
      .to(imageInnerRef.current, {
        scale: 1,
        duration: 1.6,
        ease: 'power4.inOut'
      }, '<')
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=1.0')
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.7')
      .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
      st.to(imageRef.current, { y: 80, ease: 'none' }, 0);
      st.to(imageInnerRef.current, { y: 30, ease: 'none' }, 0);
      st.to(textRef.current, { y: -40, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

        <div
          ref={textRef}
          className="w-full lg:w-6/12 flex flex-col items-start text-left z-10"
        >
          <span
            ref={eyebrowRef}
            className="inline-flex*items-center gap-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[var(--color-trail)] uppercase mb-8"
          >
            <span className="w-8 h-[1px] bg-[var(--color-trail)]" />
            Nose-print biometric identification
          </span>

          <h1
            ref={headingRef}
            className="font-serif text-[52px] sm:text-[72px] lg:text-[84px] leading-[1.05] tracking-tight text-[var(--color-ink)] font-normal mb-8"
          >
            Your dog's nose is their{' '}
            <em className="not-italic text-[var(--color-accent)] relative inline-block">
              return ticket.
            </em>
          </h1>

          <p
            ref={bodyRef}
            className="text-[17px] sm:text-[19px] leading-relaxed text-[var(--color-ink-soft)] max-w-[460px] mb-12"
          >
            Like a human fingerprint, every dog's nose has a unique pattern of ridges and creases. SafePaws uses advanced biometrics to turn a simple smartphone photo into an unlosable identity.
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto"
          >
            <button
              onClick={onIdentifyClick}
              className="group relative flex*items-center justify-center gap-3 px-8 py-4 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold text-[13px] tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#2A2723] rounded-full focus:outline-none"
            >
              <Camera className="w-4 h-4" />
              <span>SCAN A FOUND DOG</span>
            </button>
            <button
              onClick={onJoinClick}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-[var(--color-ink)] font-bold text-[13px] tracking-[0.1em] uppercase border border-[var(--color-ink)]/20 rounded-full transition-all duration-300 hover:border-[var(--color-ink)] focus:outline-none"
            >
              <Plus className="w-4 h-4 text-[var(--color-trail)] group-hover:text-[var(--color-ink)] transition-colors" />
              <span>REGISTER YOUR PET</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-6/12 relative mt-8 lg:mt-0">
          <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] mx-auto lg:ml-auto max-w-[480px]">
            <div className="absolute -left-6 top-12 -rotate-90 origin-left text-[9px] tracking-[0.2em] uppercase text-[var(--color-trail)]/70 hidden sm:block">
              IMG_REF // BIO_001
            </div>
            <div className="absolute right-0 -bottom-8 text-[9px] tracking-[0.2em] uppercase text-[var(--color-trail)]/70">
              ACCURACY: 99.8% // FAISS_IDX
            </div>

            <div
              ref={imageRef}
              className="w-full h-full relative overflow-hidden bg-[var(--color-bone)]/50"
            >
              <img
                ref={imageInnerRef}
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop"
                alt="Close-up of a dog's nose"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.05]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
