import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Info,
  Clock
} from 'lucide-react';
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 border-[3px] border-[var(--color-marigold)] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="font-serif text-3xl font-bold text-[var(--color-ink)] mb-2">Accessing Collar Record...</h2>
        <p className="text-[var(--color-ink-soft)] text-sm max-w-sm leading-relaxed font-light">
          Securely retrieving the public identity profile for this SafePaws tag.
        </p>
      </div>
    );
  }

  // Error / Invalid / Unknown Tag State
  if (!pet) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 sm:p-12 max-w-lg w-full border border-[var(--color-border)] rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[var(--color-ink)] mb-3">
            {error || 'Tag Record Not Found'}
          </h2>
          <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed mb-8 font-light">
            This SafePaws tag does not exist, has been retired, or the identifier is invalid. If you have found a wandering companion, you can still report a sighting directly to our community network.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/sightings/new"
              className="w-full py-4 px-6 rounded-xl bg-[var(--color-marigold)] hover:bg-[#D97706] text-[var(--color-ink)] font-bold text-sm uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-marigold)] min-h-[44px] flex items-center justify-center shadow-md"
            >
              Log a General Sighting
            </Link>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 px-6 rounded-xl bg-[var(--color-ink)] hover:bg-[#2A2723] text-white font-bold text-sm uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-ink)] min-h-[44px]"
            >
              Return to SafePaws
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLost = pet.status === 'lost';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] font-sans text-[var(--color-ink)] pb-24">
      
      {/* Top Navigation & Brand Header */}
      <header className="py-6 px-6 max-w-3xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[44px] min-w-[44px] py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SafePaws Network</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-[var(--color-border)] text-[11px] font-mono tracking-widest text-[var(--color-ink-soft)] uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>VERIFIED TAG // {pet.qrTagId}-BIO</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        
        {/* Main Pet Identity Card */}
        <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl animate-in fade-in duration-500">
          
          {/* Pet Photo Container with Emergency Banner */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[var(--color-surface)] overflow-hidden">
            {pet.photoUrl ? (
              <img
                src={pet.photoUrl}
                alt={`Photo of ${pet.name}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-surface)] text-[var(--color-ink-soft)]">
                <Heart className="w-16 h-16 opacity-30 mb-2" />
                <span className="text-sm font-serif italic">No profile photo registered</span>
              </div>
            )}

            {/* Emergency Missing Badge */}
            {isLost && (
              <div className="absolute top-6 left-6 z-10">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-alert-clay)] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Reported Missing Companion
                </span>
              </div>
            )}
          </div>
          
          <div className="p-8 sm:p-10">
            
            {/* Identity Headline */}
            <div className="text-center mb-8">
              <span className="text-xs font-mono font-medium tracking-widest text-[var(--color-marigold)] uppercase block mb-1">
                COMPANION IDENTITY
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-ink)] mb-2">
                I am {pet.name}
              </h1>
              <p className="text-lg text-[var(--color-ink-soft)] font-serif italic mb-3">
                {pet.breed || 'Canine Companion'} {pet.color ? `· ${pet.color}` : ''}
              </p>
              {pet.distinctiveFeatures && pet.distinctiveFeatures.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {pet.distinctiveFeatures.map((feature, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Guidance Banner */}
            {isLost && (
              <div className="mb-8 p-6 rounded-2xl border-2 border-[var(--color-alert-clay)] bg-[var(--color-alert-clay)]/5 text-center">
                <AlertCircle className="w-8 h-8 text-[var(--color-alert-clay)] mx-auto mb-3" />
                <h3 className="font-serif text-2xl font-bold text-[var(--color-alert-clay)] leading-tight mb-2">
                  My Family is Actively Searching
                </h3>
                <p className="text-sm text-[var(--color-ink)] leading-relaxed max-w-md mx-auto font-medium">
                  I have been reported missing. If I am in your sight, please transmit an immediate location ping or file an emergency observation report below.
                </p>
              </div>
            )}

            {/* Critical Medical Notes */}
            {pet.medicalNotes && (
              <div className="mb-8 p-5 rounded-2xl border border-[var(--color-alert-clay)]/30 bg-[var(--color-alert-clay)]/5">
                <div className="flex items-center gap-2 text-[var(--color-alert-clay)] font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Critical Care & Medical Notes</span>
                </div>
                <p className="text-sm text-[var(--color-ink)] leading-relaxed font-medium">
                  {pet.medicalNotes}
                </p>
              </div>
            )}

            {/* Key Identity Attributes */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-[var(--color-border)] py-6">
              <div className="flex flex-col items-center text-center">
                <MapPin className="w-4 h-4 text-[var(--color-ink-soft)] mb-1.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink-soft)]">Home Area</span>
                <span className="text-sm font-semibold text-[var(--color-ink)] mt-0.5">{pet.neighborhood || 'Local Community'}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink-soft)]">Collar ID</span>
                <span className="text-sm font-mono font-bold text-[var(--color-ink)] mt-0.5">{pet.qrTagId}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center">
                <Heart className="w-4 h-4 text-[var(--color-marigold)] mb-1.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink-soft)]">Species</span>
                <span className="text-sm font-semibold text-[var(--color-ink)] capitalize mt-0.5">{pet.species || 'Dog'}</span>
              </div>
            </div>

            {/* Privacy Protection Notice (SD-01 Invariant) */}
            <div className="mb-8 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-ink-soft)] flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[var(--color-ink)] mb-0.5">Guardian Contact Protected</p>
                <p className="leading-relaxed">
                  Personal phone numbers and contact details are withheld from public tag displays to protect guardian privacy. You can safely transmit a real-time location ping or file a detailed sighting report into the SafePaws recovery database.
                </p>
              </div>
            </div>

            {/* Primary Action Stack */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Action 1: Instant Location Ping */}
                <button
                  type="button"
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
                          setSuccessMessage('Coordinates transmitted! Your location ping was logged to the SafePaws network.');
                        } catch (err: any) {
                          setActionError('Failed to record location ping. Please file a sighting report below.');
                        } finally {
                          setLocationSending(false);
                        }
                      },
                      () => {
                        setActionError('Unable to access location. Please check device permissions or file a sighting report.');
                        setLocationSending(false);
                      }
                    );
                  }}
                  disabled={locationSending}
                  className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[var(--color-ink)] text-white font-bold text-sm tracking-wide transition-all hover:bg-[#2A2723] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-2 disabled:opacity-50 min-h-[44px] shadow-md cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[var(--color-marigold)]" />
                  <span>{locationSending ? 'Transmitting...' : 'Send Location Ping'}</span>
                </button>

                {/* Action 2: Detailed Sighting Report */}
                <button
                  type="button"
                  onClick={() => {
                    const activeAlert = usePetStore.getState().alerts.find(a => a.petId === pet.id && a.status === 'active');
                    if (activeAlert) {
                      navigate(`/sightings/new?alertId=${activeAlert.id}`);
                    } else {
                      navigate('/sightings/new');
                    }
                  }}
                  className={`flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] cursor-pointer shadow-md ${
                    isLost
                      ? 'bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white focus:ring-[var(--color-alert-clay)]'
                      : 'bg-white hover:bg-[var(--color-surface)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] focus:ring-[var(--color-ink)]'
                  }`}
                >
                  {isLost ? <AlertCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span>{isLost ? 'Emergency Sighting Report' : 'File Sighting Report'}</span>
                </button>
              </div>

              {/* Status & Feedback Alerts */}
              {actionError && (
                <div className="p-4 rounded-xl bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] text-xs text-center font-medium border border-[var(--color-alert-clay)]/20 animate-in fade-in">
                  {actionError}
                </div>
              )}

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center font-medium border border-emerald-200 animate-in fade-in flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
            </div>

            {/* Compassionate Finder Guidance */}
            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-left">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[var(--color-marigold)]" />
                <span>Tips for Keeping This Pet Safe</span>
              </h4>
              <ul className="text-xs text-[var(--color-ink-soft)] space-y-1.5 list-disc pl-4 font-light leading-relaxed">
                <li>Offer fresh water in a shallow dish, but avoid unfamiliar foods.</li>
                <li>Keep the animal in a secure, enclosed space until guardian contact is established.</li>
                <li>If the pet appears injured, contact your nearest veterinarian or local animal hospital.</li>
              </ul>
            </div>
            
          </div>
        </div>
        
        {/* Footer Provenance */}
        <div className="text-center mt-8 text-[var(--color-ink-soft)] text-xs font-mono tracking-widest uppercase opacity-70">
          SECURED BY SAFEPAWS RECOVERY NETWORK
        </div>
      </main>
    </div>
  );
}