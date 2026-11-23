import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, Shield, Eye, ScanLine, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

gsap.registerPlugin(ScrollTrigger);

interface ScannerTeaserSectionProps {
  onOpenScan: () => void;
}

type ScanStage = 'align' | 'extract' | 'match';

export const ScannerTeaserSection: React.FC<ScannerTeaserSectionProps> = ({ onOpenScan }) => {
  const [activeStage, setActiveStage] = useState<ScanStage>('extract');
  const containerRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from([hudRef.current, textRef.current], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#161513] text-[var(--color-bone)] py-20 sm:py-28 lg:py-32 overflow-hidden"
      aria-label="Biometric Scanner Interactive Demonstration"
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F6F1E7 1px, transparent 1px), linear-gradient(to bottom, #F6F1E7 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="scout" className="bg-[var(--color-marigold)]/15 text-[var(--color-marigold)] border-[var(--color-marigold)]/30 font-mono">
                BIOMETRIC SCANNER HUD
              </Badge>
              <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
                // OPTICAL VERIFICATION
              </span>
            </div>
            <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] text-white leading-tight max-w-2xl">
              Nose-print biometrics in action.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/70 max-w-md">
            No painful needles. No proprietary scanner wands. An ordinary camera photo maps the unique nasal topography for instant community identification.
          </p>
        </div>

        {/* Interactive HUD & Explanation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Simulated HUD Viewfinder */}
          <div ref={hudRef} className="lg:col-span-6 flex flex-col items-center">
            {/* Viewfinder Frame */}
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[var(--radius-24)] overflow-hidden bg-[#0D0C0B] border border-white/15 shadow-2xl p-6 flex flex-col justify-between">
              {/* Background Sample Photo */}
              <img
                src="/images/rescue_hud.jpg"
                alt="Simulated canine nose leather sample for optical scanning demonstration"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] brightness-[0.75] opacity-60 pointer-events-none"
              />

              {/* Viewfinder Header */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-white/80 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-marigold)] animate-ping" />
                  <span className="text-[var(--color-marigold)]">VIEWFINDER ACTIVE</span>
                </div>
                <span>RGB OPTICAL</span>
              </div>

              {/* Center Interactive Reticle */}
              <div className="relative z-10 self-center w-56 h-56 flex items-center justify-center">
                {/* 4 Viewfinder Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-marigold)]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-marigold)]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-marigold)]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-marigold)]" />

                {/* State-dependent Overlay */}
                {activeStage === 'align' && (
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-24 h-24 border border-dashed border-white/40 rounded-full flex items-center justify-center animate-pulse">
                      <Eye className="w-8 h-8 text-white/80" />
                    </div>
                    <span className="mt-4 font-mono text-xs text-white/90 bg-black/60 px-3 py-1 rounded">
                      CENTER NOSE LEATHER
                    </span>
                  </div>
                )}

                {activeStage === 'extract' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="absolute inset-4 rounded-full border border-[var(--color-marigold)]/50 bg-[var(--color-marigold)]/10 animate-pulse" />
                    <ScanLine className="w-12 h-12 text-[var(--color-marigold)] animate-bounce" />
                    <span className="mt-4 font-mono text-xs text-[var(--color-marigold)] bg-black/80 px-3 py-1 rounded border border-[var(--color-marigold)]/30">
                      EXTRACTING RIDGE TOPOLOGY
                    </span>
                  </div>
                )}

                {activeStage === 'match' && (
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-marigold)]/20 border-2 border-[var(--color-marigold)] flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-10 h-10 text-[var(--color-marigold)]" />
                    </div>
                    <span className="font-mono text-[10px] sm:text-xs text-white font-bold bg-black/85 px-3 py-1.5 rounded border border-[var(--color-marigold)]/30 text-center max-w-[200px] leading-snug">
                      POTENTIAL MATCH DETECTED — CONFIRMATION REQUIRED
                    </span>
                  </div>
                )}
              </div>

              {/* Viewfinder Telemetry Footer */}
              <div className="relative z-10 flex flex-col gap-2 font-mono text-[10px] text-white/70 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span>CAMERA STATUS: SIMULATED HUD PREVIEW</span>
                  <span className="text-[var(--color-marigold)]">NO LIVE PERMISSION ACCESSED</span>
                </div>
                <div className="text-[9px] text-white/50">
                  Real optical camera feed activates strictly within the dedicated /scan route.
                </div>
              </div>
            </div>

            {/* Interactive Stage Selector Controls */}
            <div className="flex items-center gap-2 mt-6 p-1.5 bg-[#22201D] rounded-full border border-white/10 max-w-[480px] w-full justify-center">
              <button
                type="button"
                onClick={() => setActiveStage('align')}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] cursor-pointer ${
                  activeStage === 'align'
                    ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                1. Alignment
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('extract')}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] cursor-pointer ${
                  activeStage === 'extract'
                    ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                2. Ridge Isolation
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('match')}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] cursor-pointer ${
                  activeStage === 'match'
                    ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                3. Verification
              </button>
            </div>
          </div>

          {/* Right Column: Grounded Technical Explanation */}
          <div ref={textRef} className="lg:col-span-6 flex flex-col items-start">
            <Badge variant="scout" className="mb-6 font-mono bg-white/10 text-white border-white/20">
              GROUNDED BIOMETRIC WORKFLOW
            </Badge>

            <h3 className="font-serif text-[28px] sm:text-[38px] text-white leading-tight mb-6">
              How SafePaws identifies a wandering companion.
            </h3>

            <div className="flex flex-col gap-6 mb-10 w-full">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[var(--color-marigold)]/20 text-[var(--color-marigold)] flex items-center justify-center shrink-0 font-mono text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Optical Close-Up Capture
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    A rescuer or finder uses their phone browser to capture a clear, forward-facing photo of the dog's nose leather in ambient daylight or indoor lighting.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[var(--color-marigold)]/20 text-[var(--color-marigold)] flex items-center justify-center shrink-0 font-mono text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Nasal Ridge Vectorization
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Our neural network segments the dorsal nasal plane and extracts invariant biometric ridge embeddings. The pattern remains unique even as dogs age or change weight.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[var(--color-marigold)]/20 text-[var(--color-marigold)] flex items-center justify-center shrink-0 font-mono text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Community Registry Match & Relay
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    The extracted vector is compared against registered dog profiles. Upon match, the finder can access the owner's emergency contact profile or notify the rescue network immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety & Transparency Note */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-marigold)]/10 border border-[var(--color-marigold)]/20 text-[var(--color-bone)] text-xs mb-8">
              <Shield className="w-5 h-5 text-[var(--color-marigold)] shrink-0" />
              <span>
                <strong>Privacy Invariant:</strong> SafePaws never requests camera access automatically. Permissions are explicitly requested only when you tap "Launch Live Scanner".
              </span>
            </div>

            {/* Launch Scanner CTA */}
            <Button
              variant="accent"
              size="lg"
              onClick={onOpenScan}
              leftIcon={<Camera className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              LAUNCH LIVE BIOMETRIC SCANNER
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
