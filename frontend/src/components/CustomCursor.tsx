import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PawPrint } from 'lucide-react';

const TRAIL_LENGTH = 6;

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'text' | 'paw' | 'hidden'>('default');

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const container = containerRef.current;
    if (!cursor || !ring || !container) return;

    // Fluid Physics State
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trailPositions = Array(TRAIL_LENGTH).fill(0).map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Ultra-premium frame-by-frame physics loop
    const ticker = gsap.ticker.add(() => {
      // 1. Core Dot follows instantly
      gsap.set(cursor, { x: mouse.x, y: mouse.y, xPercent: -50, yPercent: -50 });
      
      // 2. Ring follows with elastic delay
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y, xPercent: -50, yPercent: -50 });

      // 3. Trail follows organically (snake physics)
      let leader = mouse;
      trailRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const currentPos = trailPositions[index];
        // Calculate physics: followers drag behind the leader
        const speed = 0.35 - (index * 0.04); // Each successive follower is slightly slower/looser
        currentPos.x += (leader.x - currentPos.x) * speed;
        currentPos.y += (leader.y - currentPos.y) * speed;
        
        // Calculate rotation based on movement direction for dynamic angling
        const dx = leader.x - currentPos.x;
        const dy = leader.y - currentPos.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Only apply rotation if moving significantly
        const rotation = Math.sqrt(dx*dx + dy*dy) > 2 ? angle + 90 : gsap.getProperty(ref, "rotation");

        gsap.set(ref, { 
          x: currentPos.x, 
          y: currentPos.y, 
          xPercent: -50, 
          yPercent: -50,
          rotation: rotation
        });
        
        leader = currentPos;
      });
    });

    // Hover logic
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

    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
      gsap.ticker.remove(ticker);
    };
  }, []);

  // Mode animations (Visual states)
  useEffect(() => {
    const ring = ringRef.current;
    const cursor = cursorRef.current;
    if (!ring || !cursor) return;

    switch (cursorMode) {
      case 'hover':
        gsap.to(ring, { scale: 1.5, backgroundColor: 'rgba(226,129,31,0.1)', borderColor: 'rgba(226,129,31,0.8)', duration: 0.3, ease: 'power2.out' });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        // Collapse trail into the ring
        trailRefs.current.forEach((ref) => gsap.to(ref, { scale: 0, opacity: 0, duration: 0.3 }));
        break;
      case 'text':
        gsap.to(ring, { scale: 4, backgroundColor: '#1C1A17', borderColor: 'transparent', duration: 0.4, ease: 'back.out(1.5)' });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        trailRefs.current.forEach((ref) => gsap.to(ref, { scale: 0, opacity: 0, duration: 0.3 }));
        break;
      case 'paw':
        gsap.to(ring, { scale: 3.5, backgroundColor: '#E2811F', borderColor: 'transparent', duration: 0.4, ease: 'back.out(1.5)' });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        trailRefs.current.forEach((ref) => gsap.to(ref, { scale: 0, opacity: 0, duration: 0.3 }));
        break;
      case 'hidden':
        gsap.to([ring, cursor], { scale: 0, opacity: 0, duration: 0.2 });
        trailRefs.current.forEach((ref) => gsap.to(ref, { scale: 0, opacity: 0, duration: 0.2 }));
        break;
      default:
        gsap.to(ring, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(226,129,31,0.6)', duration: 0.3, ease: 'power2.out' });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
        // Restore trail
        trailRefs.current.forEach((ref, i) => gsap.to(ref, { scale: 1 - (i * 0.1), opacity: 0.8 - (i * 0.15), duration: 0.4 }));
        break;
    }
  }, [cursorMode]);

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999999 }}>
      
      {/* 1. The Organic Claw/Paw Trail */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, index) => (
        <div 
          key={index}
          ref={el => trailRefs.current[index] = el}
          className="absolute top-0 left-0 flex items-center justify-center will-change-transform drop-shadow-md"
          style={{ 
            opacity: 0.8 - (index * 0.15),
            transform: `scale(${1 - (index * 0.1)})`
          }}
        >
          {/* Custom Claw-like Paw SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E2811F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21a6.5 6.5 0 0 1-6-4.5c-.5-1.5-.5-3 .5-4.5s2.5-2 4-2 2.5.5 3 2c1 1.5 1 3 .5 4.5a6.5 6.5 0 0 1-5.5 4.5z"/>
            <path d="M7 8s-1.5-2-1.5-4c0-1.5 1-2.5 2.5-2.5s2.5 1.5 2.5 3c0 2-1.5 3.5-1.5 3.5"/>
            <path d="M17 8s1.5-2 1.5-4c0-1.5-1-2.5-2.5-2.5s-2.5 1.5-2.5 3c0 2 1.5 3.5 1.5 3.5"/>
            <path d="M3 12s-2-1.5-2-3c0-1.5 1-2.5 2.5-2.5s2.5 1.5 2.5 3c0 2-1 3.5-1 3.5"/>
            <path d="M21 12s2-1.5 2-3c0-1.5-1-2.5-2.5-2.5s-2.5 1.5-2.5 3c0 2 1 3.5 1 3.5"/>
          </svg>
        </div>
      ))}

      {/* 2. Trailing Outer Ring / Hover Morph Shape */}
      <div 
        ref={ringRef}
        className="absolute top-0 left-0 w-10 h-10 rounded-full border-[2px] flex items-center justify-center overflow-hidden will-change-transform shadow-sm"
      >
        <div 
          ref={textRef}
          className={`text-[#F6F1E7] text-[9px] font-bold tracking-[0.15em] uppercase absolute transition-opacity duration-300 ${cursorMode === 'text' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        >
          {cursorText}
        </div>
        <PawPrint 
          className={`w-4 h-4 text-[#F6F1E7] absolute transition-all duration-300 ${cursorMode === 'paw' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} 
          strokeWidth={2.5}
        />
      </div>
      
      {/* 3. Core Instant Dot */}
      <div 
        ref={cursorRef}
        className="absolute top-0 left-0 w-2.5 h-2.5 bg-[#E2811F] rounded-full will-change-transform shadow-sm"
      />
      
    </div>
  );
};
