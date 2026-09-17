import React, { useEffect, useState } from 'react';
import { ScanPhase } from './types';

interface ProcessingViewProps {
  phase: ScanPhase;
}

export default function ProcessingView({ phase }: ProcessingViewProps) {
  let message = '';
  
  if (phase === 'ANALYZE') {
    message = 'Reading the nose pattern...';
  } else if (phase === 'COMPARE') {
    message = 'Comparing against registered pets...';
  } else {
    message = 'Processing...';
  }

  // Use local state for the scanning line to avoid needing tailwind custom keyframes
  const [scanPos, setScanPos] = useState(0);
  const [scanDir, setScanDir] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => {
        if (prev >= 100) {
          setScanDir(-1);
          return 99;
        }
        if (prev <= 0) {
          setScanDir(1);
          return 1;
        }
        return prev + (scanDir * 2);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [scanDir]);

  return (
    <div className="w-full h-full bg-[#111111] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft spotlight from top (light/depth) */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

      <div className="relative mb-12 flex flex-col items-center justify-center">
        {/* Dark physical material surface / plinth */}
        <div className="relative w-48 h-48 rounded-[2rem] bg-[#1a1a1a] shadow-[inset_0_2px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.4)] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
          
          {/* Rendered Nose-print proxy - using an organic SVG path instead of lucide Fingerprint for authenticity */}
          <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-40">
             <path d="M50 20 C20 20, 15 45, 15 60 C15 75, 30 85, 50 85 C70 85, 85 75, 85 60 C85 45, 80 20, 50 20 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" />
             <path d="M40 70 C45 75, 55 75, 60 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" />
             <path d="M35 55 C40 50, 60 50, 65 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" />
             {/* Small dots for nose texture */}
             <circle cx="35" cy="40" r="1.5" fill="currentColor" className="text-white" />
             <circle cx="45" cy="35" r="1.5" fill="currentColor" className="text-white" />
             <circle cx="55" cy="35" r="1.5" fill="currentColor" className="text-white" />
             <circle cx="65" cy="40" r="1.5" fill="currentColor" className="text-white" />
          </svg>

          {/* Controlled premium motion: soft sweeping scanner line */}
          <div 
            className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent pointer-events-none motion-reduce:hidden"
            style={{ top: `${scanPos}%`, transform: 'translateY(-50%)' }}
          >
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-medium tracking-wide text-gray-200 text-center mb-2">
        {message}
      </h2>
      
      <p className="text-gray-500 text-sm mb-10 font-light">
        Biometric verification
      </p>
      
      {/* Subtle Material Progress Bar */}
      <div className="w-48 h-1 bg-[#222] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
        <div 
          className="h-full bg-gray-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: phase === 'ANALYZE' ? '50%' : phase === 'COMPARE' ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}
