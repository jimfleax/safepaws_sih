import React, { useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Camera,
  MapPin,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

gsap.registerPlugin(ScrollTrigger);

interface PrivacySectionProps {
  onOpenPrivacy: () => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ onOpenPrivacy }) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 82%',
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[var(--color-surface)] py-20 sm:py-28 lg:py-32 border-y border-[var(--color-border)]"
      aria-label="Privacy, Safety and Consent Transparency"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="scout" className="px-3 py-0.5">
              DATA INTEGRITY & ETHICS
            </Badge>
            <span className="text-[length:var(--text-metadata)] font-medium text-[var(--color-ink-soft)] uppercase tracking-widest hidden sm:inline-block">
              // NO SURVEILLANCE. NO TRACKING.
            </span>
          </div>

          <h2 className="font-serif text-[38px] sm:text-[54px] lg:text-[62px] text-[var(--color-ink)] leading-[1.08] tracking-tight max-w-3xl mb-6">
            Engineered for safety. Rooted in user consent.
          </h2>

          <p className="text-[length:var(--text-body-large)] text-[var(--color-ink-soft)] max-w-2xl leading-relaxed">
            Every feature in SafePaws is designed around three non-negotiable principles: Safety, Privacy, and Convenience. Here is our transparent disclosure of how data and device hardware are used.
          </p>
        </div>

        {/* 3 Core Principles Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14"
        >
          {/* Pillar 1: Safety */}
          <div className="flex flex-col p-8 rounded-[var(--radius-24)] bg-[var(--color-bone)]/50 border border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-[var(--radius-16)] bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)]/30 flex items-center justify-center text-[var(--color-accent-text)] mb-6">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-3">
              1. Safety
            </h3>

            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              Protection for pets and community members without friction. Emergency access remains open to finders without requiring app installation or forced sign-ups.
            </p>

            <ul className="mt-auto space-y-2.5 text-xs text-[var(--color-ink)]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                <span>Instant lost-pet emergency broadcast</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                <span>Emergency medical & temperament notes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                <span>Verified sighting reports filter rumors</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Privacy */}
          <div className="flex flex-col p-8 rounded-[var(--radius-24)] bg-[var(--color-bone)]/50 border border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-[var(--radius-16)] bg-[var(--color-trail)]/15 border border-[var(--color-trail)]/30 flex items-center justify-center text-[var(--color-trail)] mb-6">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-3">
              2. Privacy
            </h3>

            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              Explicit permission boundaries. We never collect optional personal information or track your location without your direct action.
            </p>

            <ul className="mt-auto space-y-2.5 text-xs text-[var(--color-ink)]">
              <li className="flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-[var(--color-trail)] shrink-0" />
                <span><strong>Camera:</strong> Active only during live scans</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-trail)] shrink-0" />
                <span><strong>Location:</strong> Used only when posting alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <EyeOff className="w-3.5 h-3.5 text-[var(--color-trail)] shrink-0" />
                <span><strong>Contact:</strong> Phone numbers withheld from public tags by default</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Convenience */}
          <div className="flex flex-col p-8 rounded-[var(--radius-24)] bg-[var(--color-bone)]/50 border border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-[var(--radius-16)] bg-[var(--color-ink)]/10 border border-[var(--color-ink)]/20 flex items-center justify-center text-[var(--color-ink)] mb-6">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-3">
              3. Convenience
            </h3>

            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              Accessible across any web browser on iOS or Android. No proprietary hardware, no clunky app store downloads, and zero mandatory subscription fees for basic pet recovery.
            </p>

            <ul className="mt-auto space-y-2.5 text-xs text-[var(--color-ink)]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-text)]" />
                <span>Universal mobile browser compatibility</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-text)]" />
                <span>1-click QR code download & printing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-text)]" />
                <span>Seamless profile management dashboard</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Roadmap Transparency Box */}
        <div className="p-6 sm:p-8 rounded-[var(--radius-24)] bg-[var(--color-bone)] border border-[var(--color-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--color-accent-text)] uppercase mb-2">
              <span>Architectural Roadmap Transparency</span>
            </div>
            <p className="text-sm text-[var(--color-ink)] leading-relaxed">
              SafePaws is actively planning client-side Web Crypto offline record storage and zero-knowledge pet dossier encryption (detailed in <code className="font-mono text-xs bg-white/70 px-1.5 py-0.5 rounded border border-[var(--color-border)]">docs/UI_UX_DESIGN_ARCHITECTURE.md</code>). We only claim protections that are verified in production.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenPrivacy}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            className="shrink-0 whitespace-nowrap bg-white hover:bg-[var(--color-bone)]"
          >
            Review Full Policy
          </Button>
        </div>
      </div>
    </section>
  );
};
