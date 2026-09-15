import React from 'react';
import { ScanPhase, ScanResult, ScanResultState } from './types';

interface MockBackendControllerProps {
  phase: ScanPhase;
  onAdvancePhase: (phase: ScanPhase) => void;
  onResolveResult: (result: ScanResult) => void;
  onReset: () => void;
}

export default function MockBackendController({
  phase,
  onAdvancePhase,
  onResolveResult,
  onReset
}: MockBackendControllerProps) {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-xs flex flex-wrap gap-2 z-50 justify-center">
      <div className="w-full text-center mb-1 text-gray-400">Dev Controls (No fake timers used)</div>
      {phase === 'SCAN' && (
        <button onClick={() => onAdvancePhase('ALIGN')} className="bg-blue-600 px-2 py-1 rounded">Simulate Align</button>
      )}
      {phase === 'ALIGN' && (
        <button onClick={() => onAdvancePhase('CAPTURE')} className="bg-blue-600 px-2 py-1 rounded">Simulate Capture Click</button>
      )}
      {phase === 'CAPTURE' && (
        <button onClick={() => onAdvancePhase('ANALYZE')} className="bg-yellow-600 px-2 py-1 rounded">Backend: Start Analyze</button>
      )}
      {phase === 'ANALYZE' && (
        <button onClick={() => onAdvancePhase('COMPARE')} className="bg-yellow-600 px-2 py-1 rounded">Backend: Start Compare</button>
      )}
      {phase === 'COMPARE' && (
        <>
          <button onClick={() => onResolveResult({ state: 'MATCH', petId: 'pet-olive' })} className="bg-green-600 px-2 py-1 rounded">MATCH</button>
          <button onClick={() => onResolveResult({ state: 'AMBIGUOUS', candidates: ['pet-olive', 'pet-shadow'] })} className="bg-orange-600 px-2 py-1 rounded">AMBIGUOUS</button>
          <button onClick={() => onResolveResult({ state: 'UNKNOWN' })} className="bg-gray-600 px-2 py-1 rounded">UNKNOWN</button>
          <button onClick={() => onResolveResult({ state: 'QUALITY_FAILURE', errorDetails: 'Blurry image' })} className="bg-red-600 px-2 py-1 rounded">QUALITY FAIL</button>
          <button onClick={() => onResolveResult({ state: 'SYSTEM_FAILURE', errorDetails: '503 Service Unavailable' })} className="bg-red-800 px-2 py-1 rounded">SYS FAIL</button>
        </>
      )}
      {phase === 'RESULT' && (
        <button onClick={onReset} className="bg-gray-700 px-2 py-1 rounded">Reset</button>
      )}
    </div>
  );
}
