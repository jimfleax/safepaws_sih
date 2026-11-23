import React, { useRef, useEffect } from 'react';
import {
  Fingerprint,
  Radio,
  Users,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BentoGrid, BentoCard } from './ui/bento-grid';
import { Badge } from './ui/Badge';
import { Spotlight } from './ui/spotlight';

gsap.registerPlugin(ScrollTrigger);

export interface FeaturesSectionProps {
  onOpenBiometric: () => void;
  onOpenNetwork: () => void;
  onOpenQrTags: () => void;
  onOpenAlerts?: () => void;
  onOpenSightings?: () => void;
  onOpenManagement?: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onOpenBiometric,
  onOpenNetwork,
  onOpenQrTags,
  onOpenAlerts,
  onOpenSightings,
  onOpenManagement,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header entrance
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

      // Bento cards staggered entrance
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32"
      aria-label="SafePaws 4 Pillars of Protection"
    >
      {/* Section Header */}
      <div ref={headerRef} className="flex flex-col mb-14 sm:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="scout" className="px-3 py-0.5">
            FOUR PILLARS OF RECOVERY
          </Badge>
          <span className="text-[length:var(--text-metadata)] font-medium text-[var(--color-ink-soft)] uppercase tracking-widest hidden sm:inline-block">
            // COMPREHENSIVE CANINE ECOSYSTEM
          </span>
        </div>

        <h2 className="font-serif text-[38px] sm:text-[54px] lg:text-[62px] text-[var(--color-ink)] leading-[1.08] tracking-tight max-w-3xl mb-6">
          Architected for certainty when seconds count.
        </h2>

        <p className="text-[length:var(--text-body-large)] text-[var(--color-ink-soft)] max-w-2xl leading-relaxed">
          SafePaws replaces fragile collar tags and vet-dependent chips with non-invasive biometric nose identification, real-time emergency radar, and a privacy-shielded neighborhood reunion network.
        </p>
      </div>

      {/* Asymmetric Bento Showcase: SafePaws 4 Pillars (2-1, 1-2 Cadence) */}
      <div ref={gridRef} className="w-full">
        <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[25rem]">
          {/* Pillar 1: Biometric ID (Spans 2 cols on md+) */}
          <BentoCard
            name="1. Biometric Nose-Print ID"
            description="Just as human friction ridges define fingerprints, canine nose patterns are mathematically unique and remain stable throughout life. Any smartphone camera converts dorsal apex contours into a permanent 128-dimensional biometric vector."
            Icon={Fingerprint}
            cta="Explore Live Biometric Scanner"
            onClick={onOpenBiometric}
            className="md:col-span-2 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bone)]/70 cursor-pointer overflow-hidden border-2 hover:border-[var(--color-accent)]"
            background={
              <div className="relative w-full h-full pointer-events-none">
                <Spotlight fill="var(--color-marigold)" className="-top-24 right-4 w-96 h-96 opacity-40" />
                <div className="absolute right-6 bottom-6 hidden sm:flex flex-col items-end gap-2.5 text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant="telemetry">DORSAL APEX // RIDGE DENSITY</Badge>
                    <Badge variant="accent">UNLOSABLE</Badge>
                  </div>
                  <div className="w-48 h-28 rounded-2xl border border-dashed border-[var(--color-marigold)]/50 bg-[var(--color-marigold)]/5 backdrop-blur-sm p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-ink-soft)]">
                      <span>FAISS COSINE</span>
                      <span className="text-[var(--color-accent-text)] font-bold">99.84% MATCH</span>
                    </div>
                    {/* Simulated ridge lines */}
                    <div className="space-y-1">
                      <div className="h-1 bg-[var(--color-marigold)]/40 rounded-full w-full" />
                      <div className="h-1 bg-[var(--color-marigold)]/30 rounded-full w-3/4" />
                      <div className="h-1 bg-[var(--color-marigold)]/20 rounded-full w-5/6" />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--color-accent-text)] font-semibold tracking-wider">
                      ZERO-CHIP NON-INVASIVE
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Pillar 2: Emergency Radar (Spans 1 col) */}
          <BentoCard
            name="2. Emergency Radar"
            description="One tap radiates a geofenced crisis broadcast across a 1–5 km perimeter, notifying verified nearby scouts, shelters, and dog walkers the moment a pet wanders."
            Icon={Radio}
            cta="View Active Emergency Radar"
            onClick={onOpenAlerts || onOpenNetwork}
            className="md:col-span-1 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-alert-clay)]"
            background={
              <div className="relative w-full h-full pointer-events-none">
                <div className="absolute right-4 top-4">
                  <Badge variant="alert" pulse className="px-2.5 py-1">
                    CRISIS DISPATCH
                  </Badge>
                </div>
                {/* Concentric Radar Rings */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border border-[var(--color-alert-clay)]/20 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-dashed border-[var(--color-alert-clay)]/30 animate-ping [animation-duration:3s]" />
                  <div className="w-16 h-16 rounded-full bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/40 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)]" />
                  </div>
                </div>
              </div>
            }
          />

          {/* Pillar 3: Community Network (Spans 1 col) */}
          <BentoCard
            name="3. Community Scout Watch"
            description="A verified network of neighborhood pet parents and volunteer search teams coordinated with real-time GPS sightings, pinpointing movement without noise."
            Icon={Users}
            cta="Explore Scout Community"
            onClick={onOpenNetwork}
            className="md:col-span-1 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-trail)]"
            background={
              <div className="relative w-full h-full pointer-events-none">
                <div className="absolute right-4 top-4">
                  <Badge variant="scout" className="px-2.5 py-1">
                    GROUND CORPS
                  </Badge>
                </div>
                <div className="absolute right-6 bottom-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                  <span className="font-mono text-[11px] text-[var(--color-ink-soft)] font-medium">
                    84 Active Local Scouts
                  </span>
                </div>
              </div>
            }
          />

          {/* Pillar 4: Dignified Recovery (Spans 2 cols on md+) */}
          <BentoCard
            name="4. Dignified Recovery & Privacy Vault"
            description="Critical medical notes, allergy protocols, and behavioral triggers stored securely. When a lost companion is found, our encrypted relay connects finder and guardian without ever revealing private home addresses or personal phone numbers."
            Icon={ShieldCheck}
            cta="Manage Privacy & Health Dossier"
            onClick={onOpenManagement || onOpenQrTags}
            className="md:col-span-2 cursor-pointer bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bone)]/50 hover:border-[var(--color-ink)]"
            background={
              <div className="relative w-full h-full pointer-events-none">
                <div className="absolute right-6 top-6 hidden sm:flex items-center gap-2">
                  <Badge variant="neutral">GRANULAR PRIVACY</Badge>
                  <Badge variant="telemetry">ZERO PHONE LEAK</Badge>
                </div>
                <div className="absolute right-6 bottom-6 hidden sm:flex flex-col items-end gap-2">
                  <div className="bg-[var(--color-surface)]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-border)] shadow-sm font-mono text-[11px] text-[var(--color-ink)] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--color-success)]" />
                    <span>ENCRYPTED GUARDIAN VOICE PROXY</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--color-ink-soft)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                    <span>EMERGENCY ALLERGIES & MEDICATION VISIBLE</span>
                  </div>
                </div>
              </div>
            }
          />
        </BentoGrid>
      </div>
    </section>
  );
};
