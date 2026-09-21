import React, { useRef, useEffect } from 'react';
import { Users, BellRing, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BellRing,
    title: 'Instant Local Alerts',
    body: 'Notify the network immediately. Alerts reach active community members in your immediate area to expand your search.',
  },
  {
    icon: MapPin,
    title: 'Verified Sightings',
    body: 'Track reported sightings with precise location data. All updates are logged so you can focus your search where they were last seen.',
  },
  {
    icon: Users,
    title: 'Community Support',
    body: 'Neighbors and local volunteers who are genuinely invested in bringing every lost companion home safely.',
  },
];

export const CommunitySection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 82%',
        },
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 82%',
        },
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.16,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-[var(--color-ink)] text-[var(--color-bone)] py-20 sm:py-24 lg:py-32"
      id="community-section"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="mb-14 sm:mb-20 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] text-[var(--color-ink-soft)] uppercase mb-6">
            <span className="w-6 h-px bg-[var(--color-ink-soft)] inline-block" />
            Community &amp; Recovery
          </span>
          <h2 className="font-serif text-[38px] sm:text-[52px] leading-[1.05] tracking-tight text-white mb-6">
            A neighborhood that looks out for each other.
          </h2>
          <p className="text-[18px] text-[var(--color-ink-soft)] leading-relaxed">
            When a pet goes missing, a fast response is everything. SafePaws
            connects you to people nearby who can help — no exaggerated claims,
            just real people working together.
          </p>
        </div>

        {/* Feature cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group flex flex-col bg-[var(--color-surface)]/[0.04] border border-[var(--color-surface)]/[0.08] rounded-[var(--radius-28)] p-8 sm:p-10 transition-all duration-300 hover:bg-[var(--color-surface)]/[0.08] hover:-translate-y-1 hover:border-[var(--color-surface)]/[0.15] hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-[var(--radius-16)] bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/10 flex items-center justify-center mb-8 transition-colors group-hover:bg-[var(--color-accent)]/25">
                <Icon className="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-[22px] font-bold text-white mb-4 leading-snug">
                {title}
              </h3>
              <p className="text-[var(--color-ink-soft)] text-[16px] leading-relaxed flex-1">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
