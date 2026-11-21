import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { ScanPhase } from './types';

interface CameraViewProps {
  phase: ScanPhase;
  onCapture: (blob: Blob) => void;
  onAlign: () => void;
}

export default function CameraView({ phase, onCapture, onAlign }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Camera access denied or unavailable. Please provide an image fallback.');
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Intentionally only run once

  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) onCapture(blob);
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="relative w-full h-full bg-[var(--color-ink)] flex flex-col items-center justify-center overflow-hidden touch-none">
      {error ? (
        <div className="text-[var(--color-bone)] w-full h-full flex flex-col justify-center px-6 bg-[var(--color-ink)]">
          <div className="max-w-md w-full mx-auto text-center">
            <p className="mb-6 font-medium text-[var(--color-bone)]/80">Camera access is required to scan.</p>
            <label className="group relative w-full border border-dashed border-[var(--color-bone)]/30 hover:border-[var(--color-bone)]/60 rounded-[1.5rem] p-10 flex flex-col items-center justify-center bg-[var(--color-ink)]/50 transition-colors cursor-pointer shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-bone)]/50 overflow-hidden">
               <Camera className="w-10 h-10 text-[var(--color-bone)]/50 group-hover:text-[var(--color-bone)]/80 mb-4 transition-colors" />
               <span className="text-[var(--color-bone)] text-sm font-medium tracking-wide">Upload a photo instead</span>
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
          {/* Video Feed */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Unified Mask & Guide Overlay */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            onClick={onAlign}
            aria-label="Tap to focus and align"
          >
             <div className="relative w-[85%] max-w-[340px] aspect-square">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible motion-reduce:transition-none transition-all duration-[150ms] ease-out">
                  <defs>
                    <mask id="scan-mask">
                      <rect x="-500%" y="-500%" width="1100%" height="1100%" fill="white" />
                      <path d="M50 25 C20 25, 20 60, 35 75 C45 85, 55 85, 65 75 C80 60, 80 25, 50 25 Z" fill="black" />
                    </mask>
                  </defs>
                  
                  {/* Full-screen dimming overlay */}
                  <rect x="-500%" y="-500%" width="1100%" height="1100%" fill="var(--color-ink)" fillOpacity="0.85" mask="url(#scan-mask)" pointerEvents="none" />
                  
                  {/* Outline guide */}
                  <path 
                    d="M50 25 C20 25, 20 60, 35 75 C45 85, 55 85, 65 75 C80 60, 80 25, 50 25 Z" 
                    fill="none" 
                    stroke="var(--color-bone)" 
                    strokeOpacity={phase === 'ALIGN' ? 1 : 0.4}
                    strokeWidth="0.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="motion-reduce:transition-none transition-opacity duration-[150ms]"
                  />
                  {/* Focusing corners */}
                  <path d="M45 23.5 L55 23.5 M45 76.5 L55 76.5 M24.5 45 L24.5 55 M75.5 45 L75.5 55" stroke="var(--color-bone)" strokeOpacity="0.8" strokeWidth="1" strokeLinecap="round" className={phase === 'ALIGN' ? 'opacity-0' : 'opacity-100 transition-opacity duration-[150ms]'} />
               </svg>
             </div>
          </div>

          {/* One Instruction */}
          <div className="absolute top-24 left-0 right-0 text-center px-4 pointer-events-none">
             <p className="text-[var(--color-bone)] text-[15px] font-sans font-medium tracking-wide bg-[var(--color-ink)]/70 backdrop-blur-md inline-block px-6 py-3 rounded-full border border-[var(--color-bone)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
               {phase === 'ALIGN' ? 'Hold still...' : 'Position nose within the frame'}
             </p>
          </div>

          {/* Capture Control */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-center pb-safe z-10">
             <button 
               onClick={handleCaptureClick}
               className="group relative w-20 h-20 rounded-full bg-transparent flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[var(--color-bone)]/30"
               aria-label="Capture photo"
             >
                <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-bone)] group-active:scale-95 transition-transform duration-[150ms] motion-reduce:transition-none shadow-sm" />
                <div className="w-[62px] h-[62px] rounded-full bg-[var(--color-bone)] group-active:bg-[var(--color-bone)]/80 transition-colors duration-[150ms] motion-reduce:transition-none" />
             </button>
          </div>
        </>
      )}
    </div>
  );
}
