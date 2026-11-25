import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface VariableProximityTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  radius?: number;
  minWeight?: number;
  maxWeight?: number;
  minOpsz?: number;
  maxOpsz?: number;
  granularity?: 'word' | 'char';
  fallbackWeight?: number;
}

/**
 * VariableProximityText
 *
 * Implements signature cursor-proximity elastic variable typography for SafePaws.
 * Modulates font weight (wght: 600..800 clamped) and optical size (opsz: 14..72)
 * using a Gaussian smoothstep falloff relative to pointer distance.
 *
 * Accessibility & Performance Invariants:
 * - Reduced motion: Completely unhooks pointer listeners; renders static fallback weight.
 * - Coarse pointer (mobile/touch): Deactivates continuous tracking to guarantee 60 FPS; renders static editorial weight.
 * - Screen readers: Exposes clean semantic text via aria-label to avoid character-by-character pronunciation issues.
 */
export const VariableProximityText: React.FC<VariableProximityTextProps> = ({
  text,
  as: Component = 'h1',
  className = '',
  radius = 240,
  minWeight = 600,
  maxWeight = 800, // Clamped per Panel A directive to prevent synthetic bold distortion
  minOpsz = 14,
  maxOpsz = 72,
  granularity = 'word',
  fallbackWeight = 700,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  // Split text into tokens based on granularity
  const tokens = useMemo(() => {
    if (granularity === 'char') {
      return text.split('');
    }
    return text.split(' ');
  }, [text, granularity]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Accessibility check: reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInteractive(false);
      return;
    }

    // 2. Mobile / Ergonomic check: coarse pointer devices (touchscreens)
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) {
      setIsInteractive(false);
      return;
    }

    setIsInteractive(true);

    let mouseX = -1000;
    let mouseY = -1000;
    let isScheduled = false;

    const updateWeights = () => {
      isScheduled = false;
      const elements = spanRefs.current;
      const len = elements.length;

      for (let i = 0; i < len; i++) {
        const el = elements[i];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

        if (dist < radius) {
          // Normalized proximity: 1 at center, 0 at boundary
          const t = 1 - dist / radius;
          // Hermite smoothstep curve: 3t^2 - 2t^3
          const factor = 3 * t * t - 2 * t * t * t;

          const wght = Math.round(minWeight + (maxWeight - minWeight) * factor);
          const opsz = Math.round(minOpsz + (maxOpsz - minOpsz) * factor);

          el.style.fontVariationSettings = `'wght' ${wght}, 'opsz' ${opsz}`;
        } else {
          el.style.fontVariationSettings = `'wght' ${minWeight}, 'opsz' ${minOpsz}`;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isScheduled) {
        isScheduled = true;
        rafId.current = window.requestAnimationFrame(updateWeights);
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      if (!isScheduled) {
        isScheduled = true;
        rafId.current = window.requestAnimationFrame(updateWeights);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, [radius, minWeight, maxWeight, minOpsz, maxOpsz]);

  return (
    <Component
      ref={containerRef as any}
      aria-label={text}
      className={`select-none font-serif tracking-tight ${className}`}
    >
      {tokens.map((token, index) => (
        <span
          key={`${token}-${index}`}
          ref={(el) => {
            spanRefs.current[index] = el;
          }}
          aria-hidden="true"
          style={{
            fontVariationSettings: isInteractive
              ? `'wght' ${minWeight}, 'opsz' ${minOpsz}`
              : `'wght' ${fallbackWeight}, 'opsz' ${minOpsz}`,
            transition: isInteractive ? 'font-variation-settings 0.08s ease-out' : 'none',
            display: 'inline-block',
          }}
        >
          {token}
          {granularity === 'word' && index < tokens.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Component>
  );
};
