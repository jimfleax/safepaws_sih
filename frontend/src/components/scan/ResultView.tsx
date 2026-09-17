import React from 'react';
import { ScanResult } from './types';
import { CheckCircle2, AlertCircle, HelpCircle, AlertTriangle, ServerCrash, RefreshCw, Eye, PlusCircle, Megaphone } from 'lucide-react';
import { usePetStore } from '../../store/petStore';
import { useNavigate } from 'react-router-dom';

interface ResultViewProps {
  result: ScanResult;
  onRetry: () => void;
  onConfirmCandidate: (petId: string) => void;
}

export default function ResultView({ result, onRetry, onConfirmCandidate }: ResultViewProps) {
  const navigate = useNavigate();
  const pets = usePetStore(state => state.pets);
  
  const handleViewProfile = (petId: string) => {
    usePetStore.getState().setSelectedPetId(petId);
    navigate('/dashboard');
  };

  const handleRegister = () => {
    navigate('/setup');
  };

  const ViewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full bg-[#111111] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
      {children}
    </div>
  );

  if (result.state === 'MATCH' && result.petId) {
    const pet = pets.find(p => p.id === result.petId) || { name: 'Unknown Pet' };
    return (
      <ViewWrapper>
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
          <CheckCircle2 className="w-20 h-20 text-emerald-400 relative z-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Match Found</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-md font-light">
          We found a decisive match for <strong className="text-white font-medium">{pet.name}</strong>.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => handleViewProfile(result.petId!)}
            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <Eye className="w-5 h-5" /> View Pet Profile
          </button>
          <button 
            onClick={() => {/* Mock report sighting */}}
            className="w-full bg-[#1a1a1a] hover:bg-[#222] text-gray-300 border border-white/5 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Megaphone className="w-5 h-5" /> Report a Sighting
          </button>
        </div>
      </ViewWrapper>
    );
  }

  if (result.state === 'AMBIGUOUS' && result.candidates) {
    return (
      <div className="w-full h-full bg-[#111111] flex flex-col items-center justify-start p-6 pt-12 overflow-y-auto relative">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        
        <div className="relative mb-4 shrink-0">
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
          <AlertCircle className="w-16 h-16 text-amber-400 relative z-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Multiple Profiles</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md font-light">
          This scan closely resembles multiple pets. Please carefully review the candidates below.
        </p>
        
        <div className="w-full max-w-md flex flex-col gap-4 mb-8 relative z-10">
          {result.candidates.map(candidateId => {
            const pet = pets.find(p => p.id === candidateId);
            if (!pet) return null;
            return (
              <div key={candidateId} className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between gap-4 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-black overflow-hidden shrink-0 border border-white/10">
                    <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white tracking-wide">{pet.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{pet.breed}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onConfirmCandidate(candidateId)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-5 py-2.5 rounded-xl font-medium transition-colors text-sm whitespace-nowrap"
                >
                  Confirm
                </button>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={onRetry}
          className="text-gray-500 hover:text-gray-300 font-medium py-3 px-4 transition-colors mt-auto relative z-10"
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
          <div className="absolute inset-0 bg-[#DE6828]/20 blur-xl rounded-full"></div>
          <HelpCircle className="w-20 h-20 text-[#DE6828] relative z-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">No Match</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-md font-light">
          This nose isn't registered with SafePaws yet. If this is your pet, add them to our community.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
          <button 
            onClick={handleRegister}
            className="w-full bg-[#DE6828] hover:bg-[#DE6828]/90 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_4px_14px_rgba(222,104,40,0.3)]"
          >
            <PlusCircle className="w-5 h-5" /> Register this pet
          </button>
          <button 
            onClick={onRetry}
            className="w-full bg-[#1a1a1a] hover:bg-[#222] text-gray-300 border border-white/5 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
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
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
          <AlertTriangle className="w-20 h-20 text-red-400 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Scan Unclear</h2>
        <p className="text-gray-400 mb-6 max-w-md font-light">
          We couldn't get a clear read of the nose pattern. {result.errorDetails && <span className="block mt-2 font-medium text-gray-300">Issue: {result.errorDetails}</span>}
        </p>
        <div className="bg-[#1a1a1a] border border-white/5 text-gray-300 p-5 rounded-2xl text-sm mb-8 max-w-md text-left shadow-xl relative z-10">
          <ul className="list-disc pl-5 space-y-2 font-light">
            <li>Ensure the nose fills the central frame.</li>
            <li>Check that the lighting is even and bright.</li>
            <li>Keep the camera as steady as possible.</li>
          </ul>
        </div>
        
        <button 
          onClick={onRetry}
          className="w-full max-w-xs bg-white text-black font-semibold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors relative z-10"
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
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
          <ServerCrash className="w-20 h-20 text-orange-400 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Service Error</h2>
        <p className="text-gray-400 mb-8 max-w-md font-light">
          Our identification servers are currently unreachable. This is a system issue, not a problem with your scan.
          {result.errorDetails && <span className="block mt-4 text-xs text-orange-300/70 font-mono bg-[#1a1a1a] border border-white/5 p-3 rounded-xl">{result.errorDetails}</span>}
        </p>
        
        <button 
          onClick={onRetry}
          className="w-full max-w-xs bg-white text-black font-semibold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors relative z-10"
        >
          <RefreshCw className="w-5 h-5" /> Retry Connection
        </button>
      </ViewWrapper>
    );
  }

  return null;
}
