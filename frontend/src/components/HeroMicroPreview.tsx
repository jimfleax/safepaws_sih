import React, { useState, useRef, useEffect, useId } from 'react';
import { ShieldCheck, Sparkles, RefreshCw, Eye, CheckCircle2, Scan } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface HeroMicroPreviewProps {
  onScanMatchClick?: () => void;
  className?: string;
}

type PreviewMode = 'reticle' | 'mesh' | 'heatmap';
type ScanState = 'idle' | 'calibrating' | 'extracting' | 'matched';

export const HeroMicroPreview: React.FC<HeroMicroPreviewProps> = ({
  onScanMatchClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<PreviewMode>('reticle');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [pointerCoords, setPointerCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const statusLiveRegionId = useId();

  // Vestibular check
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Pointer position tracker for dynamic telemetry coordinates
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setPointerCoords({ x, y });
  };

  // Run simulated optical match lifecycle
  const handleSimulateScan = () => {
    if (prefersReducedMotion) {
      setScanState('matched');
      return;
    }
    setScanState('calibrating');
    setTimeout(() => {
      setScanState('extracting');
      setTimeout(() => {
        setScanState('matched');
      }, 900);
    }, 700);
  };

  const handleResetScan = () => {
    setScanState('idle');
  };

  return (
    <div
      className={`relative w-full aspect-[4/5] rounded-[var(--radius-24)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl ${className}`}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
      role="region"
      aria-label="Interactive Biometric Scanner Micro-Preview"
    >
      {/* Dog Nose Biometric High-Res Canvas */}
      <img
        src="/images/editorial_hero.jpg"
        alt="Macro photograph of canine nasal leather displaying natural friction ridge topography"
        className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 ease-out"
        loading="eager"
      />

      {/* Screen Reader Live Announcements */}
      <div id={statusLiveRegionId} className="sr-only" aria-live="polite">
        {scanState === 'calibrating' && 'Optical scan: Calibrating dorsal apex reticle...'}
        {scanState === 'extracting' && 'Optical scan: Extracting 128-dimensional ridge vector...'}
        {scanState === 'matched' && 'Optical scan complete: Simulated companion profile loaded for preview.'}
      </div>

      {/* Mode-Specific Visual Overlays */}
      {mode === 'mesh' && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-marigold)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-marigold)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="55%" r="35%" fill="url(#meshGlow)" />
          {/* Triangular Lattice Lines */}
          <path
            d="M 120 180 L 180 140 L 250 160 L 310 130 L 260 210 L 190 230 Z"
            fill="none"
            stroke="var(--color-marigold)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            className="animate-pulse"
          />
          <path
            d="M 180 140 L 190 230 M 250 160 L 260 210 M 120 180 L 260 210"
            fill="none"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          {/* Keypoints */}
          {[[120, 180], [180, 140], [250, 160], [310, 130], [260, 210], [190, 230], [220, 185]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3.5" fill="var(--color-marigold)" stroke="white" strokeWidth="1.5" />
          ))}
        </svg>
      )}

      {mode === 'heatmap' && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-50 bg-gradient-to-t from-[var(--color-marigold)]/30 via-orange-500/20 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Dynamic Laser Scanning Beam (During Simulation) */}
      {(scanState === 'calibrating' || scanState === 'extracting') && (
        <div
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-marigold)] to-transparent shadow-[0_0_12px_var(--color-marigold)] pointer-events-none animate-shimmer-slide"
          style={{
            animation: prefersReducedMotion ? 'none' : 'scannerSweep 1.8s ease-in-out infinite alternate',
          }}
          aria-hidden="true"
        />
      )}

      {/* Reticle Crosshair HUD (Follows Pointer or Center) */}
      {scanState !== 'matched' && (
        <div
          className="absolute pointer-events-none transition-all duration-150 ease-out"
          style={{
            left: `${isHovering ? pointerCoords.x : 50}%`,
            top: `${isHovering ? pointerCoords.y : 52}%`,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        >
          <div className="relative w-36 h-36 border border-dashed border-[var(--color-marigold)]/70 rounded-full flex items-center justify-center">
            <div
              className={`w-28 h-28 border border-white/40 rounded-full ${
                prefersReducedMotion ? '' : 'animate-spin [animation-duration:14s]'
              }`}
            />
            <div className="w-3.5 h-3.5 border-2 border-[var(--color-marigold)] rounded-full bg-white/30" />
            {/* Cardinal Bracket ticks */}
            <span className="absolute -top-1 w-3 h-[2px] bg-[var(--color-marigold)]" />
            <span className="absolute -bottom-1 w-3 h-[2px] bg-[var(--color-marigold)]" />
            <span className="absolute -left-1 h-3 w-[2px] bg-[var(--color-marigold)]" />
            <span className="absolute -right-1 h-3 w-[2px] bg-[var(--color-marigold)]" />
          </div>
        </div>
      )}

      {/* Main HUD Overlay Layer */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
        {/* Top Control Bar: Mode Switcher + Live Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          {/* Mode Switcher Tabs */}
          <div
            className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-lg text-[11px] font-mono"
            role="tablist"
            aria-label="Preview modes"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'reticle'}
              onClick={() => setMode('reticle')}
              className={`px-3 py-1.5 rounded-full transition-colors min-h-[32px] flex items-center gap-1.5 cursor-pointer ${
                mode === 'reticle'
                  ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Scan className="w-3 h-3" aria-hidden="true" />
              <span>RETICLE</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'mesh'}
              onClick={() => setMode('mesh')}
              className={`px-3 py-1.5 rounded-full transition-colors min-h-[32px] flex items-center gap-1.5 cursor-pointer ${
                mode === 'mesh'
                  ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>128-D MESH</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'heatmap'}
              onClick={() => setMode('heatmap')}
              className={`px-3 py-1.5 rounded-full transition-colors min-h-[32px] flex items-center gap-1.5 cursor-pointer ${
                mode === 'heatmap'
                  ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span>DENSITY</span>
            </button>
          </div>

          {/* Coordinate Readout Pill */}
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/90 font-mono text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span>X:{pointerCoords.x} Y:{pointerCoords.y}</span>
          </div>
        </div>

        {/* Bottom Interactive Area */}
        <div className="space-y-3 pointer-events-auto">
          {/* State: Match Found Card */}
          {scanState === 'matched' ? (
            <div className="bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-[var(--radius-16)] p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              {/* Simulation Mode Mandatory Transparency Banner */}
              <div className="w-full bg-[var(--color-marigold)]/10 border border-[var(--color-marigold)]/25 rounded-md px-2 py-1 mb-2.5 text-[10px] font-mono text-[var(--color-accent-text)] font-bold text-center tracking-wider uppercase">
                SIMULATION MODE — NOT A VERIFIED BIOMETRIC RESULT
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-success)]/15 border border-[var(--color-success)]/30 flex items-center justify-center text-[var(--color-success)] shrink-0">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[var(--color-ink)]">
                        Cooper
                      </h4>
                      <Badge variant="scout" className="text-[10px] py-0 px-2 font-mono">
                        GOLDEN RETRIEVER
                      </Badge>
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[var(--color-marigold)]/15 text-[var(--color-accent-text)]">
                        DEMO
                      </span>
                    </div>
                    <p className="text-[length:var(--text-metadata)] text-[var(--color-ink-soft)] font-mono">
                      SIMULATED CANDIDATE RECORD • DEMO PREVIEW ONLY
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetScan}
                  aria-label="Reset biometric scanner preview"
                  className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-bone)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[var(--color-success)] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  DEMO RELAY PREVIEW
                </span>
                {onScanMatchClick && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={onScanMatchClick}
                    className="text-xs h-8 px-3"
                  >
                    View Demo Record
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* State: Idle / Active Scan Telemetry & Trigger */
            <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-[var(--radius-16)] p-3 text-white font-mono text-xs flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-marigold)] animate-ping" />
                <div>
                  <span className="block text-[10px] tracking-wider text-white/70 uppercase">
                    {scanState === 'calibrating'
                      ? 'CALIBRATING RETICLE...'
                      : scanState === 'extracting'
                      ? 'EXTRACTING 128-D EMBEDDING...'
                      : 'OPTICAL ENROLLMENT READY'}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {scanState === 'idle' ? 'CANINE DORSAL LEATHER' : 'MATCH IN PROGRESS...'}
                  </span>
                </div>
              </div>

              <Button
                variant="scanner"
                size="sm"
                onClick={handleSimulateScan}
                disabled={scanState !== 'idle'}
                isLoading={scanState === 'calibrating' || scanState === 'extracting'}
                className="bg-[var(--color-marigold)] hover:bg-[var(--color-accent-hover)] text-[var(--color-ink)] font-bold text-xs h-9 px-3.5 rounded-xl border-none shadow-md cursor-pointer"
              >
                {scanState === 'idle' ? 'TEST SCAN' : 'SCANNING'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
