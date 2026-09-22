import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PawPrint } from 'lucide-react';

const POOL_SIZE = 25; // How many footprints can exist on screen before recycling
const FOOTSTEP_DISTANCE = 45; // Pixels between each footprint

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'text' | 'paw' | 'hidden'>('default');

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const container = containerRef.current;
    if (!cursor || !ring || !container) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // QuickTo for the main cursor and ring
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    // Footprint State
    let lastDropPos = { x: -999, y: -999 };
    let stepIsLeft = false;
    let poolIndex = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      xToCursor(mouseX);
      yToCursor(mouseY);
      xToRing(mouseX);
      yToRing(mouseY);

      // Footprint dropping logic
      const dist = Math.hypot(mouseX - lastDropPos.x, mouseY - lastDropPos.y);
      if (dist > FOOTSTEP_DISTANCE) {
        // Calculate angle of movement
        const angle = Math.atan2(mouseY - lastDropPos.y, mouseX - lastDropPos.x);
        
        // Offset perpendicular to movement for alternating left/right paws
        const offsetDist = 12;
        const offsetAngle = angle + (stepIsLeft ? -Math.PI / 2 : Math.PI / 2);
        const pawX = mouseX + Math.cos(offsetAngle) * offsetDist;
        const pawY = mouseY + Math.sin(offsetAngle) * offsetDist;
        
        const paw = trailRefs.current[poolIndex];
        if (paw) {
          gsap.killTweensOf(paw); // Stop current fade if recycled early
          
          // Drop the paw print
          gsap.set(paw, {
            x: pawX,
            y: pawY,
            xPercent: -50,
            yPercent: -50,
            rotation: angle * (180 / Math.PI) + 90, // +90 to point forward
            opacity: 0.6, // Deep brown opacity
            scale: stepIsLeft ? 1 : -1, // Flip the icon horizontally for left/right paws!
            scaleY: 1
          });
          
          // Fade out slowly like disappearing mud
          gsap.to(paw, {
            opacity: 0,
            scaleX: stepIsLeft ? 0.8 : -0.8,
            scaleY: 0.8,
            duration: 2.5,
            ease: "power2.out",
            delay: 0.1 // Tiny delay so it feels "stamped"
          });
        }
        
        lastDropPos = { x: mouseX, y: mouseY };
        stepIsLeft = !stepIsLeft;
        poolIndex = (poolIndex + 1) % POOL_SIZE;
      }
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
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    // Initial position setup
    gsap.set(cursor, { x: mouseX, y: mouseY, xPercent: -50, yPercent: -50 });
    gsap.set(ring, { x: mouseX, y: mouseY, xPercent: -50, yPercent: -50 });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  // Mode animations (Visual states for the core cursor/ring)
  useEffect(() => {
    const ring = ringRef.current;
    const cursor = cursorRef.current;
    if (!ring || !cursor) return;

    switch (cursorMode) {
      case 'hover':
        gsap.to(ring, { scale: 1.5, backgroundColor: 'rgba(226,129,31,0.1)', borderColor: 'rgba(226,129,31,0.8)', duration: 0.3, ease: 'power2.out' });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        break;
      case 'text':
        gsap.to(ring, { scale: 4, backgroundColor: '#1C1A17', borderColor: 'transparent', duration: 0.4, ease: 'back.out(1.5)' });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        break;
      case 'paw':
        gsap.to(ring, { scale: 3.5, backgroundColor: '#E2811F', borderColor: 'transparent', duration: 0.4, ease: 'back.out(1.5)' });
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        break;
      case 'hidden':
        gsap.to([ring, cursor], { scale: 0, opacity: 0, duration: 0.2 });
        break;
      default:
        gsap.to(ring, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(226,129,31,0.6)', duration: 0.3, ease: 'power2.out' });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
        break;
    }
  }, [cursorMode]);

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999999 }}>
      
      {/* 1. Footprint Object Pool (Hidden by default, stamped on move) */}
      {Array.from({ length: POOL_SIZE }).map((_, index) => (
        <div 
          key={index}
          ref={el => trailRefs.current[index] = el}
          className="absolute top-0 left-0 flex items-center justify-center will-change-transform opacity-0 mix-blend-multiply"
        >
          {/* Deep brown muddy paw print */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B2616" stroke="none">
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
