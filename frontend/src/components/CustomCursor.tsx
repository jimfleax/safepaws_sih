import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PawPrint } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'text' | 'paw' | 'hidden'>('default');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (prefersReducedMotion || isTouchOnly) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Use GSAP quickTo for buttery smooth 120fps performance bypassing React render cycle
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      xToCursor(mouseX);
      yToCursor(mouseY);
      xToFollower(mouseX);
      yToFollower(mouseY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

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
    gsap.set(cursor, { x: mouseX, y: mouseY, xPercent: -50, yPercent: -50 });
    gsap.set(follower, { x: mouseX, y: mouseY, xPercent: -50, yPercent: -50 });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []); // Run once on mount

  // Handle mode animations
  useEffect(() => {
    const follower = followerRef.current;
    const cursor = cursorRef.current;
    if (!follower || !cursor) return;

    const tl = gsap.timeline();

    switch (cursorMode) {
      case 'hover':
        tl.to(follower, {
          scale: 2.5,
          backgroundColor: 'transparent',
          borderWidth: '1px',
          borderColor: 'var(--color-accent)',
          opacity: 0.5,
          duration: 0.4,
          ease: 'power3.out'
        }, 0).to(cursor, {
          scale: 0,
          opacity: 0,
          duration: 0.2
        }, 0);
        break;
      case 'text':
        tl.to(follower, {
          scale: 4.5,
          backgroundColor: 'var(--color-ink)',
          borderWidth: '0px',
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.5)'
        }, 0).to(cursor, {
          scale: 0,
          opacity: 0,
          duration: 0.2
        }, 0);
        break;
      case 'paw':
        tl.to(follower, {
          scale: 3.5,
          backgroundColor: 'var(--color-accent)',
          borderWidth: '0px',
          opacity: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        }, 0).to(cursor, {
          scale: 0,
          opacity: 0,
          duration: 0.2
        }, 0);
        break;
      case 'hidden':
        tl.to([follower, cursor], {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 0);
        break;
      default:
        tl.to(follower, {
          scale: 1,
          backgroundColor: 'transparent',
          borderWidth: '2px',
          borderColor: 'var(--color-accent)',
          opacity: 0.8,
          duration: 0.4,
          ease: 'power3.out'
        }, 0).to(cursor, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0);
        break;
    }
  }, [cursorMode]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-[10000] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Glow Filter for Gooey Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: 'url(#gooey)' }} className="absolute inset-0">
        {/* Trailing Ring / Morphing Shape */}
        <div 
          ref={followerRef}
          className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden mix-blend-difference will-change-transform"
          style={{ transformOrigin: 'center' }}
        >
          {/* Custom Text Content inside cursor */}
          <div 
            ref={textRef}
            className={`text-white text-[8px] font-bold tracking-widest uppercase absolute transition-opacity duration-300 ${cursorMode === 'text' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          >
            {cursorText}
          </div>
          
          {/* Paw Icon inside cursor */}
          <PawPrint 
            className={`w-4 h-4 text-white absolute transition-all duration-400 ease-out ${cursorMode === 'paw' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} 
            strokeWidth={2.5}
          />
        </div>
        
        {/* Core Dot */}
        <div 
          ref={cursorRef}
          className="absolute top-0 left-0 w-2.5 h-2.5 bg-[var(--color-accent)] rounded-full mix-blend-difference will-change-transform"
          style={{ transformOrigin: 'center' }}
        />
      </div>
    </div>
  );
};
