import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PawPrint } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'text' | 'paw' | 'hidden'>('default');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (prefersReducedMotion || isTouchOnly) {
      if (containerRef.current) containerRef.current.style.display = 'none';
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const container = containerRef.current;
    if (!cursor || !follower || !container) return;

    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.5, ease: "power3.out" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.5, ease: "power3.out" });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        gsap.to(container, { opacity: 1, duration: 0.3 });
      }
      
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to(container, { opacity: 0, duration: 0.3 });
    };

    const handleMouseEnter = () => {
      isVisible = true;
      gsap.to(container, { opacity: 1, duration: 0.3 });
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestInteractive = target.closest('button, a, [role="button"], input, select, textarea');
      const dataCursor = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const dataCursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');

      if (dataCursorText) {
        setCursorText(dataCursorText);
        setCursorMode('text');
      } else if (dataCursor === 'paw') {
        setCursorMode('paw');
      } else if (dataCursor === 'hidden') {
        setCursorMode('hidden');
      } else if (closestInteractive) {
        setCursorMode('hover');
      } else {
        setCursorMode('default');
        setCursorText('');
      }
    };

    const handleHoverEnd = () => {
      setCursorMode('default');
      setCursorText('');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    // Initial position
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50 });
    gsap.set(follower, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50 });
    gsap.set(container, { opacity: 0 }); // Hidden until first mouse move

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  // Handle mode animations
  useEffect(() => {
    const follower = followerRef.current;
    const cursor = cursorRef.current;
    if (!follower || !cursor) return;

    switch (cursorMode) {
      case 'hover':
        gsap.to(follower, {
          scale: 1.8,
          backgroundColor: 'rgba(226,129,31,0.1)', // Light accent
          borderColor: 'rgba(226,129,31,0.8)',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        break;
      case 'text':
        gsap.to(follower, {
          scale: 4,
          backgroundColor: '#1C1A17', // Solid ink
          borderColor: 'transparent',
          duration: 0.4,
          ease: 'back.out(1.5)'
        });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        break;
      case 'paw':
        gsap.to(follower, {
          scale: 3.5,
          backgroundColor: '#E2811F', // Solid accent
          borderColor: 'transparent',
          duration: 0.4,
          ease: 'back.out(1.5)'
        });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        break;
      case 'hidden':
        gsap.to([follower, cursor], { scale: 0, opacity: 0, duration: 0.2 });
        break;
      default:
        gsap.to(follower, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(226,129,31,0.6)', // Accent color border
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
        break;
    }
  }, [cursorMode]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[999999]">
      
      {/* Trailing Ring / Morphing Shape */}
      <div 
        ref={followerRef}
        className="absolute top-0 left-0 w-10 h-10 rounded-full border-[2px] flex items-center justify-center overflow-hidden will-change-transform shadow-sm"
        style={{ transformOrigin: 'center' }}
      >
        {/* Custom Text Content inside cursor */}
        <div 
          ref={textRef}
          className={`text-[#F6F1E7] text-[9px] font-bold tracking-[0.15em] uppercase absolute transition-opacity duration-300 ${cursorMode === 'text' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        >
          {cursorText}
        </div>
        
        {/* Paw Icon inside cursor */}
        <PawPrint 
          className={`w-4 h-4 text-[#F6F1E7] absolute transition-all duration-300 ${cursorMode === 'paw' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} 
          strokeWidth={2.5}
        />
      </div>
      
      {/* Core Dot */}
      <div 
        ref={cursorRef}
        className="absolute top-0 left-0 w-2.5 h-2.5 bg-[#E2811F] rounded-full will-change-transform shadow-sm"
        style={{ transformOrigin: 'center' }}
      />
      
    </div>
  );
};
