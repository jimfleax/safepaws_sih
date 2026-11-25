import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export interface InteractiveStickerProps {
  title?: string;
  serialNumber?: string;
  subtitle?: string;
  variant?: 'gold' | 'clay' | 'obsidian';
  className?: string;
  onPeelStateChange?: (isPeeled: boolean) => void;
}

/**
 * InteractiveSticker
 *
 * Genuinely interactive physical peelable verification sticker for SafePaws.
 * Recreates physical paper and foil curling geometry, revealing an authentic
 * metallic underside and an archival verification registry stamp underneath.
 *
 * Accessibility & Invariants:
 * - Semantics: role="button" with tabIndex={0} and aria-expanded state.
 * - Keyboard: Enter or Space toggles a controlled 45-degree inspection curl.
 * - Reduced Motion: Bypasses spring physics and transitions instantly.
 * - CLS = 0.000: Bounding box is strictly static; only composite 3D transforms animate.
 */
export const InteractiveSticker: React.FC<InteractiveStickerProps> = ({
  title = 'VERIFIED COMPANION',
  serialNumber = 'REG-2026-SP-8941',
  subtitle = 'SECURE BIOMETRIC HASH',
  variant = 'gold',
  className = '',
  onPeelStateChange,
}) => {
  const [isPeeled, setIsPeeled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const togglePeel = () => {
    const nextState = !isPeeled;
    setIsPeeled(nextState);
    if (onPeelStateChange) {
      onPeelStateChange(nextState);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePeel();
    }
  };

  // Color styles by variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          border: 'border-[#E2811F]/60',
          foilAccent: 'text-[#E2811F]',
          badge: 'bg-[#E2811F]/15 text-[#8B4A00]',
        };
      case 'clay':
        return {
          border: 'border-[#B3452F]/60',
          foilAccent: 'text-[#B3452F]',
          badge: 'bg-[#B3452F]/15 text-[#B3452F]',
        };
      case 'obsidian':
      default:
        return {
          border: 'border-[#1C1A17]/30',
          foilAccent: 'text-[#1C1A17]',
          badge: 'bg-[#1C1A17]/10 text-[#1C1A17]',
        };
    }
  };

  const styles = getVariantStyles();

  // Corner curl transform calculation
  const curlAngle = isPeeled ? 48 : isHovered ? 14 : 0;
  const curlScale = isPeeled ? 0.94 : 1.0;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isPeeled}
      aria-label={`${title} seal. ${isPeeled ? 'Inspecting reverse side. Press to reseal.' : 'Press Enter or click to peel and inspect archival security stamp.'}`}
      onClick={togglePeel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-44 h-44 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A17] focus-visible:ring-offset-2 ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* 1. Underlying Archival Paper Layer (Revealed when peeled) */}
      <div
        className="absolute inset-0 bg-[#EFE9DD] rounded-sm border border-dashed border-[#1C1A17]/30 p-3 flex flex-col justify-between overflow-hidden shadow-inner"
        aria-hidden={!isPeeled}
      >
        <div className="flex items-center justify-between border-b border-[#1C1A17]/20 pb-1">
          <span className="font-mono text-[9px] font-bold text-[#6E665C] uppercase tracking-widest">
            OFFICIAL LEDGER
          </span>
          <span className="font-mono text-[9px] text-[#8B4A00] font-semibold">AUTHENTIC</span>
        </div>

        <div className="text-center py-2">
          <div className="font-mono text-[10px] font-bold text-[#1C1A17] tracking-wider mb-0.5">
            SAFEPAWS REGISTRY
          </div>
          <div className="font-mono text-[9px] text-[#6E665C] tracking-tight">
            NO: {serialNumber}
          </div>
          <div className="inline-block mt-1 px-1.5 py-0.5 bg-[#4C7A52]/15 text-[#4C7A52] font-mono text-[8px] font-bold rounded-xs">
            SECURE SEAL VERIFIED
          </div>
        </div>

        <div className="border-t border-[#1C1A17]/20 pt-1 flex items-center justify-between text-[8px] font-mono text-[#6E665C]">
          <span>RECORD #894-2026</span>
          <span>TAMPER EVIDENT</span>
        </div>
      </div>

      {/* 2. Crease Cast Shadow (Draws depth underneath the curl) */}
      <motion.div
        animate={{
          opacity: isPeeled ? 0.35 : isHovered ? 0.15 : 0,
          scale: isPeeled ? 1.05 : 1,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 24 }}
        className="absolute inset-0 pointer-events-none rounded-sm bg-gradient-to-tr from-transparent via-[#1C1A17]/20 to-[#1C1A17]/40 blur-xs"
      />

      {/* 3. Front Face Sticker (The Peelable Top Layer) */}
      <motion.div
        animate={{
          rotateX: shouldReduceMotion ? 0 : isPeeled ? -curlAngle * 0.4 : 0,
          rotateY: shouldReduceMotion ? 0 : curlAngle,
          scale: shouldReduceMotion ? 1 : curlScale,
          x: shouldReduceMotion ? 0 : isPeeled ? -8 : 0,
          y: shouldReduceMotion ? 0 : isPeeled ? -4 : 0,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: 'spring',
                stiffness: 320,
                damping: 24,
                mass: 0.8,
              }
        }
        style={{ transformOrigin: 'top left' }}
        className={`absolute inset-0 bg-[#1C1A17] text-[#F6F1E7] rounded-sm p-3.5 flex flex-col justify-between border-2 ${styles.border} shadow-md overflow-hidden`}
      >
        {/* Holographic Iridescent Foil Sheen */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-teal-300 to-transparent" />

        {/* Diagonal Corner Foil Strip */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#E2811F]/30 rotate-45 border-b border-[#E2811F]/40" />

        {/* Sticker Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2811F]" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#E2811F] uppercase">
              SAFEPAWS SEAL
            </span>
          </div>
          <Sparkles className="w-3 h-3 text-[#F6F1E7]/60" />
        </div>

        {/* Sticker Centerpiece */}
        <div className="my-auto text-center relative z-10">
          <div className="font-serif text-xs font-bold tracking-tight text-[#F6F1E7]">
            {title}
          </div>
          <div className="font-mono text-[8.5px] text-[#A8A196] tracking-wider mt-0.5">
            {subtitle}
          </div>
        </div>

        {/* Sticker Footer & Pull Affordance */}
        <div className="flex items-center justify-between border-t border-[#F6F1E7]/15 pt-2 relative z-10">
          <span className="font-mono text-[8px] text-[#A8A196] tracking-widest">
            {isPeeled ? 'PEELED' : 'PEEL TO VERIFY'}
          </span>
          <span className="font-mono text-[8px] text-[#E2811F] font-bold">
            {isPeeled ? '↺ TAP TO RESET' : '↗ CORNER LIFT'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
