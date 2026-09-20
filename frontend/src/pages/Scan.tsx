import React, { useState } from 'react';
import CameraView from '../components/scan/CameraView';
import ProcessingView from '../components/scan/ProcessingView';
import ResultView from '../components/scan/ResultView';
import { ScanPhase, ScanResult } from '../components/scan/types';
import { ApiClient } from '../utils/apiClient';

export default function Scan() {
  const [phase, setPhase] = useState<ScanPhase>('SCAN');
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleCapture = async (blob: Blob) => {
    setPhase('ANALYZE');
    
    try {
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' });
      const apiResult = await ApiClient.identifyPet(file);
      
      setPhase('COMPARE');
      
      if (apiResult.matches && apiResult.matches.length > 0) {
        if (apiResult.matches.length === 1 || apiResult.matches[0].confidence >= 0.85) {
           setResult({ state: 'MATCH', petId: apiResult.matches[0].pet_id, qrTagId: apiResult.matches[0].qr_tag_id });
        } else {
           setResult({ state: 'AMBIGUOUS', candidates: apiResult.matches.map((m: any) => m.pet_id) });
        }
      } else {
        setResult({ state: 'UNKNOWN' });
      }
      setPhase('RESULT');
    } catch (e: any) {
      if (e.message && (e.message.toLowerCase().includes('quality') || e.message.toLowerCase().includes('clear'))) {
        setResult({ state: 'QUALITY_FAILURE', errorDetails: e.message });
      } else {
        setResult({ state: 'SYSTEM_FAILURE', errorDetails: e.message });
      }
      setPhase('RESULT');
    }
  };

  const handleConfirmCandidate = (petId: string) => {
    setResult({ state: 'MATCH', petId });
  };

  const resetScan = () => {
    setResult(null);
    setPhase('SCAN');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)] z-50 flex flex-col">
      <div className="w-full h-full relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/dashboard'}
          className="absolute top-6 right-6 z-50 p-4 rounded-full bg-[var(--color-ink)]/40 text-[var(--color-bone)] backdrop-blur-md border border-[var(--color-bone)]/10 hover:bg-[var(--color-bone)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)]"
          aria-label="Close scan"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div aria-live="polite" className="sr-only">
           {phase === 'SCAN' && 'Camera ready. Position nose within the frame.'}
           {phase === 'ALIGN' && 'Hold still.'}
           {phase === 'ANALYZE' && 'Reading the nose pattern.'}
           {phase === 'COMPARE' && 'Comparing against registered pets.'}
           {phase === 'RESULT' && result?.state === 'MATCH' && 'Match found.'}
           {phase === 'RESULT' && result?.state === 'AMBIGUOUS' && 'Multiple similar profiles found.'}
           {phase === 'RESULT' && result?.state === 'UNKNOWN' && 'No match found.'}
           {phase === 'RESULT' && result?.state === 'QUALITY_FAILURE' && 'Scan unclear.'}
           {phase === 'RESULT' && result?.state === 'SYSTEM_FAILURE' && 'System unavailable.'}
        </div>

        {(phase === 'SCAN' || phase === 'ALIGN' || phase === 'CAPTURE') && (
          <CameraView 
            phase={phase} 
            onCapture={handleCapture} 
            onAlign={() => setPhase('ALIGN')} 
          />
        )}
        
        {(phase === 'ANALYZE' || phase === 'COMPARE') && (
          <ProcessingView phase={phase} />
        )}
        
        {phase === 'RESULT' && result && (
          <ResultView 
            result={result} 
            onRetry={resetScan} 
            onConfirmCandidate={handleConfirmCandidate} 
          />
        )}
        
      </div>
    </div>
  );
}
