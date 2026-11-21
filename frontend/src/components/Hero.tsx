import React, { useRef, useEffect } from 'react';
import { Camera, Plus, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onJoinClick: () => void;
  onIdentifyClick?: () => void;
  onOpenLostAlerts?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onJoinClick,
  onIdentifyClick,
  onOpenLostAlerts,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const trustPillsRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);
  const hudOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Ensure all elements are immediately visible with zero animation
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states for cinematic entrance
      gsap.set(
        [
          eyebrowRef.current,
          headlineRef.current,
          bodyRef.current,
          ctaGroupRef.current,
          trustPillsRef.current,
        ],
        {
          opacity: 0,
          y: 28,
        }
      );

      gsap.set(imageCardRef.current, {
        opacity: 0,
        scale: 0.96,
        clipPath: 'inset(8% 8% 8% 8% round 24px)',
      });

      gsap.set(floatingBadgeRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.9,
      });

      gsap.set(hudOverlayRef.current, {
        opacity: 0,
      });

      // Master entrance choreography
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(imageCardRef.current, {
        opacity: 1,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0% round 24px)',
        duration: 1.4,
        ease: 'power4.inOut',
      })
        .to(
          hudOverlayRef.current,
          {
            opacity: 1,
            duration: 0.8,
          },
          '-=0.6'
        )
        .to(
          floatingBadgeRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        )
        .to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=1.1'
        )
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.8'
        )
        .to(
          bodyRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.6'
        )
        .to(
          ctaGroupRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .to(
          trustPillsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.4'
        );

      // Smooth scroll parallax effect
      if (containerRef.current) {
        const st = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });

        st.to(imageCardRef.current, { y: 60, ease: 'none' }, 0);
        st.to(imageInnerRef.current, { scale: 1.08, ease: 'none' }, 0);
        st.to(floatingBadgeRef.current, { y: -30, ease: 'none' }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-20 sm:pt-14 sm:pb-28 lg:pt-18 lg:pb-32 overflow-hidden"
      aria-label="SafePaws Introduction"
    >
      {/* Background ambient radial warmth */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[var(--color-marigold)]/10 via-[var(--color-marigold)]/5 to-transparent rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow & Live Status */}
          <div
            ref={eyebrowRef}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Badge variant="scout" pulse className="px-3 py-1 font-mono tracking-wider">
              OPTICAL NOSE-PRINT VERIFICATION
            </Badge>
            <span className="text-[length:var(--text-metadata)] font-medium text-[var(--color-ink-soft)] uppercase tracking-widest hidden sm:inline-block">
              // HYPER-LOCAL RECOVERY
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-serif text-[42px] sm:text-[62px] lg:text-[76px] leading-[1.06] tracking-tight text-[var(--color-ink)] font-normal mb-7"
          >
            Every dog’s nose has a story.{' '}
            <span className="block mt-1 font-serif italic text-[var(--color-accent-text)]">
              SafePaws makes sure it always leads home.
            </span>
          </h1>

          {/* Body Copy */}
          <p
            ref={bodyRef}
            className="text-[length:var(--text-body-large)] text-[var(--color-ink-soft)] max-w-xl leading-relaxed mb-10"
          >
            Collar tags break, and microchips require specialized vet scanners. SafePaws uses non-invasive biometric nose-pattern recognition from any smartphone photo, mobilizing local neighborhood search networks the moment a pet wanders.
          </p>

          {/* Primary Action Button Cluster */}
          <div
            ref={ctaGroupRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={onIdentifyClick}
              leftIcon={<Camera className="w-5 h-5" aria-hidden="true" />}
              className="shadow-md hover:shadow-lg transition-all"
            >
              SCAN A FOUND DOG
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onJoinClick}
              leftIcon={<Plus className="w-5 h-5 text-[var(--color-accent-text)]" aria-hidden="true" />}
              className="border-[var(--color-border)] hover:border-[var(--color-ink)]"
            >
              REGISTER YOUR PET
            </Button>
          </div>

          {/* Emergency Dispatch Banner */}
          <div
            ref={trustPillsRef}
            className="w-full max-w-xl pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4 text-[length:var(--text-metadata)]"
          >
            <div className="flex items-center gap-2 text-[var(--color-ink)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] inline-block animate-ping" />
              <span>Active Neighborhood Network Active</span>
            </div>

            {onOpenLostAlerts && (
              <button
                type="button"
                onClick={onOpenLostAlerts}
                className="inline-flex items-center gap-1.5 text-[var(--color-alert-clay)] hover:underline font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
              >
                <span>Missing pet right now? View live alerts</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Layered Biometric Visual Card */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0">
          <div className="relative mx-auto max-w-[460px] lg:max-w-none">
            {/* Ambient Shadow glow */}
            <div
              className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-accent)]/20 via-transparent to-[var(--color-ink)]/10 rounded-[32px] blur-2xl -z-10"
              aria-hidden="true"
            />

            {/* Main Visual Frame */}
            <div
              ref={imageCardRef}
              className="relative w-full aspect-[4/5] rounded-[var(--radius-24)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl"
            >
              <img
                ref={imageInnerRef}
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop"
                alt="Close-up of a dog's nose texture showcasing unique friction ridge contours"
                className="w-full h-full object-cover filter contrast-[1.04]"
                loading="eager"
              />

              {/* HUD Reticle Overlay */}
              <div
                ref={hudOverlayRef}
                className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between"
                aria-hidden="true"
              >
                {/* Top Corner HUD Brackets */}
                <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-white/90">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-marigold)] animate-pulse" />
                    <span>RETICLE // DORSAL APEX</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/80">
                    RIDGE MAPPING
                  </div>
                </div>

                {/* Center Biometric Target Reticle */}
                <div className="self-center relative w-44 h-44 border border-dashed border-[var(--color-marigold)]/70 rounded-full flex items-center justify-center">
                  <div className="w-36 h-36 border border-white/30 rounded-full animate-spin [animation-duration:18s]" />
                  <div className="w-4 h-4 border-2 border-[var(--color-marigold)] rounded-full bg-white/20" />
                  <span className="absolute -top-3 px-2 py-0.5 bg-black/60 rounded text-[9px] font-mono text-white tracking-widest">
                    ALIGN NOSE LEATHER
                  </span>
                </div>

                {/* Bottom Telemetry Stamp */}
                <div className="flex items-center justify-between bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-white/90 font-mono text-[11px]">
                  <span>OPTICAL ENROLLMENT</span>
                  <span className="text-[var(--color-marigold)]">100% NON-INVASIVE</span>
                </div>
              </div>
            </div>

            {/* Floating Tactile Card Badge */}
            <div
              ref={floatingBadgeRef}
              className="absolute -bottom-6 -left-4 sm:-left-8 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-[var(--radius-16)] p-4 shadow-xl max-w-[260px] z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)]/30 flex items-center justify-center shrink-0 text-[var(--color-accent-text)]">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[length:var(--text-label-button)] font-bold text-[var(--color-ink)]">
                    Unlosable Record
                  </div>
                  <div className="text-[length:var(--text-metadata)] text-[var(--color-ink-soft)] leading-snug">
                    Permanent nasal contours that can never fall off.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
