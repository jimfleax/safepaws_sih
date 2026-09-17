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
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      // Entrance Animations
      gsap.from(imageRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      gsap.from(textRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Scroll Parallax (exactly as specified: desktop parallax)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      tl.to(imageRef.current, { y: 150, ease: 'none' }, 0);
      tl.to(textRef.current, { y: 80, opacity: 0, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        
        {/* Image Column */}
        <div className="w-full lg:w-5/12 order-1 lg:order-2">
          <div
            ref={imageRef}
            className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-[#E8D5BF]"
          >
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop" 
              alt="Close up of a dog's nose"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text and Actions Column */}
        <div 
          ref={textRef}
          className="w-full lg:w-7/12 order-2 lg:order-1 flex flex-col items-start text-left"
        >
          <h1 className="font-serif text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] text-[#241812] font-normal">
            A community safety net for your pet.
          </h1>

          <p className="mt-6 sm:mt-7 text-[16px] sm:text-[18px] leading-[1.65] text-[#55463D] max-w-[480px]">
            Every dog’s nose print is unique. Use it to protect them. Join our neighborhood-powered recovery network to ensure every lost companion finds their way home.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onIdentifyClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#DE6828] hover:bg-[#CA581B] active:bg-[#B54C14] text-white font-medium text-[15px] shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>SCAN A DOG</span>
            </button>
            <button
              onClick={onJoinClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-[#FDF9F5] active:bg-[#F2EAE1] text-[#241812] font-medium text-[15px] shadow-sm border border-[#E4D5C5] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>REGISTER YOUR PET</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
