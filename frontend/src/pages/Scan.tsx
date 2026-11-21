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
      
      // Priority 0: Treat backend status as authoritative. Never auto-promote single candidate to MATCH.
      if (apiResult.status === 'MATCH' && apiResult.matches && apiResult.matches.length > 0) {
        setResult({
          state: 'MATCH',
          petId: apiResult.matches[0].pet_id,
          petName: apiResult.matches[0].name,
          qrTagId: apiResult.matches[0].qr_tag_id
        });
      } else if (apiResult.status === 'AMBIGUOUS' && apiResult.matches && apiResult.matches.length > 0) {
        setResult({
          state: 'AMBIGUOUS',
          candidates: apiResult.matches.map(m => ({
            pet_id: m.pet_id,
            qr_tag_id: m.qr_tag_id,
            name: m.name,
            breed: m.breed,
            photo_url: m.photo_url
          }))
        });
      } else {
        // UNKNOWN status or empty/missing matches safely defaults to UNKNOWN
        setResult({ state: 'UNKNOWN' });
      }
      setPhase('RESULT');
    } catch (e: any) {
      const status = e.status || e.statusCode;
      const errorCode = (e.errorCode || '').toUpperCase();
      const msg = (e.detail || e.message || '').toLowerCase();

      const isQualityOrInput =
        status === 422 ||
        status === 400 ||
        status === 415 ||
        status === 413 ||
        errorCode === 'INVALID_BBOX_FORMAT' ||
        errorCode === 'BBOX_OUT_OF_BOUNDS' ||
        errorCode === 'BBOX_ZERO_AREA' ||
        errorCode === 'IMAGE_DECODE_FAILURE' ||
        errorCode === 'LOW_QUALITY_IMAGE' ||
        msg.includes('no dog detected') ||
        msg.includes('multiple dogs') ||
        msg.includes('quality') ||
        msg.includes('clear') ||
        msg.includes('blur') ||
        msg.includes('unsupported file type') ||
        msg.includes('file too large');

      if (isQualityOrInput) {
        setResult({ state: 'QUALITY_FAILURE', errorDetails: e.detail || e.message });
      } else {
        setResult({ state: 'SYSTEM_FAILURE', errorDetails: e.detail || e.message });
      }
      setPhase('RESULT');
    }
  };

  const handleConfirmCandidate = (petId: string, qrTagId?: string, petName?: string) => {
    setResult({ state: 'CANDIDATE_SELECTED', petId, qrTagId, petName });
  };

  const resetScan = () => {
    setResult(null);
    setPhase('SCAN');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)] z-50 flex flex-col">
      <div className="w-full h-full relative overflow-hidden" data-cursor="scan">
        
        {/* Close Button */}
        <button 
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/dashboard'}
          className="absolute top-6 right-6 z-50 p-4 rounded-full bg-[var(--color-ink)]/40 text-[var(--color-bone)] backdrop-blur-md border border-[var(--color-bone)]/10 hover:bg-[var(--color-bone)]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)]/50"
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
