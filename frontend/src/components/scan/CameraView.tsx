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
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {error ? (
        <div className="text-white text-center p-4">
          <p className="mb-4">{error}</p>
          <div className="w-full max-w-sm mx-auto border-2 border-dashed border-gray-500 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-900">
             <Camera className="w-12 h-12 text-gray-400 mb-2" />
             <span className="text-gray-400 text-sm">Upload Photo (Fallback)</span>
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
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Single organic nose-derived scan frame overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
             <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                <path d="M140 40C80 40 40 90 40 150C40 210 90 240 140 240C190 240 240 210 240 150C240 90 200 40 140 40Z" stroke="white" strokeWidth="3" strokeDasharray="8 8" />
                <path d="M140 160C120 160 100 180 110 210C120 220 160 220 170 210C180 180 160 160 140 160Z" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
             </svg>
          </div>

          {/* One instruction */}
          <div className="absolute top-16 left-0 right-0 text-center px-4">
             <p className="text-white text-lg font-medium drop-shadow-md bg-black/30 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
               Position nose within the frame
             </p>
          </div>

          {/* One capture control */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center">
             <button 
               onClick={handleCaptureClick}
               className="w-20 h-20 rounded-full border-4 border-white bg-white/30 flex items-center justify-center active:bg-white/60 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
               aria-label="Capture photo"
             >
                <div className="w-16 h-16 rounded-full bg-white"></div>
             </button>
          </div>
        </>
      )}
    </div>
  );
}
