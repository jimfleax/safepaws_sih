import React from 'react';
import { ScanResult } from './types';
import { CheckCircle2, AlertCircle, HelpCircle, AlertTriangle, ServerCrash, RefreshCw, Eye, PlusCircle, Megaphone } from 'lucide-react';
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
      // Fallback
      navigate('/dashboard');
    }
  };

  const handleRegister = () => {
    navigate('/setup');
  };

  const ViewWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`w-full h-full bg-[var(--color-ink)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden animate-in fade-in duration-500 ease-out motion-reduce:transition-none motion-reduce:animate-none ${className}`}>
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
      <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-bottom-4 duration-500 ease-out delay-100 fill-mode-both motion-reduce:animate-none">
        {children}
      </div>
    </div>
  );

  if (result.state === 'MATCH' && result.petId) {
    const petName = pets.find(p => p.id === result.petId)?.name || result.petName || 'Unknown Pet';
    return (
      <ViewWrapper>
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--color-bone)]/10 blur-xl rounded-full"></div>
          <CheckCircle2 className="w-20 h-20 text-[var(--color-bone)] relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">Identity Confirmed</h2>
        <p className="text-lg text-[var(--color-bone)]/70 mb-10 max-w-md font-light">
          We found a decisive match for <strong className="text-white font-medium">{petName}</strong>.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => handleViewProfile(result.petId!, result.qrTagId)}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px]"
          >
            <Eye className="w-5 h-5" /> View Pet Profile
          </button>
          <button 
            onClick={() => navigate('/sightings/new')}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)] border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px]"
          >
            <Megaphone className="w-5 h-5" /> Report a Sighting
          </button>
        </div>
      </ViewWrapper>
    );
  }

  if (result.state === 'CANDIDATE_SELECTED' && result.petId) {
    const petName = pets.find(p => p.id === result.petId)?.name || result.petName || 'Candidate Pet';
    return (
      <ViewWrapper>
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--color-marigold)]/10 blur-xl rounded-full"></div>
          <AlertCircle className="w-20 h-20 text-[var(--color-marigold)] relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">Candidate Selected by Finder</h2>
        <p className="text-base text-[var(--color-bone)]/80 mb-4 max-w-md font-light">
          You selected <strong className="text-white font-medium">{petName}</strong> from multiple ambiguous profiles.
        </p>
        <div className="mb-8 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-[var(--color-bone)]/70 max-w-sm text-center">
          Note: This identity was visually selected by the finder, not verified by an automated biometric confidence threshold.
        </div>
        
        <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => handleViewProfile(result.petId!, result.qrTagId)}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px]"
          >
            <Eye className="w-5 h-5" /> View Candidate Profile
          </button>
          <button 
            onClick={() => navigate('/sightings/new')}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)] border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)] min-h-[44px]"
          >
            <Megaphone className="w-5 h-5" /> Report Sighting for this Pet
          </button>
          <button 
            onClick={onRetry}
            className="text-[var(--color-bone)]/60 hover:text-white font-medium py-2.5 px-4 transition-colors min-h-[44px] text-sm"
          >
            Back to Scanner
          </button>
        </div>
      </ViewWrapper>
    );
  }

  if (result.state === 'AMBIGUOUS' && result.candidates) {
    return (
      <div className="w-full h-full bg-[var(--color-ink)] flex flex-col items-center justify-start p-6 pt-12 overflow-y-auto relative animate-in fade-in duration-500 ease-out motion-reduce:transition-none motion-reduce:animate-none">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        
        <div className="relative mb-4 shrink-0 animate-in slide-in-from-bottom-4 duration-500 ease-out delay-100 fill-mode-both motion-reduce:animate-none">
          <div className="absolute inset-0 bg-[var(--color-bone)]/10 blur-xl rounded-full"></div>
          <AlertCircle className="w-16 h-16 text-[var(--color-bone)] relative z-10" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-white mb-2 animate-in slide-in-from-bottom-4 duration-500 ease-out delay-100 fill-mode-both motion-reduce:animate-none">Multiple Similar Profiles</h2>
        <p className="text-[var(--color-bone)]/70 mb-4 text-center max-w-md font-light animate-in slide-in-from-bottom-4 duration-500 ease-out delay-100 fill-mode-both motion-reduce:animate-none">
          This scan closely resembles multiple pets. Please carefully review the candidates below.
        </p>
        <div className="mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-[var(--color-bone)]/80 max-w-md text-center animate-in slide-in-from-bottom-4 duration-500 ease-out delay-120 fill-mode-both motion-reduce:animate-none">
          Selecting a candidate indicates finder visual choice, not an automated ML biometric certainty.
        </div>
        
        <div className="w-full max-w-md flex flex-col gap-4 mb-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500 ease-out delay-150 fill-mode-both motion-reduce:animate-none">
          {result.candidates.map(candidate => {
            const pet = pets.find(p => p.id === candidate.pet_id) || {
              name: candidate.name || 'Unknown Pet',
              breed: candidate.breed || 'Unknown Breed',
              photoUrl: candidate.photo_url || ''
            };
            return (
              <div key={candidate.pet_id} className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between gap-4 transition-transform duration-[150ms] hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-black overflow-hidden shrink-0 border border-white/10">
                    {pet.photoUrl && <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white tracking-wide">{pet.name}</h3>
                    <p className="text-sm text-[var(--color-bone)]/50 capitalize">{pet.breed}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onConfirmCandidate(candidate.pet_id, candidate.qr_tag_id, pet.name)}
                  className="bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-white border border-[var(--color-bone)] px-5 py-2.5 rounded-xl font-semibold transition-all duration-[150ms] active:scale-[0.98] text-sm whitespace-nowrap min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)]"
                >
                  Select Candidate
                </button>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={onRetry}
          className="text-[var(--color-bone)]/60 hover:text-white font-medium py-3 px-4 transition-colors mt-auto relative z-10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-bone)] rounded-lg animate-in slide-in-from-bottom-4 duration-500 ease-out delay-200 fill-mode-both motion-reduce:animate-none"
        >
          None of these? Try scanning again
        </button>
      </div>
    );
  }

  if (result.state === 'UNKNOWN') {
    return (
      <ViewWrapper>
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--color-ink-soft)]/10 blur-xl rounded-full"></div>
          <HelpCircle className="w-20 h-20 text-[var(--color-ink-soft)] relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">No Match Found</h2>
        <p className="text-lg text-[var(--color-bone)]/70 mb-10 max-w-md font-light">
          This nose isn't registered with SafePaws yet. If this is your pet, add them to our community.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
          <button 
            onClick={handleRegister}
            className="w-full bg-[var(--color-bone)] hover:bg-white text-[var(--color-ink)] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)]"
          >
            <PlusCircle className="w-5 h-5" /> Register this pet
          </button>
          <button 
            onClick={onRetry}
            className="w-full bg-white/5 hover:bg-white/10 text-[var(--color-bone)]/90 border border-white/10 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-[var(--color-bone)]"
          >
            <RefreshCw className="w-5 h-5" /> Try again
          </button>
        </div>
      </ViewWrapper>
    );
  }

  if (result.state === 'QUALITY_FAILURE') {
    return (
      <ViewWrapper>
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#D32F2F]/10 blur-xl rounded-full"></div>
          <AlertTriangle className="w-20 h-20 text-[#D32F2F] relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">Scan Unclear</h2>
        <p className="text-[var(--color-bone)]/70 mb-6 max-w-md font-light">
          We couldn't get a clear read of the nose pattern. {result.errorDetails && <span className="block mt-2 font-medium text-[var(--color-bone)]/90">Issue: {result.errorDetails}</span>}
        </p>
        <div className="bg-white/5 border border-white/10 text-[var(--color-bone)]/90 p-5 rounded-2xl text-sm mb-8 max-w-md text-left shadow-xl relative z-10">
          <ul className="list-disc pl-5 space-y-2 font-light">
            <li>Ensure the nose fills the central frame.</li>
            <li>Check that the lighting is even and bright.</li>
            <li>Keep the camera as steady as possible.</li>
          </ul>
        </div>
        
        <button 
          onClick={onRetry}
          className="w-full max-w-xs bg-white text-[var(--color-ink)] font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] relative z-10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-white"
        >
          <RefreshCw className="w-5 h-5" /> Scan Again
        </button>
      </ViewWrapper>
    );
  }

  if (result.state === 'SYSTEM_FAILURE') {
    return (
      <ViewWrapper>
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--color-alert-clay)]/10 blur-xl rounded-full"></div>
          <ServerCrash className="w-20 h-20 text-[var(--color-alert-clay)] relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">Service Unavailable</h2>
        <p className="text-[var(--color-bone)]/70 mb-8 max-w-md font-light">
          Our identification servers are currently unreachable. This is a system issue, not a problem with your scan.
          {result.errorDetails && <span className="block mt-4 text-xs text-[var(--color-alert-clay)]/70 font-mono bg-white/5 border border-white/10 p-3 rounded-xl">{result.errorDetails}</span>}
        </p>
        
        <button 
          onClick={onRetry}
          className="w-full max-w-xs bg-white text-[var(--color-ink)] font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-[150ms] active:scale-[0.98] relative z-10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ink)] focus:ring-white"
        >
          <RefreshCw className="w-5 h-5" /> Retry Connection
        </button>
      </ViewWrapper>
    );
  }

  return null;
}
