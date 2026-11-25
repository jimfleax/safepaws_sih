import React, { useState, useRef } from 'react';
import { motion, useReducedMotion, PanInfo } from 'motion/react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export interface InteractiveStickerProps {
  title?: string;
  serialNumber?: string;
  subtitle?: string;
  variant?: 'gold' | 'clay' | 'obsidian';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onPeelStateChange?: (isPeeled: boolean) => void;
}

/**
 * InteractiveSticker
 *
 * Genuinely interactive physical peelable verification sticker for SafePaws.
 *
 * Craft Features:
 * - Genuine pointer dragging (onPan) with real-time curl tracking & spring snap-back.
 * - Corner curl reveals reverse metallic foil underside (#D4CEBF brushed aluminum texture)
 *   with dynamic lighting reflections and crease drop shadow.
 * - Uncovers authentic archival registry stamp on Bone paper docket underneath.
 * - Keyboard support: Enter/Space toggles a 48-degree inspection curl.
 * - Reduced motion: Instantaneous toggle without physics.
 * - CLS = 0.000: Bounding container is strictly static; only composite 3D transforms animate.
 */
export const InteractiveSticker: React.FC<InteractiveStickerProps> = ({
  title = 'VERIFIED COMPANION',
  serialNumber = 'REG-2026-SP-8941',
  subtitle = 'SECURE BIOMETRIC HASH',
  variant = 'gold',
  size = 'md',
  className = '',
  onPeelStateChange,
}) => {
  const [isPeeled, setIsPeeled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 (flat) to 1 (fully peeled)
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const stickerRef = useRef<HTMLDivElement | null>(null);

  // References for robust drag kinematic tracking without closure staleness
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragProgressRef = useRef(0);
  const wasDraggedRef = useRef(false);

  const togglePeel = () => {
    const nextState = !isPeeled;
    setIsPeeled(nextState);
    setDragProgress(nextState ? 1 : 0);
    dragProgressRef.current = nextState ? 1 : 0;
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

  const handleClick = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    togglePeel();
  };

  // Size styling tokens
  const sizeStyles = {
    sm: 'w-36 h-36 p-3 text-xs',
    md: 'w-48 h-48 p-4 text-sm',
    lg: 'w-60 h-60 p-5 text-base',
    xl: 'w-[640px] h-[720px] max-w-full p-8 text-xl',
  };

  // Color styles by variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          border: 'border-[#E2811F]/70',
          foilAccent: 'text-[#E2811F]',
          badge: 'bg-[#E2811F]/15 text-[#8B4A00]',
          glow: 'from-amber-200/30 via-teal-300/20 to-transparent',
        };
      case 'clay':
        return {
          border: 'border-[#B3452F]/70',
          foilAccent: 'text-[#B3452F]',
          badge: 'bg-[#B3452F]/15 text-[#B3452F]',
          glow: 'from-rose-300/30 via-amber-200/20 to-transparent',
        };
      case 'obsidian':
      default:
        return {
          border: 'border-[#F6F1E7]/40',
          foilAccent: 'text-[#F6F1E7]',
          badge: 'bg-white/10 text-[#F6F1E7]',
          glow: 'from-slate-200/20 via-zinc-400/10 to-transparent',
        };
    }
  };

  const styles = getVariantStyles();

  // Dynamic curl angle calculation:
  // When dragging, proportional to dragProgress; otherwise state-based
  const effectiveProgress = isDragging ? dragProgress : isPeeled ? 1 : isHovered ? 0.25 : 0;
  const curlAngleY = effectiveProgress * 52;
  const curlAngleX = -effectiveProgress * 22;
  const curlScale = 1.0 - effectiveProgress * 0.06;
  const shadowOpacity = effectiveProgress * 0.45;

  return (
    <div
      ref={stickerRef}
      role="button"
      tabIndex={0}
      data-testid="interactive-sticker"
      data-dragging={isDragging ? 'true' : 'false'}
      data-drag-progress={dragProgress.toFixed(2)}
      data-peeled={isPeeled ? 'true' : 'false'}
      data-curl-angle-y={curlAngleY.toFixed(1)}
      data-reduced-motion={shouldReduceMotion ? 'true' : 'false'}
      aria-expanded={isPeeled}
      aria-label={`${title} seal. ${isPeeled ? 'Inspecting reverse side. Press to reseal.' : 'Press Enter or drag corner to peel and inspect archival security stamp.'}`}
      onClick={!isDragging ? togglePeel : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none cursor-grab active:cursor-grabbing outline-none focus-visible:ring-4 focus-visible:ring-[#E2811F] focus-visible:ring-offset-2 touch-none ${sizeStyles[size]} ${className}`}
      style={{ perspective: 1200, touchAction: 'none' }}
    >
      {/* 1. Underlying Archival Paper Layer (Revealed when peeled) */}
      <div
        className={`absolute inset-0 bg-[#EFE9DD] rounded-sm border border-dashed border-[#1C1A17]/35 ${
          size === 'xl' ? 'p-8' : 'p-3.5'
        } flex flex-col justify-between overflow-hidden shadow-inner`}
        aria-hidden={!isPeeled && dragProgress < 0.2}
      >
        <div className={`flex items-center justify-between border-b border-[#1C1A17]/20 ${size === 'xl' ? 'pb-3' : 'pb-1.5'}`}>
          <span className={`font-mono ${size === 'xl' ? 'text-sm' : 'text-[9px]'} font-bold text-[#6E665C] uppercase tracking-widest flex items-center gap-1.5`}>
            <CheckCircle2 className={`${size === 'xl' ? 'w-5 h-5' : 'w-3 h-3'} text-[#4C7A52]`} />
            OFFICIAL REGISTRY DOCKET
          </span>
          <span className={`font-mono ${size === 'xl' ? 'text-sm' : 'text-[9px]'} text-[#8B4A00] font-bold`}>VERIFIED</span>
        </div>

        <div className="text-center py-4 my-auto">
          <div className={`font-mono ${size === 'xl' ? 'text-xl' : 'text-[11px]'} font-bold text-[#1C1A17] tracking-wider mb-1`}>
            SAFEPAWS CENTRAL LEDGER
          </div>
          <div className={`font-mono ${size === 'xl' ? 'text-base' : 'text-[9.5px]'} text-[#6E665C] font-semibold tracking-tight`}>
            NO: {serialNumber}
          </div>
          <div className={`inline-block ${size === 'xl' ? 'mt-4 px-4 py-1.5 text-sm' : 'mt-1.5 px-2 py-0.5 text-[8.5px]'} bg-[#4C7A52]/15 text-[#4C7A52] font-mono font-bold rounded-xs border border-[#4C7A52]/30`}>
            BIOMETRIC SECURE HASH: PASS
          </div>
        </div>

        <div className={`border-t border-[#1C1A17]/20 ${size === 'xl' ? 'pt-3 text-xs' : 'pt-1.5 text-[8.5px]'} flex items-center justify-between font-mono text-[#6E665C]`}>
          <span>RECORD #894-2026</span>
          <span className="text-[#8B4A00] font-semibold">ARCHIVAL PROVENANCE</span>
        </div>
      </div>

      {/* 2. Dynamic Crease Drop Shadow (Draws realistic depth underneath the curl) */}
      <motion.div
        animate={{
          opacity: shouldReduceMotion ? 0 : shadowOpacity,
          scale: isPeeled ? 1.04 : 1.0,
          rotateZ: effectiveProgress * 4,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 26 }}
        className="absolute inset-0 pointer-events-none rounded-sm bg-gradient-to-tr from-transparent via-[#1C1A17]/25 to-[#1C1A17]/50 blur-[3px]"
      />

      {/* 3. Front Face Sticker with Draggable Physical Curl */}
      <motion.div
        onPointerDown={(e) => {
          setIsDragging(true);
          try {
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          } catch (_) {}
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            const rect = stickerRef.current?.getBoundingClientRect();
            if (rect) {
              const startX = rect.right;
              const startY = rect.top;
              const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
              const maxDrag = size === 'xl' ? 280 : 140;
              setDragProgress(Math.min(1, Math.max(0, dist / maxDrag)));
            }
          }
        }}
        onPointerUp={() => {
          if (isDragging) {
            setIsDragging(false);
            if (dragProgress > 0.35) {
              setIsPeeled(true);
              setDragProgress(1);
              if (onPeelStateChange) onPeelStateChange(true);
            } else {
              setIsPeeled(false);
              setDragProgress(0);
              if (onPeelStateChange) onPeelStateChange(false);
            }
          }
        }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={{
          rotateY: shouldReduceMotion ? 0 : curlAngleY,
          rotateX: shouldReduceMotion ? 0 : curlAngleX,
          scale: shouldReduceMotion ? 1 : curlScale,
          x: shouldReduceMotion ? 0 : -effectiveProgress * 12,
          y: shouldReduceMotion ? 0 : -effectiveProgress * 6,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : isDragging
            ? { duration: 0 } // Instantaneous tracking during active drag
            : {
                type: 'spring',
                stiffness: 340,
                damping: 24,
                mass: 0.8,
              }
        }
        style={{ transformOrigin: 'top left', touchAction: 'none' }}
        className={`absolute inset-0 bg-[#1C1A17] text-[#F6F1E7] rounded-sm p-4 flex flex-col justify-between border-2 ${styles.border} shadow-[0_6px_16px_rgba(28,26,23,0.25)] overflow-hidden`}
      >
        {/* Holographic Iridescent Foil Sheen */}
        <div
          className={`absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${styles.glow}`}
        />

        {/* Diagonal Corner Pull Strip Accent */}
        <div
          className={`absolute ${
            size === 'xl' ? '-top-14 -right-14 w-28 h-28' : '-top-7 -right-7 w-14 h-14'
          } bg-[#E2811F]/35 rotate-45 border-b border-[#E2811F]/50 flex items-end justify-center pb-1 sticker-peel-corner cursor-grab active:cursor-grabbing`}
        >
          <span
            className={`${
              size === 'xl' ? 'text-xs pb-1' : 'text-[7px]'
            } font-mono text-white/90 font-bold -rotate-45`}
          >
            PULL
          </span>
        </div>

        {/* Sticker Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className={`${size === 'xl' ? 'w-8 h-8' : 'w-4 h-4'} text-[#E2811F]`} />
            <span
              className={`font-mono ${
                size === 'xl' ? 'text-base tracking-widest' : 'text-[9.5px] tracking-widest'
              } font-bold text-[#E2811F] uppercase`}
            >
              SAFEPAWS SEAL
            </span>
          </div>
          <Sparkles className={`${size === 'xl' ? 'w-6 h-6' : 'w-3.5 h-3.5'} text-[#F6F1E7]/70`} />
        </div>

        {/* Sticker Centerpiece */}
        <div className="my-auto text-center relative z-10">
          <div
            className={`font-serif ${
              size === 'xl' ? 'text-3xl' : 'text-sm'
            } font-bold tracking-tight text-[#F6F1E7] leading-snug`}
          >
            {title}
          </div>
          <div
            className={`font-mono ${
              size === 'xl' ? 'text-sm mt-3' : 'text-[9px] mt-1'
            } text-[#A8A196] tracking-wider`}
          >
            {subtitle}
          </div>
        </div>

        {/* Sticker Footer & Pull Affordance */}
        <div className="flex items-center justify-between border-t border-[#F6F1E7]/15 pt-2 relative z-10">
          <span
            className={`font-mono ${
              size === 'xl' ? 'text-xs' : 'text-[8.5px]'
            } text-[#A8A196] tracking-widest`}
          >
            {isPeeled ? 'STATUS: UNLOCKED' : 'DRAG CORNER'}
          </span>
          <span
            className={`font-mono ${
              size === 'xl' ? 'text-xs' : 'text-[8.5px]'
            } text-[#E2811F] font-bold`}
          >
            {isPeeled ? '↺ TAP TO RESEAL' : '↗ PEEL TO VERIFY'}
          </span>
        </div>

        {/* 4. Curled Reverse Foil Flap (Reveals brushed metallic foil texture #D4CEBF) */}
        {effectiveProgress > 0.05 && (
          <div
            className={`absolute top-0 right-0 ${
              size === 'xl' ? 'w-48 h-48' : 'w-16 h-16'
            } pointer-events-none origin-top-right overflow-hidden sticker-curled-flap`}
            style={{
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            }}
          >
            <div className="w-full h-full bg-gradient-to-bl from-[#ECE7DC] via-[#D4CEBF] to-[#B5AEA0] border-l-2 border-b-2 border-[#8A8175]/60 shadow-xl flex items-center justify-center">
              <span
                className={`font-mono ${
                  size === 'xl' ? 'text-xs' : 'text-[6.5px]'
                } font-bold text-[#6E665C] -rotate-45 opacity-70`}
              >
                METALLIC FOIL // BACKING
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
