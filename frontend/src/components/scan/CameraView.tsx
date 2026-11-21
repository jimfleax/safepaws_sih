import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Radio, Sparkles } from 'lucide-react';
import { ScanPhase } from './types';

interface CameraViewProps {
  phase: ScanPhase;
  onCapture: (blob: Blob) => void;
  onAlign: () => void;
}

export default function CameraView({ phase, onCapture, onAlign }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { ideal: 'environment' } } 
        });
        
        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsCameraActive(true);
      } catch (err) {
        if (mounted) {
          setError('Camera access denied or unavailable. Please provide an image fallback.');
        }
      }
    }

    startCamera();

    // Deterministic hardware teardown: stop all video tracks on unmount
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) onCapture(blob);
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="relative w-full h-full bg-[var(--color-ink)] flex flex-col items-center justify-center overflow-hidden touch-none select-none">
      {error ? (
        <div className="text-[var(--color-bone)] w-full h-full flex flex-col justify-center px-6 bg-[var(--color-ink)]">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/30 text-[var(--color-alert-clay)] flex items-center justify-center mx-auto mb-6">
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-2">Camera Feed Offline</h2>
            <p className="mb-6 font-medium text-[var(--color-bone)]/80 text-sm">Camera access is required to scan.</p>
            <label className="group relative w-full border border-dashed border-[var(--color-bone)]/30 hover:border-[var(--color-bone)]/60 rounded-[1.5rem] p-10 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-bone)]/50 overflow-hidden">
               <Camera className="w-10 h-10 text-[var(--color-bone)]/50 group-hover:text-[var(--color-bone)]/90 mb-4 transition-colors" />
               <span className="text-[var(--color-bone)] text-sm font-semibold tracking-wide">Upload a photo instead</span>
               <span className="text-xs text-[var(--color-bone)]/50 mt-1">High-resolution JPEG or PNG recommended</span>
               <input 
                 type="file" 
                 accept="image/*" 
                 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) onCapture(file);
                 }}
               />
            </label>
          </div>
        </div>
      ) : (
        <>
          {/* Live Optical Video Feed */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

          {/* Spatial Chamber Subtle Vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />

          {/* Precision Reticle HUD & Guide Overlay */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            onClick={onAlign}
            aria-label="Tap to focus and align"
          >
             <div className="relative w-[85%] max-w-[340px] aspect-square flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible motion-reduce:transition-none transition-all duration-200 ease-out">
                  <defs>
                    <mask id="scan-mask">
                      <rect x="-500%" y="-500%" width="1100%" height="1100%" fill="white" />
                      <path d="M50 25 C20 25, 20 60, 35 75 C45 85, 55 85, 65 75 C80 60, 80 25, 50 25 Z" fill="black" />
                    </mask>
                  </defs>
                  
                  {/* Full-screen dimming overlay outside reticle */}
                  <rect 
                    x="-500%" 
                    y="-500%" 
                    width="1100%" 
                    height="1100%" 
                    fill="var(--color-ink)" 
                    fillOpacity="0.82" 
                    mask="url(#scan-mask)" 
                    pointerEvents="none" 
                  />
                  
                  {/* Precision Optical Contours */}
                  <path 
                    d="M50 25 C20 25, 20 60, 35 75 C45 85, 55 85, 65 75 C80 60, 80 25, 50 25 Z" 
                    fill="none" 
                    stroke="var(--color-bone)" 
                    strokeOpacity={phase === 'ALIGN' ? 1 : 0.45}
                    strokeWidth="0.9" 
                    strokeDasharray={phase === 'ALIGN' ? 'none' : '2 2'}
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="motion-reduce:transition-none transition-opacity duration-200"
                  />
                  
                  {/* Spatial Framing Brackets */}
                  <path d="M45 23.5 L55 23.5 M45 76.5 L55 76.5 M24.5 45 L24.5 55 M75.5 45 L75.5 55" stroke="var(--color-bone)" strokeOpacity="0.85" strokeWidth="1.2" strokeLinecap="round" className={phase === 'ALIGN' ? 'opacity-0' : 'opacity-100 transition-opacity duration-150'} />
                  
                  {/* Reticle Corner Marks */}
                  <path d="M26 28 L20 28 L20 34" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
                  <path d="M74 28 L80 28 L80 34" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
                  <path d="M26 72 L20 72 L20 66" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
                  <path d="M74 72 L80 72 L80 66" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
               </svg>

               {/* Central Focus Ring Pulse (Visual feedback on ALIGN) */}
               {phase === 'ALIGN' && (
                 <div className="absolute inset-0 border border-[var(--color-marigold)]/40 rounded-full animate-ping pointer-events-none motion-reduce:hidden" />
               )}
             </div>
          </div>

          {/* Spatial Telemetry & Guidance Header */}
          <div className="absolute top-20 left-0 right-0 flex flex-col items-center justify-center px-4 pointer-events-none gap-2 z-20">
             {/* Telemetry Status Pill */}
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest text-[var(--color-bone)]/70 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>CHAMBER OPTICAL SENSOR // ACTIVE</span>
             </div>

             {/* Dynamic Guidance Pill */}
             <div className="text-center">
                <p className="text-[var(--color-bone)] text-[15px] font-sans font-medium tracking-wide bg-[var(--color-ink)]/80 backdrop-blur-md inline-block px-6 py-2.5 rounded-full border border-[var(--color-bone)]/15 shadow-xl">
                  {phase === 'ALIGN' ? 'Hold still...' : 'Position nose within the frame'}
                </p>
             </div>
          </div>

          {/* Shutter Capture Control */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center pb-safe z-30 pointer-events-auto">
             <button 
               onClick={handleCaptureClick}
               className="group relative w-20 h-20 rounded-full bg-transparent flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[var(--color-bone)]/40 min-h-[44px] min-w-[44px]"
               aria-label="Capture photo"
             >
                <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-bone)] group-active:scale-95 transition-transform duration-150 motion-reduce:transition-none shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
                <div className="w-[62px] h-[62px] rounded-full bg-[var(--color-bone)] group-active:bg-[var(--color-bone)]/80 transition-colors duration-150 motion-reduce:transition-none" />
             </button>
             <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-bone)]/60 mt-3">
               TAP SHUTTER TO IDENTIFY
             </span>
          </div>
        </>
      )}
    </div>
  );
}