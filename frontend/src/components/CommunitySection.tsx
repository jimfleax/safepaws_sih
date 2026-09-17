import React, { useRef, useEffect } from 'react';
import { Users, BellRing, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CommunitySection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        },
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });

      // Cards Stagger
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#27170E] text-[#FAF6F0] py-20 sm:py-24 lg:py-32 my-8" id="community-section">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div 
          ref={headerRef}
          className="flex items-center justify-between mb-16 flex-col md:flex-row gap-6"
        >
          <div className="flex flex-col max-w-xl">
            <span className="text-[12px] font-bold tracking-[0.12em] text-[#D8C7B8] uppercase mb-4 block">
              COMMUNITY & RECOVERY
            </span>
            <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-white mb-4">
              A neighborhood that looks out for each other.
            </h2>
            <p className="text-[18px] text-[#B8A498] leading-relaxed">
              When a pet goes missing, a fast response is everything. SafePaws connects you instantly to people nearby who can help. No exaggerated claims—just real people working together.
            </p>
          </div>
        </div>

        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start transition-transform hover:bg-white/10 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-[#DE6828]/20 flex items-center justify-center mb-6">
              <BellRing className="w-6 h-6 text-[#DE6828]" />
            </div>
            <h3 className="text-[22px] font-semibold text-white mb-4">Instant Local Alerts</h3>
            <p className="text-[#B8A498] text-[16px] leading-relaxed">
              Notify the network immediately. Alerts reach active community members in your immediate area to expand your search instantly.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start transition-transform hover:bg-white/10 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-[#DE6828]/20 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-[#DE6828]" />
            </div>
            <h3 className="text-[22px] font-semibold text-white mb-4">Verified Sightings</h3>
            <p className="text-[#B8A498] text-[16px] leading-relaxed">
              Track reported sightings on a live map. All updates are logged so you can focus your search exactly where they were last seen.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start transition-transform hover:bg-white/10 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-[#DE6828]/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-[#DE6828]" />
            </div>
            <h3 className="text-[22px] font-semibold text-white mb-4">Community Support</h3>
            <p className="text-[#B8A498] text-[16px] leading-relaxed">
              Work alongside neighbors and local volunteers who are genuinely invested in bringing every lost companion home safely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
