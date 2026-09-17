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
      className="w-full bg-[#1C1A17] text-[#F6F1E7] py-20 sm:py-24 lg:py-32"
      id="community-section"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="mb-14 sm:mb-16 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-[#8A8175] uppercase mb-5">
            <span className="w-5 h-px bg-[#8A8175] inline-block" />
            Community &amp; Recovery
          </span>
          <h2 className="font-serif text-[34px] sm:text-[46px] leading-tight text-white mb-4">
            A neighborhood that looks out for each other.
          </h2>
          <p className="text-[17px] text-[#8A8175] leading-relaxed">
            When a pet goes missing, a fast response is everything. SafePaws
            connects you to people nearby who can help — no exaggerated claims,
            just real people working together.
          </p>
        </div>

        {/* Feature cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-3xl p-7 sm:p-8 transition-all duration-200 hover:bg-white/[0.07] hover:-translate-y-1 hover:border-white/[0.14]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E2811F]/15 flex items-center justify-center mb-6 transition-colors group-hover:bg-[#E2811F]/22">
                <Icon className="w-6 h-6 text-[#E2811F]" />
              </div>
              <h3 className="text-[19px] font-semibold text-white mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-[#8A8175] text-[15px] leading-relaxed flex-1">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
