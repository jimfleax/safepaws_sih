import React from 'react';
import { ScanResult } from './types';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  AlertTriangle, 
  ServerCrash, 
  RefreshCw, 
  Eye, 
  PlusCircle, 
  Megaphone, 
  ShieldCheck, 
  Info,
  Radio,
  FileQuestion
} from 'lucide-react';
import { usePetStore } from '../../store/petStore';
import { useNavigate } from 'react-router-dom';

interface ResultViewProps {
  result: ScanResult;
  onRetry: () => void;
  onConfirmCandidate: (petId: string, qrTagId?: string, petName?: string) => void;
}

export default function ResultView({ result, onRetry, onConfirmCandidate }: ResultViewProps) {
  const navigate = useNavigate();
  const pets = usePetStore(state => state.pets);
  
  const handleViewProfile = (petId: string, qrTagId?: string) => {
    // Check if current user is owner
    const isOwner = pets.some(p => p.id === petId);
    
    if (isOwner) {
      usePetStore.getState().setSelectedPetId(petId);
      navigate(`/pets/${petId}`);
    } else if (qrTagId) {
      navigate(`/p/${qrTagId}`);
    } else {
      // Safe fallback: owner dashboard
      navigate('/dashboard');
    }
  };

  const handleRegister = () => {
    navigate('/pets/new');
  };

  const ViewWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`w-full h-full bg-[var(--color-canvas-dark)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden animate-in fade-in duration-400 ease-out motion-reduce:transition-none motion-reduce:animate-none ${className}`}>
      {/* Ambient optical spotlight */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto relative z-10 animate-in slide-in-from-bottom-4 duration-400 ease-out fill-mode-both motion-reduce:animate-none">
        {children}
      </div>
    </div>
  );

  // Simulation Mode Banner Component
  const SimulationBanner = () => (
    <div 
      className="w-full bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)]/30 text-[var(--color-bone)] rounded-xl px-4 py-2.5 mb-5 text-xs font-mono font-bold tracking-wider uppercase text-center shadow-md flex items-center justify-center gap-2"
      role="status"
      aria-label="Simulation Mode Banner"
    >
      <Radio className="w-3.5 h-3.5 text-[var(--color-marigold)] animate-pulse" />
      <span>SIMULATION MODE — NOT A VERIFIED BIOMETRIC RESULT</span>
    </div>
  );

  // 1. MATCH STATE
  if (result.state === 'MATCH' && result.petId) {
    const matchedPet = pets.find(p => p.id === result.petId);
    const petName = matchedPet?.name || result.petName || 'Unknown Pet';
    const petBreed = matchedPet?.breed || 'Canine Companion';
    const photoUrl = matchedPet?.photoUrl;

    return (
      <ViewWrapper>
        {result.isSimulated && <SimulationBanner />}

        {/* Status Icon */}
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-[var(--color-bone)]" strokeWidth={1.75} />
          </div>
        </div>

        {/* Telemetry Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>POTENTIAL MATCH DETECTED — CONFIRMATION REQUIRED</span>
        </div>

        <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">
          Identity Confirmed
        </h2>
        
        <p className="text-base text-[var(--color-bone)]/80 mb-6 max-w-md font-light leading-relaxed">
          We found a decisive match for <strong className="text-white font-medium">{petName}</strong>.
        </p>

        {/* Candidate Detail Bento Card */}
        <div className="w-full bg-[#181614] border border-white/10 rounded-2xl p-4 mb-6 shadow-2xl flex items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-xl bg-black/60 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt={petName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-serif text-[var(--color-bone)]/60 uppercase">
                {petName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white tracking-wide truncate">{petName}</h3>
            <p className="text-xs text-[var(--color-bone)]/60 capitalize truncate">{petBreed}</p>
            {result.qrTagId && (
              <p className="text-[10px] font-mono text-[var(--color-marigold)] mt-1 truncate">
                TAG ID: {result.qrTagId}
              </p>
            )}
          </div>
        </div>
        
        {/* CTAs */}
        <div className="w-full flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => handleViewProfile(result.petId!, result.qrTagId)}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px] shadow-lg cursor-pointer"
          >
            <Eye className="w-5 h-5" /> View Pet Profile
          </button>
          <button 
            onClick={() => navigate('/sightings/new')}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)] border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px] cursor-pointer"
          >
            <Megaphone className="w-5 h-5" /> Report a Sighting
          </button>
          <button 
            onClick={onRetry}
            className="text-[var(--color-bone)]/60 hover:text-white font-medium py-2.5 px-4 transition-colors min-h-[44px] text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)]/40 rounded-lg cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Scan Another Pet
          </button>
        </div>
      </ViewWrapper>
    );
  }

  // 2. CANDIDATE SELECTED BY FINDER
  if (result.state === 'CANDIDATE_SELECTED' && result.petId) {
    const matchedPet = pets.find(p => p.id === result.petId);
    const petName = matchedPet?.name || result.petName || 'Candidate Pet';
    const petBreed = matchedPet?.breed || 'Canine Companion';
    const photoUrl = matchedPet?.photoUrl;

    return (
      <ViewWrapper>
        {result.isSimulated && <SimulationBanner />}

        <div className="relative mb-5">
          <div className="absolute inset-0 bg-[var(--color-marigold)]/15 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
            <AlertCircle className="w-10 h-10 text-[var(--color-marigold)]" strokeWidth={1.75} />
          </div>
        </div>

        <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">
          Candidate Selected by Finder
        </h2>

        <p className="text-base text-[var(--color-bone)]/80 mb-4 max-w-md font-light leading-relaxed">
          You selected <strong className="text-white font-medium">{petName}</strong> from multiple ambiguous profiles.
        </p>

        {/* Selected Candidate Bento Preview */}
        <div className="w-full bg-[#181614] border border-white/10 rounded-2xl p-4 mb-4 shadow-2xl flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-xl bg-black/60 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt={petName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-serif text-[var(--color-bone)]/60 uppercase">
                {petName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white tracking-wide truncate">{petName}</h3>
            <p className="text-xs text-[var(--color-bone)]/60 capitalize truncate">{petBreed}</p>
          </div>
        </div>

        {/* Mandatory Finder Disclaimer */}
        <div className="mb-6 p-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-[var(--color-bone)]/75 max-w-md text-center leading-relaxed">
          Note: This identity was visually selected by the finder, not verified by an automated biometric confidence threshold.
        </div>
        
        <div className="w-full flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => handleViewProfile(result.petId!, result.qrTagId)}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px] shadow-lg cursor-pointer"
          >
            <Eye className="w-5 h-5" /> View Candidate Profile
          </button>
          <button 
            onClick={() => navigate('/sightings/new')}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)] border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px] cursor-pointer"
          >
            <Megaphone className="w-5 h-5" /> Report Sighting for this Pet
          </button>
          <button 
            onClick={onRetry}
            className="text-[var(--color-bone)]/60 hover:text-white font-medium py-2.5 px-4 transition-colors min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)]/40 rounded-lg cursor-pointer"
          >
            Back to Scanner
          </button>
        </div>
      </ViewWrapper>
    );
  }

  // 3. AMBIGUOUS CANDIDATES STATE
  if (result.state === 'AMBIGUOUS' && result.candidates) {
    return (
      <div className="w-full h-full bg-[var(--color-canvas-dark)] flex flex-col items-center justify-start p-6 pt-10 overflow-y-auto relative animate-in fade-in duration-400 ease-out motion-reduce:transition-none motion-reduce:animate-none">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
        
        {result.isSimulated && (
          <div className="w-full max-w-md z-10">
            <SimulationBanner />
          </div>
        )}

        <div className="relative mb-3 shrink-0 animate-in slide-in-from-bottom-4 duration-400 ease-out fill-mode-both motion-reduce:animate-none">
          <div className="absolute inset-0 bg-[var(--color-bone)]/10 blur-xl rounded-full" />
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
            <AlertCircle className="w-8 h-8 text-[var(--color-bone)]" strokeWidth={1.75} />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 text-center animate-in slide-in-from-bottom-4 duration-400 ease-out fill-mode-both motion-reduce:animate-none">
          Multiple Similar Profiles
        </h2>
        
        <p className="text-[var(--color-bone)]/70 mb-3 text-center max-w-md font-light text-sm animate-in slide-in-from-bottom-4 duration-400 ease-out fill-mode-both motion-reduce:animate-none">
          This scan closely resembles multiple pets. Please carefully review the candidates below.
        </p>

        {/* Preserved Warning Note */}
        <div className="mb-6 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-[var(--color-bone)]/80 max-w-md text-center animate-in slide-in-from-bottom-4 duration-400 ease-out delay-75 fill-mode-both motion-reduce:animate-none leading-relaxed">
          Selecting a candidate indicates finder visual choice, not an automated ML biometric certainty.
        </div>
        
        {/* Candidate Bento Cards */}
        <div className="w-full max-w-md flex flex-col gap-3 mb-8 relative z-10 animate-in slide-in-from-bottom-4 duration-400 ease-out delay-100 fill-mode-both motion-reduce:animate-none">
          {result.candidates.map(candidate => {
            const pet = pets.find(p => p.id === candidate.pet_id) || {
              name: candidate.name || 'Unknown Pet',
              breed: candidate.breed || 'Unknown Breed',
              photoUrl: candidate.photo_url || ''
            };
            return (
              <div 
                key={candidate.pet_id} 
                className="bg-[#181614] p-4 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between gap-4 transition-all duration-150 hover:border-white/20 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-black/60 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-serif text-[var(--color-bone)]/60 uppercase">
                        {pet.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="font-semibold text-white tracking-wide truncate">{pet.name}</h3>
                    <p className="text-xs text-[var(--color-bone)]/60 capitalize truncate">{pet.breed}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onConfirmCandidate(candidate.pet_id, candidate.qr_tag_id, pet.name)}
                  className="bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-white border border-[var(--color-bone)] px-4 py-2.5 rounded-xl font-semibold transition-all duration-150 active:scale-[0.98] text-sm whitespace-nowrap min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)] shadow-md shrink-0 cursor-pointer"
                >
                  Select Candidate
                </button>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={onRetry}
          className="text-[var(--color-bone)]/60 hover:text-white font-medium py-3 px-4 transition-colors mt-auto relative z-10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)] rounded-lg animate-in slide-in-from-bottom-4 duration-400 ease-out fill-mode-both motion-reduce:animate-none text-sm cursor-pointer"
        >
          None of these? Try scanning again
        </button>
      </div>
    );
  }

  // 4. UNKNOWN IDENTITY STATE
  if (result.state === 'UNKNOWN') {
    return (
      <ViewWrapper>
        {result.isSimulated && <SimulationBanner />}

        <div className="relative mb-5">
          <div className="absolute inset-0 bg-[var(--color-bone)]/10 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
            <HelpCircle className="w-10 h-10 text-[var(--color-bone)]/70" strokeWidth={1.75} />
          </div>
        </div>

        <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">
          No Match Found
        </h2>

        <p className="text-base text-[var(--color-bone)]/80 mb-8 max-w-md font-light leading-relaxed">
          This nose isn't registered with SafePaws yet. If this is your pet, add them to our community.
        </p>
        
        <div className="w-full flex flex-col gap-3 relative z-10">
          <button 
            onClick={handleRegister}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" /> Register this pet
          </button>
          <button 
            onClick={onRetry}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)]/90 border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" /> Try again
          </button>
        </div>
      </ViewWrapper>
    );
  }

  // 5. QUALITY FAILURE STATE (Blur, Lighting, Framing)
  if (result.state === 'QUALITY_FAILURE') {
    return (
      <ViewWrapper>
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-[#D32F2F]/15 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-[#D32F2F]/10 border border-[#D32F2F]/30 flex items-center justify-center relative z-10 shadow-xl">
            <AlertTriangle className="w-10 h-10 text-[#D32F2F]" strokeWidth={1.75} />
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">
          Scan Unclear
        </h2>

        <p className="text-[var(--color-bone)]/75 mb-6 max-w-md font-light text-sm leading-relaxed">
          We couldn't get a clear read of the nose pattern. {result.errorDetails && (
            <span className="block mt-2 font-mono text-xs text-[var(--color-bone)] bg-white/5 border border-white/10 p-2.5 rounded-lg">
              Issue: {result.errorDetails}
            </span>
          )}
        </p>

        {/* Actionable Optical Guidance Card */}
        <div className="bg-[#181614] border border-white/10 text-[var(--color-bone)]/90 p-5 rounded-2xl text-xs mb-8 max-w-md text-left shadow-2xl relative z-10 w-full">
          <div className="font-semibold text-white mb-2.5 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[var(--color-marigold)]" />
            <span>Optimal Scanning Protocol</span>
          </div>
          <ul className="list-disc pl-5 space-y-2 font-light">
            <li>Ensure the nose fills the central frame.</li>
            <li>Check that the lighting is even and bright.</li>
            <li>Keep the camera as steady as possible.</li>
          </ul>
        </div>
        
        <button 
          onClick={onRetry}
          className="w-full max-w-xs bg-white text-[var(--color-ink)] font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] relative z-10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-white shadow-xl cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" /> Scan Again
        </button>
      </ViewWrapper>
    );
  }

  // 6. SYSTEM FAILURE STATE (503 / Network / Missing Checkpoint)
  if (result.state === 'SYSTEM_FAILURE') {
    return (
      <ViewWrapper>
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-[var(--color-alert-clay)]/20 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/30 flex items-center justify-center relative z-10 shadow-xl">
            <ServerCrash className="w-10 h-10 text-[var(--color-alert-clay)]" strokeWidth={1.75} />
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">
          Service Unavailable
        </h2>

        <p className="text-[var(--color-bone)]/75 mb-6 max-w-md font-light text-sm leading-relaxed">
          Our identification servers are currently unreachable. This is a system issue, not a problem with your scan.
          {result.errorDetails && (
            <span className="block mt-3 text-xs text-[var(--color-alert-clay)] font-mono bg-white/5 border border-white/10 p-3 rounded-xl break-all">
              {result.errorDetails}
            </span>
          )}
        </p>
        
        <button 
          onClick={onRetry}
          className="w-full max-w-xs bg-white text-[var(--color-ink)] font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] relative z-10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-white shadow-xl cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" /> Retry Connection
        </button>
      </ViewWrapper>
    );
  }

  // 7. IDENTIFICATION UNAVAILABLE / DEMO MODE STATE
  if (result.state === 'IDENTIFICATION_UNAVAILABLE' || result.state === 'DEMO_MODE') {
    return (
      <ViewWrapper>
        <SimulationBanner />

        <div className="relative mb-5">
          <div className="absolute inset-0 bg-[var(--color-marigold)]/15 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
            <FileQuestion className="w-10 h-10 text-[var(--color-marigold)]" strokeWidth={1.75} />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-wide">
          Identification In Demonstration Mode
        </h2>

        <p className="text-base text-[var(--color-bone)]/80 mb-6 max-w-md font-light leading-relaxed">
          Live neural model inference is scheduled for a future milestone. The scanner interface is currently operating in simulation mode.
        </p>

        <div className="w-full flex flex-col gap-3 relative z-10">
          <button 
            onClick={handleRegister}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] min-h-[44px] shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" /> Register a Pet
          </button>
          <button 
            onClick={onRetry}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)] border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] min-h-[44px] cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" /> Return to Scanner
          </button>
        </div>
      </ViewWrapper>
    );
  }

  return null;
}
