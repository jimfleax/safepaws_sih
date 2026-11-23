import React, { useState, useEffect } from 'react';
import CameraView from '../components/scan/CameraView';
import ProcessingView from '../components/scan/ProcessingView';
import ResultView from '../components/scan/ResultView';
import { ScanPhase, ScanResult } from '../components/scan/types';
import { ApiClient } from '../utils/apiClient';
import { X, Fingerprint, RefreshCw } from 'lucide-react';

export default function Scan() {
  const [phase, setPhase] = useState<ScanPhase>('SCAN');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState<string | null>(null);

  // Clean up object URL on unmount or reset
  useEffect(() => {
    return () => {
      if (capturedPreviewUrl) {
        URL.revokeObjectURL(capturedPreviewUrl);
      }
    };
  }, [capturedPreviewUrl]);

  // Direct capture or file fallback upload
  const handleDirectCapture = async (blob: Blob) => {
    await executeIdentification(blob);
  };

  // Review stage initiation
  const handleReview = (blob: Blob, previewUrl: string) => {
    setCapturedBlob(blob);
    setCapturedPreviewUrl(previewUrl);
    setPhase('REVIEW');
  };

  // Confirmation from Review dock
  const handleConfirmReview = async () => {
    if (capturedBlob) {
      await executeIdentification(capturedBlob);
    }
  };

  // Retake from Review dock
  const handleRetake = () => {
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
      setCapturedPreviewUrl(null);
    }
    setCapturedBlob(null);
    setPhase('SCAN');
  };

  // Execution pipeline to ApiClient
  const executeIdentification = async (blob: Blob) => {
    setPhase('ANALYZE');
    
    try {
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' });
      const apiResult = await ApiClient.identifyPet(file);
      
      setPhase('COMPARE');
      
      // Invariant: Treat backend status as authoritative. Never auto-promote single candidate to MATCH.
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
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
      setCapturedPreviewUrl(null);
    }
    setCapturedBlob(null);
    setResult(null);
    setPhase('SCAN');
  };

  return (
    <main id="main-content" tabIndex={-1} className="outline-none fixed inset-0 bg-[var(--color-canvas-dark)] z-50 flex flex-col select-none">
      <div className="w-full h-full relative overflow-hidden" data-cursor="scan">
        
        {/* Spatial Chamber Telemetry Header Tag */}
        <div className="absolute top-6 left-6 z-50 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--color-ink)]/70 text-[var(--color-bone)] backdrop-blur-md border border-white/10 pointer-events-none shadow-lg">
          <Fingerprint className="w-4 h-4 text-[var(--color-marigold)]" />
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--color-bone)]/80">
            SAFEPAWS // BIOMETRIC HUD
          </span>
        </div>

        {/* Accessible Close / Exit Button */}
        <button 
          onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = '/dashboard')}
          className="absolute top-6 right-6 z-50 p-3.5 rounded-full bg-[var(--color-ink)]/70 text-[var(--color-bone)] backdrop-blur-md border border-[var(--color-bone)]/15 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)]/50 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg cursor-pointer"
          aria-label="Close scan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Screen Reader ARIA Live Region */}
        <div aria-live="polite" className="sr-only">
           {phase === 'SCAN' && 'Camera ready. Position nose within the frame.'}
           {phase === 'ALIGN' && 'Hold still for optical calibration.'}
           {phase === 'REVIEW' && 'Photo captured. Review clarity and confirm or retake.'}
           {phase === 'ANALYZE' && 'Reading the nose pattern.'}
           {phase === 'COMPARE' && 'Comparing against registered pets.'}
           {phase === 'RESULT' && result?.state === 'MATCH' && 'Match found.'}
           {phase === 'RESULT' && result?.state === 'AMBIGUOUS' && 'Multiple similar profiles found.'}
           {phase === 'RESULT' && result?.state === 'UNKNOWN' && 'No match found.'}
           {phase === 'RESULT' && result?.state === 'QUALITY_FAILURE' && 'Scan unclear.'}
           {phase === 'RESULT' && result?.state === 'SYSTEM_FAILURE' && 'System unavailable.'}
           {phase === 'RESULT' && result?.state === 'CANDIDATE_SELECTED' && 'Candidate selected by finder.'}
        </div>

        {/* Phase Viewport Router */}
        {(phase === 'SCAN' || phase === 'ALIGN' || phase === 'CAPTURE' || phase === 'REVIEW') && (
          <CameraView 
            phase={phase} 
            onCapture={handleDirectCapture} 
            onAlign={() => setPhase('ALIGN')}
            onReview={handleReview}
            capturedImageUrl={capturedPreviewUrl}
            onRetake={handleRetake}
            onConfirmCapture={handleConfirmReview}
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
    </main>
  );
}
