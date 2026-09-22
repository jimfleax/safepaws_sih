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
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Initial state — elements hidden before animation
      gsap.set([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], {
        opacity: 0,
        y: 28,
      });
      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 0.97,
        y: 20,
      });

      // Entrance sequence — staggered, cinematic
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.4,
      })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.9')
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

      // Scroll parallax — image drifts up slower than scroll, text fades
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
      st.to(imageRef.current, { y: 130, ease: 'none' }, 0);
      st.to(imageInnerRef.current, { scale: 1.06, ease: 'none' }, 0);
      st.to(textRef.current, { y: 80, opacity: 0, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden"
    >
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px',
        }}
      />

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

        {/* Image Column — right on desktop, top on mobile */}
        <div className="w-full lg:w-5/12 order-1 lg:order-2">
          <div
            ref={imageRef}
            data-cursor="paw"
            className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(26,17,7,0.22)] bg-[#E8D5BF]"
          >
            {/* Subtle vignette */}
            <div className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 55%, rgba(26,17,7,0.28) 100%)',
              }}
            />
            <img
              ref={imageInnerRef}
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop"
              alt="Close-up of a dog's nose — the unique biometric that SafePaws uses for identification"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Text Column — left on desktop, below image on mobile */}
        <div
          ref={textRef}
          className="w-full lg:w-7/12 order-2 lg:order-1 flex flex-col items-start text-left"
        >
          {/* Eyebrow */}
          <span
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[var(--color-trail)] uppercase mb-6"
          >
            <span className="w-6 h-px bg-[var(--color-trail)] inline-block" />
            Nose-print biometric identification
          </span>

          {/* Headline */}
          <h1
            ref={headingRef}
            className="font-serif text-[44px] sm:text-[60px] lg:text-[76px] leading-[1.05] tracking-tight text-[var(--color-ink)] font-normal"
          >
            Your dog's nose is their{' '}
            <em className="not-italic text-[var(--color-accent)] relative inline-block">
              return ticket.
              <svg className="absolute -bottom-2 left-0 w-full text-[var(--color-accent)]/20" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </em>
          </h1>

          {/* Body */}
          <p
            ref={bodyRef}
            className="mt-6 sm:mt-8 text-[16px] sm:text-[18px] leading-relaxed text-[var(--color-ink-soft)] max-w-[480px]"
          >
            Like a human fingerprint, every dog's nose has a unique pattern of ridges and creases. SafePaws uses advanced biometrics to turn a simple smartphone photo of their nose into an unlosable identity.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onIdentifyClick}
              className="group relative w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--color-ink)] text-white font-bold text-[14px] tracking-wide uppercase transition-all duration-300 hover:bg-[#2A2723] rounded-full shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-ink)] cursor-pointer"
              aria-label="Scan a found dog's nose to identify them"
            >
              <Camera className="w-5 h-5 flex-shrink-0" />
              <span>SCAN A FOUND DOG</span>
            </button>
            <button
              onClick={onJoinClick}
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--color-background)] text-[var(--color-ink)] font-bold text-[14px] tracking-wide uppercase border-2 border-[var(--color-ink)] rounded-full transition-all duration-300 hover:bg-[var(--color-ink)] hover:text-white cursor-pointer"
              aria-label="Register your pet with SafePaws"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              <span>REGISTER YOUR PET</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
