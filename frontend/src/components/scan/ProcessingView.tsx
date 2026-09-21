import React from 'react';
import { ScanPhase } from './types';
import { Scan } from 'lucide-react';

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

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 motion-reduce:hidden"></div>
        <div className="relative bg-slate-800 p-6 rounded-full border border-slate-700 shadow-xl">
          <Scan className="w-12 h-12 text-blue-400 animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-white text-center mb-2">
        {message}
      </h2>
      
      {/* Progress representation for reduced motion or fallback */}
      <div className="w-64 h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div 
          className={`h-full bg-blue-500 transition-all duration-500 ease-out ${
            phase === 'ANALYZE' ? 'w-1/2' : phase === 'COMPARE' ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    </div>
  );
}
