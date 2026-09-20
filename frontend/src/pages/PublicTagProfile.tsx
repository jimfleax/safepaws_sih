import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { Pet } from '../types';
import { ApiClient } from '../utils/apiClient';

export default function PublicTagProfile() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationSending, setLocationSending] = useState(false);

  useEffect(() => {
    async function fetchTag() {
      if (!tagId) return;
      try {
        const fetchedPet = await ApiClient.getPetByTag(tagId);
        setPet(fetchedPet);
      } catch (err: any) {
        setError(err.message || 'Failed to load pet tag');
      } finally {
        setLoading(false);
      }
    }
    fetchTag();
  }, [tagId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E7] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#E2811F] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="font-serif text-[24px] text-[#1C1A17] mb-2">Locating Profile...</h2>
        <p className="text-[#63684B] text-[15px] max-w-xs text-center leading-relaxed">Securely retrieving the biometric and contact record for this SafePaws tag.</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F6F1E7] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#E5E0D8] max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-[#B3452F]/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-[#B3452F]" />
          </div>
          <h2 className="font-serif text-[28px] text-[#1C1A17] mb-3">{error || 'Unknown Tag'}</h2>
          <p className="text-[#63684B] text-[15px] leading-relaxed mb-8">
            This SafePaws tag does not exist or has been unregistered. If you found a pet, please contact your local shelter.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 px-6 rounded-full bg-[#1C1A17] hover:bg-[#2A2723] text-white font-semibold text-[15px] shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            Return to SafePaws
          </button>
        </div>
      </div>
    );
  }

  const isLost = pet.status === 'lost';

  return (
    <div className="min-h-screen bg-[#F6F1E7] pb-32 font-sans text-[#1C1A17]">
      
      {/* Minimal Header */}
      <header className="py-6 px-6 sm:px-8 max-w-2xl mx-auto flex justify-center">
        <div className="font-serif text-[24px] tracking-tight font-bold text-[#E2811F]">SafePaws</div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#E5E0D8]">
          
          {/* Hero Image */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[#E5E0D8]">
            <img
              src={pet.photoUrl}
              alt={`Photo of ${pet.name}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1A17]/30 via-transparent to-[#1C1A17]/40 pointer-events-none" />
            
            {isLost && (
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-[0.08em] shadow-md backdrop-blur-md bg-[#B3452F]/90 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB4A3]" />
                  Reported Missing
                </span>
              </div>
            )}
          </div>
          
          <div className="p-8 sm:p-10">
            {/* Identity Header */}
            <div className="text-center mb-10">
              <h1 className="font-serif text-[42px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[#1C1A17] mb-2">
                I am {pet.name}
              </h1>
              <p className="text-[18px] text-[#63684B]">
                {pet.breed} {pet.color ? `· ${pet.color}` : ''}
              </p>
            </div>

            {/* Emergency Lost Banner */}
            {isLost && (
              <div className="mb-10 p-6 bg-[#B3452F]/10 border border-[#B3452F]/20 rounded-[1.5rem] text-center">
                <AlertCircle className="w-8 h-8 text-[#B3452F] mx-auto mb-3" />
                <h3 className="font-serif text-[24px] text-[#B3452F] leading-tight mb-2">Please Help Me Get Home</h3>
                <p className="text-[15px] text-[#1C1A17] leading-relaxed max-w-sm mx-auto">
                  My family is urgently looking for me. If you've found me, please contact them immediately using the information below.
                </p>
              </div>
            )}

            <div className="space-y-10">
              
              {/* Primary Contact Action */}
              <div>
                <h3 className="text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-4 flex items-center justify-center gap-2">
                  <span className="w-3 h-px bg-[#63684B]" />
                  Owner Contact
                  <span className="w-3 h-px bg-[#63684B]" />
                </h3>
                <a 
                  href={`tel:${pet.ownerPhone}`} 
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#F6F1E7] hover:bg-[#E5E0D8] p-6 rounded-[1.5rem] border border-[#E5E0D8] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-[#E2811F]" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-[13px] text-[#63684B] mb-0.5">Call Primary Contact</div>
                    <div className="font-serif text-[24px] text-[#1C1A17] tracking-tight">{pet.ownerPhone}</div>
                  </div>
                </a>
              </div>

              {/* Medical Alert */}
              {pet.medicalNotes && (
                <div>
                  <h3 className="text-[12px] font-bold text-[#B3452F] uppercase tracking-[0.12em] mb-3 text-center">
                    Critical Medical Notes
                  </h3>
                  <div className="bg-white border-2 border-[#B3452F]/20 p-5 rounded-[1.25rem] text-[15px] text-[#1C1A17] leading-relaxed text-center shadow-sm">
                    {pet.medicalNotes}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-[#F6F1E7]/50 p-5 rounded-[1.25rem] border border-[#E5E0D8]">
                  <MapPin className="w-5 h-5 text-[#E2811F] shrink-0" />
                  <div>
                    <div className="text-[12px] font-bold text-[#63684B] uppercase tracking-wider mb-0.5">Neighborhood</div>
                    <div className="text-[15px] font-medium text-[#1C1A17]">{pet.neighborhood || 'Not provided'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#F6F1E7]/50 p-5 rounded-[1.25rem] border border-[#E5E0D8]">
                  <ShieldCheck className="w-5 h-5 text-[#4C7A52] shrink-0" />
                  <div>
                    <div className="text-[12px] font-bold text-[#63684B] uppercase tracking-wider mb-0.5">Registration</div>
                    <div className="text-[15px] font-medium text-[#1C1A17] font-mono tracking-tight">{pet.qrTagId}-BIO</div>
                  </div>
                </div>
              </div>
              
              {/* Actions Footer */}
              <div className="pt-8 border-t border-[#E5E0D8] space-y-4">
                <a
                  href={`tel:${pet.ownerPhone}`}
                  className="w-full py-4 px-6 rounded-full bg-[#E2811F] hover:bg-[#CA721A] text-white font-semibold text-[15px] shadow-[0_4px_14px_rgba(226,129,31,0.25)] transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Owner Directly
                </a>
                
                <button
                  onClick={async () => {
                    if (!navigator.geolocation) {
                      alert('Geolocation is not supported by your browser.');
                      return;
                    }
                    setLocationSending(true);
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        try {
                          const { latitude, longitude } = position.coords;
                          await ApiClient.reportSighting({
                            reporterName: 'Anonymous Finder (Tag Scan)',
                            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                            notes: `Direct location ping from tag ID: ${pet.qrTagId}`
                          });
                          alert('Location successfully securely transmitted to the owner!');
                        } catch (err) {
                          alert('Failed to send location. Please try calling the owner.');
                        } finally {
                          setLocationSending(false);
                        }
                      },
                      () => {
                        alert('Unable to retrieve your location. Please check your device permissions.');
                        setLocationSending(false);
                      }
                    );
                  }}
                  disabled={locationSending}
                  className="w-full py-4 px-6 rounded-full bg-[#1C1A17] hover:bg-[#2A2723] text-white font-semibold text-[15px] shadow-sm transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <MapPin className="w-5 h-5 text-[#F6F1E7]" />
                  {locationSending ? 'Sending Location...' : 'Send My Location'}
                </button>
              </div>

            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pb-8 text-[#63684B] text-[13px]">
          Secured by SafePaws Identity Network
        </div>
      </main>
    </div>
  );
}
