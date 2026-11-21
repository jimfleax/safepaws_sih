import React, { useRef, useEffect } from 'react';
import {
  Fingerprint,
  QrCode,
  Radio,
  MapPin,
  Users,
  FileText,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BentoGrid, BentoCard } from './ui/bento-grid';
import { Badge } from './ui/Badge';
import { Spotlight } from './ui/spotlight';

gsap.registerPlugin(ScrollTrigger);

interface FeaturesSectionProps {
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
      aria-label="Features and Core Capabilities"
    >
      {/* Section Header */}
      <div ref={headerRef} className="flex flex-col mb-14 sm:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="scout" className="px-3 py-0.5">
            SIX LAYERS OF PROTECTION
          </Badge>
          <span className="text-[length:var(--text-metadata)] font-medium text-[var(--color-ink-soft)] uppercase tracking-widest hidden sm:inline-block">
            // UNIFIED CANINE ECOSYSTEM
          </span>
        </div>

        <h2 className="font-serif text-[38px] sm:text-[54px] lg:text-[62px] text-[var(--color-ink)] leading-[1.08] tracking-tight max-w-3xl mb-6">
          Architected for certainty when seconds count.
        </h2>

        <p className="text-[length:var(--text-body-large)] text-[var(--color-ink-soft)] max-w-2xl leading-relaxed">
          SafePaws combines non-invasive biometric identification with a hyper-local neighborhood rescue network, ensuring lost pets are identified and returned quickly and safely.
        </p>
      </div>

      {/* 6-Card Asymmetric Bento Showcase */}
      <div ref={gridRef} className="w-full">
        <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[24rem]">
          {/* 1. Biometric Nose-Print (Spans 2 cols on md+) */}
          <BentoCard
            name="Nasal Leather Topography"
            description="Just as human friction ridges define fingerprints, canine nose patterns are mathematically unique and remain stable throughout a dog's life. A standard smartphone photo creates a permanent biometric vector."
            Icon={Fingerprint}
            cta="Explore Live Biometric Scanner"
            onClick={onOpenBiometric}
            className="md:col-span-2 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bone)]/60 cursor-pointer overflow-hidden border-2 hover:border-[var(--color-accent)]"
            background={
              <div className="relative w-full h-full">
                <Spotlight fill="var(--color-marigold)" className="-top-20 right-0 w-80 h-80 opacity-40" />
                <div className="absolute right-6 bottom-6 hidden sm:flex flex-col items-end gap-2 text-right">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-ink-soft)] bg-[var(--color-surface)]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                    DORSAL APEX // RIDGE DENSITY
                  </div>
                  <div className="w-36 h-24 rounded-xl border border-dashed border-[var(--color-marigold)]/40 bg-[var(--color-marigold)]/5 flex items-center justify-center">
                    <span className="font-mono text-xs text-[var(--color-accent-text)] font-semibold">
                      VECTOR MATCHING
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          {/* 2. Smart QR Digital Tag (Spans 1 col) */}
          <BentoCard
            name="Physical + Digital Smart Tag"
            description="Every registered companion generates a scannable QR collar tag. Any smartphone camera can pull up emergency contact details and medical alerts instantly without app installation."
            Icon={QrCode}
            cta="View Collar Tag Workflow"
            onClick={onOpenQrTags}
            className="md:col-span-1 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-ink)]"
            background={
              <div className="absolute right-4 top-4 opacity-10 font-mono text-[80px] font-bold select-none text-[var(--color-ink)]">
                QR
              </div>
            }
          />

          {/* 3. Missing Pet Emergency Broadcast (Spans 1 col) */}
          <BentoCard
            name="Instant Radius Alert"
            description="Trigger a high-priority neighborhood dispatch with one tap. Notifies nearby verified pet scouts and community volunteers within your geofenced search perimeter."
            Icon={Radio}
            cta="View Active Lost Alerts"
            onClick={onOpenAlerts || onOpenNetwork}
            className="md:col-span-1 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-alert-clay)]"
            background={
              <div className="absolute right-4 top-4">
                <Badge variant="alert" pulse className="px-2.5 py-1">
                  CRISIS DISPATCH
                </Badge>
              </div>
            }
          />

          {/* 4. Verified Sighting Submissions (Spans 2 cols on md+) */}
          <BentoCard
            name="GPS Sighting Submissions"
            description="Community members upload real-time photos with timestamped coordinates when they spot a wandering animal, filtering false alarms and pinpointing exact search locations."
            Icon={MapPin}
            cta="Submit or Review Sightings"
            onClick={onOpenSightings || onOpenNetwork}
            className="md:col-span-2 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-trail)]"
            background={
              <div className="absolute right-6 bottom-6 hidden sm:flex items-center gap-3">
                <div className="font-mono text-[11px] text-[var(--color-ink-soft)] bg-[var(--color-bone)] px-3 py-1.5 rounded-lg border border-[var(--color-border)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)] inline-block" />
                  MAP-PINNED VERIFICATION
                </div>
              </div>
            }
          />

          {/* 5. Volunteer Scout Network (Spans 1 col) */}
          <BentoCard
            name="Neighborhood Scout Watch"
            description="A dedicated community network of pet owners, shelter coordinators, and local volunteers who keep eyes on the ground."
            Icon={Users}
            cta="Explore Scout Community"
            onClick={onOpenNetwork}
            className="md:col-span-1 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-accent)]"
            background={
              <div className="absolute -right-4 -bottom-4 opacity-10 text-[var(--color-ink)] font-serif text-8xl italic">
                Paw
              </div>
            }
          />

          {/* 6. Medical & Owner Dossier (Spans 2 cols on md+) */}
          <BentoCard
            name="Private Health & Emergency Dossier"
            description="Store critical allergies, medication regimens, behavioral triggers, microchip records, and alternate emergency contacts safely linked to your pet's biometric profile."
            Icon={FileText}
            cta="Manage Your Companion Profile"
            onClick={onOpenManagement || onOpenQrTags}
            className="md:col-span-2 cursor-pointer bg-[var(--color-surface)] hover:border-[var(--color-ink)]"
            background={
              <div className="absolute right-6 top-6 hidden sm:flex items-center gap-2">
                <Badge variant="neutral">GRANULAR PRIVACY</Badge>
                <Badge variant="telemetry">MEDICAL READY</Badge>
              </div>
            }
          />
        </BentoGrid>
      </div>
    </section>
  );
};
