import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only use custom cursor if reduced motion is not preferred
    // and it's a pointer device (not touch)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (prefersReducedMotion || isTouchDevice) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.dataset.cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Core Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[var(--color-accent)] rounded-full pointer-events-none z-[10000] mix-blend-exclusion"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-[var(--color-accent)] rounded-full pointer-events-none z-[9999] mix-blend-exclusion backdrop-invert-[0.1]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? 'var(--color-accent)' : 'transparent',
          opacity: isHovering ? 0.2 : 0.8
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 25, mass: 1 }}
      />
      {/* Glow Trail */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-[var(--color-accent)] rounded-full pointer-events-none z-[9998] mix-blend-screen blur-3xl opacity-20"
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30, mass: 2 }}
      />
    </>
  );
};
