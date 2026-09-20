import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { Pet } from '../types';
import { ApiClient } from '../utils/apiClient';
import { usePetStore } from '../store/petStore';

export default function PublicTagProfile() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationSending, setLocationSending] = useState(false);
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-[3px] border-[var(--color-marigold)] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="font-serif text-[24px] text-[var(--color-ink)] mb-2">Accessing Record...</h2>
        <p className="text-[var(--color-trail)] text-[15px] max-w-xs text-center leading-relaxed">Securely retrieving the identity profile for this SafePaws tag.</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[var(--color-surface)] p-10 max-w-md w-full border border-[var(--color-border)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-alert-clay)]/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-[var(--color-alert-clay)]" />
          </div>
          <h2 className="font-serif text-[28px] text-[var(--color-ink)] mb-3">{error || 'Unknown Tag'}</h2>
          <p className="text-[var(--color-trail)] text-[15px] leading-relaxed mb-8">
            This SafePaws tag does not exist or has been unregistered. If you found a pet, please contact your local shelter.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full h-14 rounded-none bg-[var(--color-ink)] hover:bg-[#2A2723] text-white font-semibold text-[15px] uppercase tracking-widest transition-colors focus:outline-none"
          >
            Return to SafePaws
          </button>
        </div>
      </div>
    );
  }

  const isLost = pet.status === 'lost';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] font-sans text-[var(--color-ink)] pb-24">
      
      {/* Minimal Header */}
      <header className="py-8 px-6 flex justify-center">
        <div className="font-serif text-[20px] tracking-tight font-bold text-[var(--color-marigold)]">SafePaws</div>
      </header>

      <main className="max-w-[720px] mx-auto px-6">
        
        {/* Main Content Area */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
          
          {/* Photo */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[var(--color-border)]">
            <img
              src={pet.photoUrl}
              alt={`Photo of ${pet.name}`}
              className="w-full h-full object-cover grayscale-[0.1]"
              referrerPolicy="no-referrer"
            />
            {isLost && (
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-alert-clay)] text-white text-[12px] font-bold uppercase tracking-widest shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                  Reported Missing
                </span>
              </div>
            )}
          </div>
          
          <div className="p-8 sm:p-12">
            
            {/* Identity Header */}
            <div className="text-center mb-12">
              <h1 className="font-serif text-[48px] sm:text-[56px] leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] mb-3">
                I am {pet.name}
              </h1>
              <p className="text-[18px] text-[var(--color-trail)] font-serif italic">
                {pet.breed} {pet.color ? `· ${pet.color}` : ''}
              </p>
            </div>

            {/* Emergency Notice */}
            {isLost && (
              <div className="mb-12 p-8 border-2 border-[var(--color-alert-clay)] bg-white text-center">
                <AlertCircle className="w-8 h-8 text-[var(--color-alert-clay)] mx-auto mb-4" />
                <h3 className="font-serif text-[28px] text-[var(--color-alert-clay)] leading-tight mb-3">Please Help Me Get Home</h3>
                <p className="text-[16px] text-[var(--color-ink)] leading-relaxed max-w-sm mx-auto font-medium">
                  My family is urgently looking for me. If you've found me, please contact them immediately.
                </p>
              </div>
            )}

            {/* Medical Notes */}
            {pet.medicalNotes && (
              <div className="mb-12 border-l-4 border-[var(--color-alert-clay)] bg-[var(--color-bone)] p-6">
                <h3 className="text-[11px] font-bold text-[var(--color-alert-clay)] uppercase tracking-[0.2em] mb-2">
                  Critical Medical Notes
                </h3>
                <p className="text-[16px] text-[var(--color-ink)] leading-relaxed font-medium">
                  {pet.medicalNotes}
                </p>
              </div>
            )}

            {/* Quiet Info */}
            <div className="mb-12 flex flex-col sm:flex-row gap-8 justify-center border-y border-[var(--color-border)] py-8">
              <div className="flex flex-col items-center text-center">
                <MapPin className="w-5 h-5 text-[var(--color-trail)] mb-2 opacity-50" />
                <span className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-1">Neighborhood</span>
                <span className="text-[15px] font-medium text-[var(--color-ink)]">{pet.neighborhood || 'Unknown'}</span>
              </div>
              <div className="hidden sm:block w-px h-full bg-[var(--color-border)]" />
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-[var(--color-success)] mb-2 opacity-50" />
                <span className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-1">Tag ID</span>
                <span className="text-[15px] font-medium text-[var(--color-ink)] font-mono tracking-tight">{pet.qrTagId}-BIO</span>
              </div>
            </div>

            {/* Discoverable Actions (>=44px touch targets) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${pet.ownerPhone}`}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--color-ink)] text-white font-bold tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-2"
                >
                  <Phone size={20} />
                  Call Owner
                </a>
                
                <button
                  onClick={async () => {
                    setActionError('');
                    setSuccessMessage('');
                    if (!navigator.geolocation) {
                      setActionError('Geolocation is not supported by your browser.');
                      return;
                    }
                    setLocationSending(true);
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        try {
                          const { latitude, longitude } = position.coords;
                          const activeAlert = usePetStore.getState().alerts.find(a => a.petId === pet.id && a.status === 'active');
                          await ApiClient.reportSighting({
                            reporterName: 'Anonymous Finder (Tag Scan)',
                            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                            notes: `Direct location ping from tag ID: ${pet.qrTagId}`,
                            alertId: activeAlert?.id
                          });
                          setSuccessMessage('Location successfully securely transmitted to the owner!');
                        } catch (err) {
                          setActionError('Failed to send location. Please try calling the owner.');
                        } finally {
                          setLocationSending(false);
                        }
                      },
                      () => {
                        setActionError('Unable to retrieve your location. Please check your device permissions.');
                        setLocationSending(false);
                      }
                    );
                  }}
                  disabled={locationSending}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-[var(--color-ink)] font-bold tracking-wide border-2 border-[var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapPin size={20} />
                  {locationSending ? 'Sending...' : 'Send Location Ping'}
                </button>
              </div>

              {actionError && (
                <div className="p-4 bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] text-sm text-center font-medium">
                  {actionError}
                </div>
              )}

              {successMessage && (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-sm text-center font-medium">
                  {successMessage}
                </div>
              )}
            </div>
            
          </div>
        </div>
        
        <div className="text-center mt-8 text-[var(--color-trail)] text-[12px] uppercase tracking-[0.2em] font-medium">
          Secured by SafePaws
        </div>
      </main>
    </div>
  );
}
