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

  if (result.state === 'MATCH' && result.petId) {
    const pet = pets.find(p => p.id === result.petId) || { name: 'Unknown Pet' };
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Match Found!</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          We found a decisive match for <strong className="text-slate-900">{pet.name}</strong>.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button 
            onClick={() => handleViewProfile(result.petId!)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-5 h-5" /> View Pet Profile
          </button>
          <button 
            onClick={() => {/* Mock report sighting */}}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Megaphone className="w-5 h-5" /> Report a Sighting
          </button>
        </div>
      </div>
    );
  }

  if (result.state === 'AMBIGUOUS' && result.candidates) {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-start p-6 pt-12 overflow-y-auto">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4 shrink-0" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Multiple Similar Profiles</h2>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          This scan closely resembles multiple pets. Please carefully review the candidates below and confirm the correct match.
        </p>
        
        <div className="w-full max-w-md flex flex-col gap-4 mb-8">
          {result.candidates.map(candidateId => {
            const pet = pets.find(p => p.id === candidateId);
            if (!pet) return null;
            return (
              <div key={candidateId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">{pet.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{pet.breed}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onConfirmCandidate(candidateId)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                >
                  Confirm
                </button>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={onRetry}
          className="text-slate-500 hover:text-slate-700 font-medium py-2 px-4 transition-colors mt-auto"
        >
          None of these? Try scanning again
        </button>
      </div>
    );
  }

  if (result.state === 'UNKNOWN') {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <HelpCircle className="w-20 h-20 text-blue-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-2">No Match Found</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          This nose isn't registered with SafePaws yet. If this is your pet, you can add them to our community.
        </p>
        
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button 
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <PlusCircle className="w-5 h-5" /> Register this pet
          </button>
          <button 
            onClick={onRetry}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (result.state === 'QUALITY_FAILURE') {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-20 h-20 text-orange-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Scan Unclear</h2>
        <p className="text-slate-600 mb-4 max-w-md">
          We couldn't get a clear read of the nose pattern. {result.errorDetails && <span className="block mt-2 font-medium">Issue: {result.errorDetails}</span>}
        </p>
        <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm mb-8 max-w-md text-left">
          <ul className="list-disc pl-5 space-y-1">
            <li>Ensure the nose fills the central frame.</li>
            <li>Check that the lighting is even and bright.</li>
            <li>Keep the camera as steady as possible.</li>
          </ul>
        </div>
        
        <button 
          onClick={onRetry}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-5 h-5" /> Scan Again
        </button>
      </div>
    );
  }

  if (result.state === 'SYSTEM_FAILURE') {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <ServerCrash className="w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Unavailable</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Our identification servers are currently unreachable. This is a system issue, not a problem with your scan.
          {result.errorDetails && <span className="block mt-2 text-sm text-slate-500 font-mono bg-slate-200 p-2 rounded">{result.errorDetails}</span>}
        </p>
        
        <button 
          onClick={onRetry}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-5 h-5" /> Retry Connection
        </button>
      </div>
    );
  }

  return null;
}
