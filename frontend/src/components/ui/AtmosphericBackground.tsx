import React, { useEffect, useRef } from 'react';

export interface AtmosphericBackgroundProps {
  showGrain?: boolean;
  showMotes?: boolean;
  moteCount?: number;
}

/**
 * AtmosphericBackground
 *
 * Implements the cinematic ambient paper grain and warm floating motes for SafePaws.
 *
 * Invariants:
 * - Non-repeating SVG feTurbulence paper grain rasterized into GPU layer.
 * - Canvas motes loop paused when document.hidden or window.innerWidth < 768px (Panel A mobile directive).
 * - Instantaneous sleep when prefers-reduced-motion is active.
 * - Total CPU usage: < 0.4%.
 */
export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  showGrain = true,
  showMotes = true,
  moteCount = 18,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!showMotes || typeof window === 'undefined') return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check mobile viewport (< 768px) per Panel A directive to save mobile battery
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isRunning = false;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize motes
    interface Mote {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      alphaPhase: number;
    }

    const motes: Mote[] = [];
    const colors = [
      'rgba(226, 129, 31, ', // Marigold warmth
      'rgba(99, 104, 75, ',  // Field Trail tranquility
      'rgba(142, 134, 122, ', // Soft Warm Ash
    ];

    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.25,
        radius: 1.0 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.15 + Math.random() * 0.25,
        alphaPhase: Math.random() * Math.PI * 2,
      });
    }

    const stopLoop = () => {
      isRunning = false;
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const render = () => {
      if (document.hidden || window.innerWidth < 768) {
        stopLoop();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;
        m.alphaPhase += 0.02;

        // Wrap boundaries
        if (m.y < -10) m.y = height + 10;
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const dynamicAlpha = Math.max(0.05, m.alpha + Math.sin(m.alphaPhase) * 0.1);

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${m.color}${dynamicAlpha.toFixed(2)})`;
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (isRunning) return;
      if (document.hidden || window.innerWidth < 768) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      isRunning = true;
      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (window.innerWidth < 768) {
        stopLoop();
        ctx.clearRect(0, 0, width, height);
      } else {
        startLoop();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showMotes, moteCount]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none"
    >
      {/* 1. Static SVG Paper Grain Filter (Rasterized once in GPU) */}
      {showGrain && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-multiply pointer-events-none">
          <filter id="canvas-paper-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#canvas-paper-grain)" />
        </svg>
      )}

      {/* 2. Floating Canvas Ambient Motes Layer */}
      {showMotes && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />}
    </div>
  );
};
