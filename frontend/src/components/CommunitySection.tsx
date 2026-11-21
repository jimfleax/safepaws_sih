import React, { useRef, useEffect } from 'react';
import {
  Users,
  BellRing,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { usePetStore } from '../store/petStore';

gsap.registerPlugin(ScrollTrigger);

interface CommunitySectionProps {
  onOpenCommunity?: () => void;
  onOpenAlerts?: () => void;
  onOpenReportSighting?: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  onOpenCommunity,
  onOpenAlerts,
  onOpenReportSighting,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { alerts } = usePetStore();
  const activeAlerts = alerts?.slice(0, 3) || [];

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

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 88%',
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32"
      aria-label="SafePaws Community Recovery Network"
    >
      {/* Header */}
      <div ref={headerRef} className="flex flex-col mb-16 sm:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="accent" className="px-3 py-0.5 font-bold">
            NEIGHBORHOOD RESCUE NETWORK
          </Badge>
          <span className="text-[length:var(--text-metadata)] font-medium text-[var(--color-ink-soft)] uppercase tracking-widest hidden sm:inline-block">
            // LOCAL SCOUT WATCH
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-[38px] sm:text-[54px] lg:text-[62px] text-[var(--color-ink)] leading-[1.08] tracking-tight max-w-2xl">
              Powered by neighbors who look out for one another.
            </h2>
          </div>
          <p className="text-[length:var(--text-body-large)] text-[var(--color-ink-soft)] max-w-md leading-relaxed">
            Technology maps the biometric signal, but local volunteers bring our companions home. Explore active alerts and community sightings.
          </p>
        </div>
      </div>

      {/* Community Network Architectural Pillars Banner */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-[var(--radius-24)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm mb-16"
      >
        {/* Pillar 1: Radius Broadcasts */}
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-[var(--radius-12)] bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)]/30 flex items-center justify-center text-[var(--color-accent-text)] mb-3">
            <Radio className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-serif font-bold text-lg text-[var(--color-ink)]">
            Radius Broadcasts
          </span>
          <p className="text-xs text-[var(--color-ink-soft)] mt-1.5 leading-relaxed">
            Perimeter alert dispatch mobilizes verified local scouts within kilometers of last sighting.
          </p>
          <span className="mt-3 inline-flex items-center text-[10px] font-mono font-medium text-[var(--color-accent-text)] uppercase tracking-wider">
            // Neighborhood Mesh
          </span>
        </div>

        {/* Pillar 2: Map-Pinned Sightings */}
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-[var(--radius-12)] bg-[var(--color-trail)]/15 border border-[var(--color-trail)]/30 flex items-center justify-center text-[var(--color-trail)] mb-3">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-serif font-bold text-lg text-[var(--color-ink)]">
            Map-Pinned Sightings
          </span>
          <p className="text-xs text-[var(--color-ink-soft)] mt-1.5 leading-relaxed">
            Scouts submit geotagged photos and time-stamped notes to trace companion movement vectors.
          </p>
          <span className="mt-3 inline-flex items-center text-[10px] font-mono font-medium text-[var(--color-trail)] uppercase tracking-wider">
            // GPS Geofenced
          </span>
        </div>

        {/* Pillar 3: Verified Scout Dispatch */}
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-[var(--radius-12)] bg-[var(--color-success)]/15 border border-[var(--color-success)]/30 flex items-center justify-center text-[var(--color-success)] mb-3">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-serif font-bold text-lg text-[var(--color-ink)]">
            Verified Scout Dispatch
          </span>
          <p className="text-xs text-[var(--color-ink-soft)] mt-1.5 leading-relaxed">
            Direct, open-access finder channels enable rapid coordination without mandatory account friction.
          </p>
          <span className="mt-3 inline-flex items-center text-[10px] font-mono font-medium text-[var(--color-success)] uppercase tracking-wider">
            // Rapid Response
          </span>
        </div>

        {/* Pillar 4: Guardian Privacy Protection */}
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-[var(--radius-12)] bg-[var(--color-ink)]/10 border border-[var(--color-ink)]/20 flex items-center justify-center text-[var(--color-ink)] mb-3">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-serif font-bold text-lg text-[var(--color-ink)]">
            Guardian Privacy Shield
          </span>
          <p className="text-xs text-[var(--color-ink-soft)] mt-1.5 leading-relaxed">
            Emergency contact masking and controlled data exposure protect guardian identity in public search.
          </p>
          <span className="mt-3 inline-flex items-center text-[10px] font-mono font-medium text-[var(--color-ink-soft)] uppercase tracking-wider">
            // Ethical Data Guard
          </span>
        </div>
      </div>

      {/* Active Alerts / Community Showcase Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14"
      >
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alert: any) => (
            <div
              key={alert.id}
              onClick={onOpenAlerts}
              className="group p-6 rounded-[var(--radius-24)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-alert-clay)] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="alert" pulse>
                    ACTIVE LOST ALERT
                  </Badge>
                  <span className="text-xs font-mono text-[var(--color-ink-soft)]">
                    {alert.petName || 'Companion'}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-2">
                  {alert.title || `Missing: ${alert.petName}`}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                  {alert.description || 'Last seen in neighborhood perimeter. Community search active.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-alert-clay)]">
                <span>View Alert Details</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))
        ) : (
          /* Illustrative Sample Cards Clearly Labeled */
          <>
            <div
              onClick={onOpenAlerts}
              className="group p-6 rounded-[var(--radius-24)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="alert" pulse>
                    LOST ALERT // DEMO
                  </Badge>
                  <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
                    Sample Case
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-2">
                  Olive — Golden Retriever
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                  Last seen near Elmwood Park Trailhead. Wearing red collar with SafePaws Smart QR Tag. Gentle with other dogs.
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-ink)] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-marigold)]" />
                  <span>Elmwood District (0.8 mi away)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-accent-text)]">
                <span>View Alert Network</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            <div
              onClick={onOpenReportSighting}
              className="group p-6 rounded-[var(--radius-24)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-trail)] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="telemetry">
                    VERIFIED SIGHTING // DEMO
                  </Badge>
                  <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
                    Sample Report
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-2">
                  Spotted near Creek Path
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                  Photo uploaded by local scout. GPS coordinate logged: 37.7749° N, 122.4194° W. Owner notified immediately.
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-success)] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Photo & Geofence Verified</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-trail)]">
                <span>Submit a Sighting</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            <div
              onClick={onOpenCommunity}
              className="group p-6 rounded-[var(--radius-24)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-ink)] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="scout">
                    RECOVERY STORY // DEMO
                  </Badge>
                  <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
                    Case #284
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-2">
                  Reunited in 42 Minutes
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                  "Barnaby slipped his leash during fireworks. A neighbor scanned his nose leather using SafePaws, and we had him safe before panic set in."
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-ink-soft)]">
                  <Users className="w-3.5 h-3.5 text-[var(--color-ink)]" />
                  <span>Verified SafePaws Member</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-ink)]">
                <span>Read Community Stories</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Network CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={onOpenAlerts}
          className="bg-white hover:bg-[var(--color-bone)] shadow-sm"
        >
          BROWSE ACTIVE LOST ALERTS
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onOpenCommunity}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          EXPLORE SCOUT COMMUNITY
        </Button>
      </div>
    </section>
  );
};
