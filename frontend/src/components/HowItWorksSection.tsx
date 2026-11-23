import React, { useRef, useEffect } from 'react';
import {
  FilePlus,
  Fingerprint,
  QrCode,
  Radio,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

interface HowItWorksSectionProps {
  onStep1Click: () => void;
  onStep2Click: () => void;
  onStep3Click: () => void;
  onStep4Click: () => void;
  onStep5Click: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onStep1Click,
  onStep2Click,
  onStep3Click,
  onStep4Click,
  onStep5Click,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });

      if (stepsRef.current) {
        gsap.from(stepsRef.current.children, {
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 82%',
          },
          y: 35,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Register Companion',
      description: 'Add your dog’s photo, breed, age, and vital medical conditions to initiate their personal identity dossier.',
      icon: FilePlus,
      actionText: 'Register Pet',
      onClick: onStep1Click,
    },
    {
      num: '02',
      title: 'Biometric Enrollment',
      description: 'Upload a clear close-up of their nose leather to vectorize their permanent, non-invasive digital fingerprint.',
      icon: Fingerprint,
      actionText: 'View Enrollment',
      onClick: onStep2Click,
    },
    {
      num: '03',
      title: 'Generate Smart QR',
      description: 'Equip your dog with a printable QR collar tag. Any smartphone camera can scan it instantly in the field.',
      icon: QrCode,
      actionText: 'Preview Tags',
      onClick: onStep3Click,
    },
    {
      num: '04',
      title: 'Mobilize Community',
      description: 'If a pet wanders, one tap dispatches an instant geofenced broadcast to local scouts and neighborhood volunteers.',
      icon: Radio,
      actionText: 'Join Scout Watch',
      onClick: onStep4Click,
    },
    {
      num: '05',
      title: 'Safe Reunion',
      description: 'Sightings, biometric scans, and local watch networks connect finders with owners for a swift, verified return home.',
      icon: HeartHandshake,
      actionText: 'Explore Community Watch',
      onClick: onStep5Click,
    },
  ];

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32"
      aria-label="How SafePaws Works"
    >
      {/* Header */}
      <div ref={headerRef} className="flex flex-col mb-16 sm:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="scout" className="px-3 py-0.5">
            5-STEP REUNION CYCLE
          </Badge>
          <span className="text-[length:var(--text-metadata)] font-medium text-[var(--color-ink-soft)] uppercase tracking-widest hidden sm:inline-block">
            // SIMPLE FROM DAY ONE
          </span>
        </div>

        <h2 className="font-serif text-[38px] sm:text-[54px] lg:text-[62px] text-[var(--color-ink)] leading-[1.08] tracking-tight max-w-3xl mb-6">
          The fastest path from lost to found.
        </h2>

        <p className="text-[length:var(--text-body-large)] text-[var(--color-ink-soft)] max-w-2xl leading-relaxed">
          Designed to eliminate panic and confusion. Here is exactly how SafePaws works from baseline registration to safe reunion.
        </p>
      </div>

      {/* 5-Step Connected Timeline Cards */}
      <div
        ref={stepsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              onClick={step.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  step.onClick();
                }
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[var(--radius-24)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] hover:border-[var(--color-marigold)] hover:shadow-lg transition-all cursor-pointer min-h-[300px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-bold text-[var(--color-ink-soft)]/50 group-hover:text-[var(--color-accent-text)] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-bone)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink)] group-hover:bg-[var(--color-marigold)] group-hover:text-[var(--color-ink)] transition-colors">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[var(--color-ink)] mb-3 leading-snug">
                  {step.title}
                </h3>

                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Action Link */}
              <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent-text)] transition-colors">
                <span>{step.actionText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
