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
    <div className="relative w-full h-full bg-background-crisis flex flex-col items-center justify-center overflow-hidden touch-none">
      {error ? (
        <div className="text-white text-center p-4">
          <p className="mb-4 font-medium text-bone">{error}</p>
          <div className="w-full max-w-sm mx-auto border border-dashed border-accent/50 rounded-[2rem] p-8 flex flex-col items-center justify-center bg-ink shadow-sm">
             <Camera className="w-12 h-12 text-accent/60 mb-3" />
             <span className="text-bone/90 text-sm font-medium">Tap to select photo fallback</span>
             <input 
               type="file" 
               accept="image/*" 
               className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
               onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) onCapture(file);
               }}
             />
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
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_12px_var(--color-marigold)] motion-reduce:transition-none transition-all duration-500">
                  <defs>
                    <mask id="scan-mask">
                      <rect x="-500%" y="-500%" width="1100%" height="1100%" fill="white" />
                      <path d="M50 25 C20 25, 20 60, 35 75 C45 85, 55 85, 65 75 C80 60, 80 25, 50 25 Z" fill="black" />
                    </mask>
                  </defs>
                  
                  {/* Full-screen dimming overlay */}
                  <rect x="-500%" y="-500%" width="1100%" height="1100%" fill="var(--color-background-crisis)" fillOpacity="0.85" mask="url(#scan-mask)" pointerEvents="none" />
                  
                  {/* Outline guide */}
                  <path 
                    d="M50 25 C20 25, 20 60, 35 75 C45 85, 55 85, 65 75 C80 60, 80 25, 50 25 Z" 
                    fill="none" 
                    stroke={phase === 'ALIGN' ? 'var(--color-marigold)' : 'rgba(255, 255, 255, 0.4)'} 
                    strokeWidth="0.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="motion-reduce:transition-none transition-colors duration-300"
                  />
                  {/* Focusing corners */}
                  <path d="M45 23.5 L55 23.5 M45 76.5 L55 76.5 M24.5 45 L24.5 55 M75.5 45 L75.5 55" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1" strokeLinecap="round" className={phase === 'ALIGN' ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'} />
               </svg>
             </div>
          </div>

          {/* One Instruction */}
          <div className="absolute top-16 left-0 right-0 text-center px-4 pointer-events-none">
             <p className="text-white text-base font-semibold tracking-wide bg-ink/60 backdrop-blur-md inline-block px-6 py-2.5 rounded-full border border-white/10 shadow-lg">
               {phase === 'ALIGN' ? 'Hold still...' : 'Position nose within the frame'}
             </p>
          </div>

          {/* Capture Control */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center pb-safe">
             <button 
               onClick={handleCaptureClick}
               className="group relative w-20 h-20 rounded-full bg-transparent flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-accent/50"
               aria-label="Capture photo"
             >
                <div className="absolute inset-0 rounded-full border-[3px] border-white/80 group-active:scale-95 transition-transform motion-reduce:transition-none" />
                <div className="w-[60px] h-[60px] rounded-full bg-white group-active:bg-accent transition-colors duration-200 motion-reduce:transition-none" />
             </button>
          </div>
        </>
      )}
    </div>
  );
}
