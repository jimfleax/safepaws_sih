import React from 'react';
import { ScanPhase } from './types';
import { Activity } from 'lucide-react';

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
    <div className="w-full h-full bg-[var(--color-canvas-dark)] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
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

        {/* Tactile Debossed Plinth Card */}
        <div className="relative w-40 h-40 rounded-[2rem] bg-[#161513] border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-[var(--color-marigold)]/10 to-transparent pointer-events-none" />

          {/* Biometric Nose-Print Topology SVG Representation */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-24 h-24 text-[var(--color-bone)] opacity-90 relative z-10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
             {/* Parametric Rhinarium Perimeter */}
             <path 
               d="M50 24 C36 24 25 30 22 42 C19 51 21 63 33 73 C42 81 58 81 67 73 C79 63 81 51 78 42 C75 30 64 24 50 24 Z" 
               stroke="var(--color-bone)" 
               strokeWidth="1.2" 
               strokeOpacity="0.8" 
             />
             {/* Nares Contours */}
             <path d="M36 50 C33 55 37 60 42 57" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
             <path d="M64 50 C67 55 63 60 58 57" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
             <line x1="50" y1="65" x2="50" y2="73" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />

             {/* Biometric Landmark Vertices */}
             <circle cx="50" cy="24" r="2.5" fill="var(--color-marigold)" />
             <circle cx="36" cy="50" r="2" fill="var(--color-marigold)" />
             <circle cx="64" cy="50" r="2" fill="var(--color-marigold)" />
             <circle cx="45" cy="35" r="2" fill="var(--color-marigold)" />
             <circle cx="55" cy="35" r="2" fill="var(--color-marigold)" />
             <circle cx="50" cy="58" r="2" fill="var(--color-marigold)" />
             <circle cx="50" cy="73" r="2" fill="var(--color-marigold)" />

             {/* Triangulation Vector Lines */}
             <line x1="50" y1="24" x2="45" y2="35" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="50" y1="24" x2="55" y2="35" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="45" y1="35" x2="55" y2="35" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="45" y1="35" x2="36" y2="50" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="55" y1="35" x2="64" y2="50" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="36" y1="50" x2="50" y2="58" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="64" y1="50" x2="50" y2="58" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
             <line x1="50" y1="58" x2="50" y2="73" stroke="var(--color-bone)" strokeWidth="0.5" strokeOpacity="0.35" />
          </svg>

          {/* Sweeping High-Precision Scanner Ray (Honors motion-reduce:hidden for a11y) */}
          <div 
            className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[var(--color-marigold)]/[0.2] to-transparent pointer-events-none motion-reduce:hidden animate-scan-ray"
          >
             <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[var(--color-marigold)]/60 shadow-[0_0_12px_var(--color-marigold)]" />
          </div>
        </div>
      </div>
      
      {/* Telemetry Stage Readout */}
      <div className="flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-md">
        <Activity className="w-3.5 h-3.5 text-[var(--color-marigold)] animate-spin" />
        <span className="text-[11px] font-mono tracking-widest text-[var(--color-bone)]/90 uppercase font-semibold">
          {subMessage}
        </span>
      </div>

      {/* Primary Message */}
      <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white text-center mb-1">
        {message}
      </h2>
      
      <p className="text-[var(--color-bone)]/60 text-sm mb-8 font-light">
        Biometric verification
      </p>
      
      {/* Material Progress Rail */}
      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-[var(--color-marigold)] to-[var(--color-bone)] rounded-full transition-all duration-700 ease-out"
          style={{ width: phase === 'ANALYZE' ? '50%' : phase === 'COMPARE' ? '100%' : '15%' }}
        />
      </div>
    </div>
  );
}
