import React, { useRef, useEffect } from 'react';
import { Camera, Plus, ArrowRight, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

interface CtaSectionProps {
  onStartClick: () => void;
  onScanClick?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartClick, onScanClick }) => {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current?.children || [], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24"
      aria-label="Closing Call to Action"
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[var(--radius-28)] bg-[var(--color-ink)] text-[var(--color-bone)] p-8 sm:p-14 lg:p-20 text-center flex flex-col items-center shadow-2xl"
      >
        {/* Ambient Warm Gradient Orb */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[var(--color-marigold)]/25 to-transparent rounded-full blur-3xl"
          aria-hidden="true"
        />

        {/* Eyebrow */}
        <div className="relative z-10 mb-6">
          <Badge
            variant="scout"
            className="bg-white/10 text-white border-white/20 font-mono tracking-widest text-[11px]"
          >
            PEACE OF MIND BEFORE THE LEASH UNCLIPS
          </Badge>
        </div>

        {/* Headline */}
        <h2 className="relative z-10 font-serif text-[38px] sm:text-[54px] lg:text-[68px] leading-[1.05] tracking-tight max-w-3xl mb-8">
          Because every minute matters when a companion is missing.
        </h2>

        {/* Supporting text */}
        <p className="relative z-10 text-[length:var(--text-body-large)] text-[var(--color-bone)]/80 max-w-xl leading-relaxed mb-12">
          Registration takes less than 3 minutes with your smartphone camera. Give your dog an immutable, unlosable identity and join a community that looks out for every tail.
        </p>

        {/* Dual CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            variant="accent"
            size="lg"
            onClick={onStartClick}
            leftIcon={<Plus className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg hover:shadow-xl font-bold"
          >
            REGISTER YOUR COMPANION
          </Button>

          {onScanClick && (
            <Button
              variant="outline"
              size="lg"
              onClick={onScanClick}
              leftIcon={<Camera className="w-5 h-5 text-[var(--color-bone)]" />}
              className="w-full sm:w-auto border-white/30 text-[var(--color-bone)] hover:bg-white/10 hover:text-white"
            >
              SCAN A FOUND DOG
            </Button>
          )}
        </div>

        {/* Bottom Guarantee */}
        <div className="relative z-10 mt-10 pt-8 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-white/60">
          <Heart className="w-4 h-4 text-[var(--color-marigold)]" />
          <span>Non-invasive optical identification. No special equipment required.</span>
        </div>
      </div>
    </section>
  );
};
