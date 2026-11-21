import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MapPin, Navigation, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const SetupProfile: React.FC = () => {
  const navigate = useNavigate();
  const { setProfileCompleted, logout } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  const requestLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setStep(2);
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            setNeighborhood(data.address?.suburb || data.address?.neighbourhood || data.address?.city || '');
          }
        } catch (e) {
          console.error('Failed to reverse geocode', e);
        } finally {
          setStep(2);
          setLocationLoading(false);
        }
      },
      () => {
        setStep(2);
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !neighborhood) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, neighborhood }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      
      useAuthStore.getState().updateProfile({ 
        phone: updatedUser.phone, 
        neighborhood: updatedUser.neighborhood 
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bone)] text-[var(--color-ink)] p-6 relative">
      <header className="absolute top-10 left-10">
        <div className="font-serif text-[28px] tracking-tight font-bold text-[var(--color-ink)]">SafePaws</div>
      </header>
      
      <button 
        onClick={handleLogout} 
        className="absolute top-10 right-10 text-[11px] font-bold tracking-widest uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
      >
        Sign Out
      </button>

      <div className="w-full max-w-2xl bg-white border border-[var(--color-ink)]/10 p-12 sm:p-20 shadow-sm relative z-10">
        
        {/* Progress indicator */}
        <div className="flex items-center gap-4 mb-16">
          <div className={`h-1 flex-1 transition-colors duration-300 ${step >= 1 ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-ink)]/10'}`} />
          <div className={`h-1 flex-1 transition-colors duration-300 ${step >= 2 ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-ink)]/10'}`} />
        </div>
        
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out text-center">
            <div className="w-24 h-24 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center mx-auto mb-10">
              <Navigation className="w-10 h-10 text-[var(--color-ink-soft)]" />
            </div>
            <h1 className="font-serif text-5xl font-bold text-[var(--color-ink)] mb-6 tracking-tight">Zone Identity</h1>
            <p className="text-[var(--color-ink-soft)] text-lg leading-relaxed mb-12 max-w-md mx-auto">
              SafePaws secures your neighborhood. We need your operational zone to accurately map sightings and broadcast local alerts.
            </p>
            
            <div className="space-y-4 flex flex-col items-center">
              <button 
                onClick={requestLocation}
                disabled={locationLoading}
                className="w-full max-w-sm flex items-center justify-center gap-2 py-5 bg-[var(--color-ink)] hover:bg-opacity-90 text-[var(--color-bone)] font-bold text-sm uppercase tracking-widest transition-colors disabled:opacity-70 shadow-sm"
              >
                {locationLoading ? 'Establishing Lock...' : 'Enable Auto-Location'}
              </button>
              <button 
                onClick={() => setStep(2)}
                disabled={locationLoading}
                className="w-full max-w-sm py-5 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 border-2 border-transparent transition-colors font-bold text-xs uppercase tracking-widest disabled:opacity-50"
              >
                Enter Manually Instead
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
            <div className="mb-12 border-b border-[var(--color-ink)]/10 pb-8 text-center sm:text-left">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[var(--color-ink)] mb-4 tracking-tight">Recovery Contact</h1>
              <p className="text-[var(--color-ink-soft)] text-lg leading-relaxed">
                Provide emergency contact details to complete your security profile.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-[var(--color-danger)]/10 border-l-4 border-[var(--color-danger)] text-[var(--color-ink)] text-sm font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                  <Phone size={16} /> Phone Number *
                </label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-3xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={16} /> Neighborhood *
                </label>
                <input 
                  type="text" 
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-3xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                  placeholder="e.g. Oakridge Park"
                />
              </div>
              
              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={loading || !phone || !neighborhood}
                  className="group w-full flex items-center justify-center gap-3 py-5 bg-[var(--color-ink)] hover:bg-opacity-90 text-[var(--color-bone)] font-bold text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    'Securing Profile...'
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Complete Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
