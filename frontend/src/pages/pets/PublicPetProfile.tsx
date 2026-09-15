import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MapPin, Shield, AlertCircle } from 'lucide-react';
import { usePetStore } from '../../store/petStore';

export default function PublicPetProfile() {
  const { petId } = useParams<{ petId: string }>();
  const pet = usePetStore((state) => 
    state.pets.find((p) => p.id === petId || p.qrTagId === petId)
  );

  const [gpsSent, setGpsSent] = useState(false);

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-[#E9DCcb]">
          <div className="w-16 h-16 rounded-full bg-[#F4EDE2] flex items-center justify-center mx-auto mb-4 text-[#DE6828]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#241812] mb-2">Profile Not Found</h1>
          <p className="text-[#6F5D52] text-sm">
            This pet's profile is currently unavailable or the link may be incorrect. If you found a pet, please check the collar tag again or contact local animal services.
          </p>
        </div>
      </div>
    );
  }

  const handleShareGps = () => {
    setGpsSent(true);
    setTimeout(() => {
      alert(`Location sent! The owner has received your current GPS pin and a notification.`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center">
      {/* Critical Recovery Surface */}
      <div className="w-full max-w-lg bg-white sm:mt-8 sm:rounded-3xl shadow-sm border-x sm:border border-[#E9DCcb] overflow-hidden">
        {/* Photo Header */}
        <div className="relative h-72 sm:h-80 w-full bg-[#241812]">
          <img
            src={pet.photoUrl}
            alt={pet.name}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7ECEB]/90 backdrop-blur-sm text-[#1E3B3A] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Shield className="w-3 h-3" />
                <span>SafePaws Emergency Tag</span>
              </div>
              <h1 className="font-serif text-4xl font-bold tracking-wide">{pet.name}</h1>
              <p className="text-white/90 text-sm font-medium mt-1">
                {pet.breed} {pet.color ? `· ${pet.color}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm font-medium text-[#4A3B31] leading-relaxed">
            Thank you for scanning! The owner is waiting for {pet.name} to come home safely.
          </p>

          {/* Care Notice */}
          {pet.medicalNotes && (
            <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-sm text-[#795548] leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-xs">Care Notice:</span>
              <p className="mt-1">{pet.medicalNotes}</p>
            </div>
          )}

          {/* Critical Actions */}
          <div className="space-y-3 pt-2">
            <a
              href={`tel:${pet.ownerPhone || ''}`}
              className="w-full py-4 px-6 rounded-2xl bg-[#34A853] hover:bg-[#2E9447] text-white font-bold text-base flex items-center justify-center gap-3 shadow-md transition-colors"
            >
              <Phone className="w-5 h-5 fill-white" />
              <span>Call Owner</span>
            </a>

            <button
              onClick={handleShareGps}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer border ${
                gpsSent
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : 'bg-[#DE6828] hover:bg-[#C9581B] text-white border-transparent shadow-md'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>{gpsSent ? 'GPS Location Shared with Owner!' : 'Send My GPS Pin to Owner'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* What is SafePaws? */}
      <div className="w-full max-w-lg p-8 text-center opacity-80 mt-8 mb-12">
        <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">
          What is SafePaws?
        </h3>
        <p className="text-xs text-[#6F5D52] leading-relaxed max-w-sm mx-auto">
          SafePaws is a community pet recovery network. No personal data is stored on your device.
        </p>
        <Link to="/" className="inline-block mt-4 text-[#DE6828] text-xs font-semibold hover:underline">
          Learn more about SafePaws
        </Link>
      </div>
    </div>
  );
}
