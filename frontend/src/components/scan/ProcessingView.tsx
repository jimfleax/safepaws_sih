import React from 'react';
import { ScanPhase } from './types';
import { Cpu, Activity } from 'lucide-react';

interface ProcessingViewProps {
  phase: ScanPhase;
}

export default function ProcessingView({ phase }: ProcessingViewProps) {
  let message = '';
  let subMessage = '';
  
  if (phase === 'ANALYZE') {
    message = 'Reading the nose pattern...';
    subMessage = 'PHASE 01 // SURFACE TOPOLOGY EXTRACTION';
  } else if (phase === 'COMPARE') {
    message = 'Comparing against registered pets...';
    subMessage = 'PHASE 02 // HIGH-DIMENSIONAL VECTOR MATCHING';
  } else {
    message = 'Processing...';
    subMessage = 'OPTICAL NORMALIZATION IN PROGRESS';
  }

  return (
    <div className="w-full h-full bg-[var(--color-ink)] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient optical spotlight */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      
      {/* Background optical grid lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40"
      />

      {/* Tactile Biometric Chamber Plinth */}
      <div className="relative mb-10 flex flex-col items-center justify-center">
        {/* Precision Spatial Reticle Marks Around Plinth */}
        <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-[var(--color-bone)]/40" />
        <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-[var(--color-bone)]/40" />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-[var(--color-bone)]/40" />
        <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-[var(--color-bone)]/40" />

        {/* Tactile Plinth Container */}
        <div className="relative w-52 h-52 rounded-[2.5rem] bg-[#161513] shadow-[inset_0_2px_2px_rgba(255,255,255,0.06),0_24px_48px_rgba(0,0,0,0.6)] border border-white/10 flex items-center justify-center overflow-hidden">
          
          {/* Subtle Chamber Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

          {/* Rendered Biometric Nose-print Topology Proxy */}
          <svg viewBox="0 0 100 100" className="w-28 h-28 opacity-50 transition-opacity duration-300">
             {/* Contour base */}
             <path d="M50 20 C20 20, 15 45, 15 60 C15 75, 30 85, 50 85 C70 85, 85 75, 85 60 C85 45, 80 20, 50 20 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-bone)]" />
             {/* Philtrum and nostril contours */}
             <path d="M40 70 C45 75, 55 75, 60 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-bone)]" />
             <path d="M35 55 C40 50, 60 50, 65 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-bone)]" />
             {/* Feature landmark vertices */}
             <circle cx="35" cy="40" r="2" fill="var(--color-marigold)" className="animate-pulse" />
             <circle cx="45" cy="35" r="2" fill="var(--color-marigold)" className="animate-pulse" />
             <circle cx="55" cy="35" r="2" fill="var(--color-marigold)" className="animate-pulse" />
             <circle cx="65" cy="40" r="2" fill="var(--color-marigold)" className="animate-pulse" />
             <circle cx="50" cy="58" r="2.5" fill="var(--color-bone)" />
             {/* Geometric triangulation lines */}
             <line x1="35" y1="40" x2="45" y2="35" stroke="var(--color-marigold)" strokeWidth="0.5" strokeOpacity="0.4" />
             <line x1="45" y1="35" x2="55" y2="35" stroke="var(--color-marigold)" strokeWidth="0.5" strokeOpacity="0.4" />
             <line x1="55" y1="35" x2="65" y2="40" stroke="var(--color-marigold)" strokeWidth="0.5" strokeOpacity="0.4" />
             <line x1="45" y1="35" x2="50" y2="58" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.3" />
             <line x1="55" y1="35" x2="50" y2="58" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>

          {/* Sweeping High-Precision Scanner Ray (Honors motion-reduce:hidden for a11y, off-thread GPU compositor animation) */}
          <div 
            className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[var(--color-bone)]/[0.15] to-transparent pointer-events-none motion-reduce:hidden animate-scan-ray"
          >
             <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[var(--color-bone)]/50 shadow-[0_0_12px_var(--color-bone)]" />
          </div>
        </div>
      </div>
      
      {/* Telemetry Stage Readout */}
      <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
        <Activity className="w-3.5 h-3.5 text-[var(--color-marigold)] animate-spin" />
        <span className="text-[11px] font-mono tracking-widest text-[var(--color-bone)]/80 uppercase">
          {subMessage}
        </span>
      </div>

      {/* Primary Message */}
      <h2 className="text-2xl font-serif font-bold tracking-wide text-white text-center mb-1">
        {message}
      </h2>
      
      <p className="text-[var(--color-bone)]/60 text-sm mb-8 font-light">
        Biometric verification
      </p>
      
      {/* Material Progress Rail */}
      <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-[var(--color-marigold)] to-[var(--color-bone)] rounded-full transition-all duration-700 ease-out"
          style={{ width: phase === 'ANALYZE' ? '50%' : phase === 'COMPARE' ? '100%' : '15%' }}
        />
      </div>
    </div>
  );
}