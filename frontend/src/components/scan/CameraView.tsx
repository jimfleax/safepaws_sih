import React, { useEffect, useRef, useState } from 'react';
import { 
  Camera, 
  RefreshCw, 
  Zap, 
  ZapOff, 
  Check, 
  RotateCcw, 
  Upload, 
  ShieldAlert, 
  AlertCircle,
  HelpCircle,
  Eye
} from 'lucide-react';
import { ScanPhase, CameraLifecycleState } from './types';

interface CameraViewProps {
  phase: ScanPhase;
  onCapture: (blob: Blob) => void;
  onAlign: () => void;
  onReview?: (blob: Blob, previewUrl: string) => void;
  capturedImageUrl?: string | null;
  onRetake?: () => void;
  onConfirmCapture?: () => void;
}

export default function CameraView({ 
  phase, 
  onCapture, 
  onAlign,
  onReview,
  capturedImageUrl,
  onRetake,
  onConfirmCapture
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [lifecycleState, setLifecycleState] = useState<CameraLifecycleState>('INITIALIZING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const [isTorchSupported, setIsTorchSupported] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isCapturingBloom, setIsCapturingBloom] = useState<boolean>(false);
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(null);
  const [internalBlob, setInternalBlob] = useState<Blob | null>(null);

  // 1. Device Enumeration & Stream Lifecycle Management
  useEffect(() => {
    let mounted = true;
    let localStream: MediaStream | null = null;

    async function initCamera() {
      setLifecycleState('INITIALIZING');
      setErrorMessage(null);

      // Check browser MediaDevices support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (mounted) {
          setLifecycleState('UNAVAILABLE');
          setErrorMessage('Your browser or device does not support direct optical camera streaming.');
        }
        return;
      }

      // Enumerate video devices where supported
      try {
        if (navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          if (mounted) setVideoDevices(videoInputs);
        }
      } catch (e) {
        // Non-fatal device enumeration error
      }

      // Determine constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      // If specific device selected
      if (videoDevices.length > 0 && videoDevices[selectedDeviceIndex]?.deviceId) {
        (constraints.video as MediaTrackConstraints).deviceId = { 
          exact: videoDevices[selectedDeviceIndex].deviceId 
        };
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Async race guard: user navigated away or unmounted while permission dialog was active
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Probe torch capability on active video track
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack && typeof (videoTrack as any).getCapabilities === 'function') {
          const capabilities = (videoTrack as any).getCapabilities();
          if (capabilities && 'torch' in capabilities) {
            setIsTorchSupported(true);
          }
        }

        setLifecycleState('READY');
      } catch (err: any) {
        if (!mounted) return;

        const errName = err.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setLifecycleState('PERMISSION_DENIED');
          setErrorMessage('Camera access was declined. You can enable camera permissions in your browser or upload an image file.');
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setLifecycleState('UNAVAILABLE');
          setErrorMessage('No optical camera sensor was detected on this device.');
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setLifecycleState('UNAVAILABLE');
          setErrorMessage('Camera hardware is currently in use by another application.');
        } else {
          setLifecycleState('ERROR');
          setErrorMessage(err.message || 'Unable to establish optical camera stream.');
        }
      }
    }

    initCamera();

    // Deterministic Hardware Teardown Invariant
    return () => {
      mounted = false;
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [selectedDeviceIndex]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (internalPreviewUrl) {
        URL.revokeObjectURL(internalPreviewUrl);
      }
    };
  }, [internalPreviewUrl]);

  // 2. Camera Device Switching
  const handleSwitchCamera = () => {
    if (videoDevices.length <= 1) return;
    // Teardown existing stream before acquiring next device
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setSelectedDeviceIndex(prev => (prev + 1) % videoDevices.length);
  };

  // 3. Torch / Flashlight Toggle
  const handleToggleTorch = async () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (!videoTrack || !isTorchSupported) return;

    try {
      const nextTorch = !isTorchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      // Hardware constraint failed
    }
  };

  // 4. Shutter Frame Capture
  const handleShutterClick = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 60ms Optical bloom flash
    setIsCapturingBloom(true);
    setTimeout(() => setIsCapturingBloom(false), 80);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const previewUrl = URL.createObjectURL(blob);
      setInternalBlob(blob);
      setInternalPreviewUrl(previewUrl);

      if (onReview) {
        onReview(blob, previewUrl);
      } else {
        // Direct capture fallback if onReview not wired
        onCapture(blob);
      }
    }, 'image/jpeg', 0.92);
  };

  // 5. Review Confirm / Retake Handlers
  const handleConfirm = () => {
    if (onConfirmCapture) {
      onConfirmCapture();
    } else if (internalBlob) {
      onCapture(internalBlob);
    }
  };

  const handleRetake = () => {
    if (internalPreviewUrl) {
      URL.revokeObjectURL(internalPreviewUrl);
      setInternalPreviewUrl(null);
    }
    setInternalBlob(null);
    if (onRetake) {
      onRetake();
    }
  };

  const activePreview = capturedImageUrl || internalPreviewUrl;
  const isReviewing = phase === 'REVIEW' && !!activePreview;

  // Render: Camera Hardware Denied or Unavailable State
  if (lifecycleState === 'PERMISSION_DENIED' || lifecycleState === 'UNAVAILABLE' || lifecycleState === 'ERROR') {
    const isDenied = lifecycleState === 'PERMISSION_DENIED';
    return (
      <div className="text-[var(--color-bone)] w-full h-full flex flex-col justify-center px-6 bg-[var(--color-canvas-dark)]">
        <div className="max-w-md w-full mx-auto text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/30 text-[var(--color-alert-clay)] flex items-center justify-center mx-auto mb-6 shadow-xl">
            {isDenied ? <ShieldAlert className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-alert-clay)]/15 border border-[var(--color-alert-clay)]/30 text-[var(--color-alert-clay)] text-xs font-mono uppercase tracking-wider mb-3">
            <span>{isDenied ? 'PERMISSION RESTRICTED' : 'HARDWARE UNAVAILABLE'}</span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">
            {isDenied ? 'Camera Access Required' : 'Optical Sensor Offline'}
          </h2>

          <p className="mb-6 font-light text-[var(--color-bone)]/80 text-sm leading-relaxed">
            {errorMessage || 'Camera access is required to capture the canine rhinarium pattern.'}
          </p>

          {isDenied && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-left text-xs text-[var(--color-bone)]/70 mb-6">
              <span className="font-semibold text-white block mb-1">To enable camera access:</span>
              <p>Tap the lock or permissions icon next to the URL in your browser address bar and switch Camera to &ldquo;Allow&rdquo;, then reload this page.</p>
            </div>
          )}

          {/* Primary File Upload Fallback */}
          <label className="group relative w-full border border-dashed border-[var(--color-bone)]/30 hover:border-[var(--color-bone)]/60 rounded-[1.5rem] p-8 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-bone)]/50 overflow-hidden min-h-[140px]">
            <Upload className="w-8 h-8 text-[var(--color-marigold)] mb-3 group-hover:scale-105 transition-transform" />
            <span className="text-[var(--color-bone)] text-sm font-semibold tracking-wide">
              Upload Canine Photo Instead
            </span>
            <span className="text-xs text-[var(--color-bone)]/50 mt-1">
              Select clear, forward-facing photo (JPEG/PNG)
            </span>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onCapture(file);
              }}
              aria-label="Upload canine photo file fallback"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[var(--color-canvas-dark)] flex flex-col items-center justify-center overflow-hidden touch-none select-none">
      {/* 1. Live Optical Video Stream or Frozen Review Frame */}
      {isReviewing ? (
        <img 
          src={activePreview!} 
          alt="Captured canine nose leather frame for review"
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-200"
        />
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Optical Capture Bloom Flash Overlay */}
      {isCapturingBloom && (
        <div className="absolute inset-0 bg-white/80 z-40 animate-out fade-out duration-100 pointer-events-none" />
      )}

      {/* Layered Atelier Vignette & Spatial Atmosphere */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/75 pointer-events-none" />

      {/* 2. Top Viewfinder Auxiliary Controls (Camera Switch, Torch) */}
      {!isReviewing && (
        <div className="absolute top-6 right-20 z-30 flex items-center gap-2">
          {/* Torch / Flashlight Toggle (Only if hardware supported) */}
          {isTorchSupported && (
            <button
              type="button"
              onClick={handleToggleTorch}
              className={`p-3 rounded-full backdrop-blur-md border transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg ${
                isTorchOn 
                  ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] border-[var(--color-marigold)]' 
                  : 'bg-[var(--color-ink)]/70 text-[var(--color-bone)] border-white/15 hover:bg-white/10'
              }`}
              aria-label={isTorchOn ? "Turn off optical flashlight" : "Turn on optical flashlight"}
            >
              {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </button>
          )}

          {/* Camera Lens Switcher (Only if multi-camera enumerated) */}
          {videoDevices.length > 1 && (
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="p-3 rounded-full bg-[var(--color-ink)]/70 text-[var(--color-bone)] backdrop-blur-md border border-white/15 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
              aria-label="Switch camera device"
              title={`Using camera ${selectedDeviceIndex + 1} of ${videoDevices.length}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 3. Parametric Canine Rhinarium SVG Reticle & Calibration Ticks */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto ${isReviewing ? 'pointer-events-none' : ''}`}
        onClick={!isReviewing ? onAlign : undefined}
        aria-label="Tap to focus and calibrate reticle"
      >
        <div className="relative w-[85%] max-w-[340px] aspect-square flex items-center justify-center">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full overflow-visible motion-reduce:transition-none transition-all duration-200 ease-out"
            aria-hidden="true"
          >
            <defs>
              <mask id="atelier-scan-mask">
                <rect x="-500%" y="-500%" width="1100%" height="1100%" fill="white" />
                {/* Parametric Canine Rhinarium Anatomical Mask */}
                <path 
                  d="M50 22 C36 22 24 28 20 40 C17 50 19 64 32 76 C42 85 58 85 68 76 C81 64 83 50 80 40 C76 28 64 22 50 22 Z" 
                  fill="black" 
                />
              </mask>
            </defs>
            
            {/* Full-screen Darkroom Vignette Outside Reticle */}
            <rect 
              x="-500%" 
              y="-500%" 
              width="1100%" 
              height="1100%" 
              fill="var(--color-canvas-dark)" 
              fillOpacity={isReviewing ? "0.4" : "0.82"} 
              mask="url(#atelier-scan-mask)" 
              pointerEvents="none" 
            />
            
            {/* Primary Rhinarium Anatomical Contour */}
            <path 
              d="M50 22 C36 22 24 28 20 40 C17 50 19 64 32 76 C42 85 58 85 68 76 C81 64 83 50 80 40 C76 28 64 22 50 22 Z" 
              fill="none" 
              stroke={isReviewing ? "var(--color-success)" : "var(--color-bone)"} 
              strokeOpacity={phase === 'ALIGN' || isReviewing ? 1 : 0.45}
              strokeWidth="1.1" 
              strokeDasharray={phase === 'ALIGN' || isReviewing ? 'none' : '3 2'}
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="motion-reduce:transition-none transition-all duration-200"
            />

            {/* Canine Nares Caliper Guides */}
            <path 
              d="M34 52 C32 58 37 63 43 60 M66 52 C68 58 63 63 57 60" 
              stroke="var(--color-bone)" 
              strokeOpacity={phase === 'ALIGN' ? 0.8 : 0.3} 
              strokeWidth="0.8" 
              fill="none" 
              strokeLinecap="round"
            />
            {/* Philtrum Medial Ridge Tick */}
            <line 
              x1="50" y1="68" x2="50" y2="78" 
              stroke="var(--color-bone)" 
              strokeOpacity={phase === 'ALIGN' ? 0.9 : 0.35} 
              strokeWidth="0.9" 
              strokeLinecap="round" 
            />

            {/* Spatial Precision Framing Calipers */}
            <path 
              d="M45 20.5 L55 20.5 M45 79.5 L55 79.5 M18.5 45 L18.5 55 M81.5 45 L81.5 55" 
              stroke="var(--color-bone)" 
              strokeOpacity="0.8" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              className={phase === 'ALIGN' ? 'opacity-0' : 'opacity-100 transition-opacity duration-150'} 
            />
            
            {/* Reticle Corner Calibration Ticks */}
            <path d="M24 26 L18 26 L18 32" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
            <path d="M76 26 L82 26 L82 32" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
            <path d="M24 74 L18 74 L18 68" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
            <path d="M76 74 L82 74 L82 68" stroke="var(--color-bone)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
          </svg>

          {/* Central Marigold Pulse on Align Lock */}
          {phase === 'ALIGN' && !isReviewing && (
            <div className="absolute inset-0 border border-[var(--color-marigold)]/50 rounded-full animate-ping pointer-events-none motion-reduce:hidden" />
          )}
        </div>
      </div>

      {/* 4. Spatial Telemetry & Guidance Header */}
      <div className="absolute top-20 left-0 right-0 flex flex-col items-center justify-center px-4 pointer-events-none gap-2 z-20">
        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest text-[var(--color-bone)]/80 uppercase shadow-lg">
          {isReviewing ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              <span>FRAME CAPTURED // OPTICAL CLARITY CONFIRMED</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CHAMBER OPTICAL SENSOR // ACTIVE</span>
            </>
          )}
        </div>

        {/* Dynamic Instructional Guidance */}
        <div className="text-center">
          <p className="text-[var(--color-bone)] text-[14px] sm:text-[15px] font-sans font-medium tracking-wide bg-[var(--color-surface-dark)]/90 backdrop-blur-md inline-block px-6 py-2.5 rounded-full border border-white/10 shadow-xl">
            {isReviewing 
              ? 'Review capture clarity before vector matching' 
              : phase === 'ALIGN' 
              ? 'Hold still for optical calibration...' 
              : 'Position canine nose leather within reticle'}
          </p>
        </div>
      </div>

      {/* 5. Bottom Control Dock (Shutter or Review Confirmation) */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-center pb-safe z-30 pointer-events-auto px-6">
        {isReviewing ? (
          /* Review Confirmation Dock */
          <div className="w-full max-w-sm flex items-center justify-center gap-4 bg-[var(--color-surface-dark)]/90 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
            {/* Retake Button */}
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-white font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors min-h-[44px] cursor-pointer"
              aria-label="Retake photo"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>

            {/* Confirm & Analyze Button */}
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-[var(--color-marigold)] text-[var(--color-ink)] font-sans text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-accent-hover)] transition-colors shadow-lg min-h-[44px] cursor-pointer"
              aria-label="Confirm and analyze photo"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Identify Pet</span>
            </button>
          </div>
        ) : (
          /* Live Shutter Capture Dock */
          <div className="flex flex-col items-center justify-center">
            <button 
              type="button"
              onClick={handleShutterClick}
              className="group relative w-20 h-20 rounded-full bg-transparent flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[var(--color-bone)]/40 min-h-[44px] min-w-[44px] cursor-pointer"
              aria-label="Capture photo"
            >
              <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-bone)] group-active:scale-95 transition-transform duration-150 motion-reduce:transition-none shadow-[0_0_24px_rgba(255,255,255,0.2)]" />
              <div className="w-[62px] h-[62px] rounded-full bg-[var(--color-bone)] group-active:bg-[var(--color-bone)]/80 transition-colors duration-150 motion-reduce:transition-none" />
            </button>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-bone)]/70 mt-3 font-medium">
              TAP SHUTTER TO CAPTURE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
