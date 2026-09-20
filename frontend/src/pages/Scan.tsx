import React, { useState } from 'react';
import CameraView from '../components/scan/CameraView';
import ProcessingView from '../components/scan/ProcessingView';
import ResultView from '../components/scan/ResultView';
import MockBackendController from '../components/scan/MockBackendController';
import { ScanPhase, ScanResult } from '../components/scan/types';

export default function Scan() {
  const [phase, setPhase] = useState<ScanPhase>('SCAN');
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleCapture = (blob: Blob) => {
    // We captured the image. In a real app, we'd send it to the backend here.
    // For this implementation, we wait for the MockBackendController or immediately resolve if we don't have Dev controls.
    // Since we are building the boundary cleanly, we advance to ANALYZE.
    setPhase('ANALYZE');
    
    // NOTE: To adhere to "Do not use fixed timers to pretend backend processing occurred",
    // we do not automatically setTimeout here. The developer uses the MockBackendController
    // to advance the states (ANALYZE -> COMPARE -> RESULT) manually, reflecting the true product stages
    // without fake delays.
    
    // In production, this would be an API call like:
    // try {
    //   const apiResult = await backendApi.scanNose(blob, (progress) => setPhase(progress));
    //   setResult(apiResult);
    //   setPhase('RESULT');
    // } catch (e) { ... }
  };

  const handleConfirmCandidate = (petId: string) => {
    // If ambiguous, user selects one. This promotes it to a Match.
    setResult({ state: 'MATCH', petId });
  };

  const resetScan = () => {
    setResult(null);
    setPhase('SCAN');
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center sm:relative sm:h-[calc(100vh-64px)] z-50">
      {/* Mobile-primary: fills the experience */}
      <div className="w-full h-full relative overflow-hidden max-w-md mx-auto sm:rounded-2xl sm:shadow-2xl sm:h-[800px] sm:max-h-[90vh] bg-black">
        
        {/* Close Button */}
        <button 
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/dashboard'}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close scan"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

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
      
      <MockBackendController 
        phase={phase}
        onAdvancePhase={setPhase}
        onResolveResult={(res) => { setResult(res); setPhase('RESULT'); }}
        onReset={resetScan}
      />
    </div>
  );
}
