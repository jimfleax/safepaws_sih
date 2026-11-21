import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MapPin, Navigation, Phone, ArrowRight, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

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
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please enter manually.');
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
          console.warn('Reverse geocoding unavailable; entering manually', e);
        } finally {
          setStep(2);
          setLocationLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or timed out', err);
        setStep(2);
        setLocationLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    const cleanNeighborhood = neighborhood.trim();

    if (!cleanPhone || !cleanNeighborhood) {
      setError('Please provide both your recovery phone number and neighborhood.');
      return;
    }

    if (cleanPhone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number with area code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, neighborhood: cleanNeighborhood }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile record');
      }
      
      const updatedUser = await response.json();
      
      useAuthStore.getState().updateProfile({ 
        phone: updatedUser.phone, 
        neighborhood: updatedUser.neighborhood 
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bone)] text-[var(--color-ink)] p-6 relative">
      <header className="absolute top-8 left-8">
        <div className="font-serif text-[28px] tracking-tight font-bold text-[var(--color-ink)]">
          SafePaws
        </div>
      </header>
      
      <button 
        type="button"
        onClick={handleLogout} 
        className="absolute top-8 right-8 text-xs font-bold tracking-widest uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[44px] min-w-[44px] px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] cursor-pointer"
      >
        Sign Out
      </button>

      <main className="w-full max-w-xl bg-white border border-[var(--color-border)] rounded-[var(--radius-28)] p-8 sm:p-14 shadow-sm relative z-10">
        
        {/* Step Progress indicators */}
        <div className="flex items-center gap-3 mb-12" aria-hidden="true">
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-border)]'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-border)]'}`} />
        </div>
        
        {step === 1 ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto mb-8 text-[var(--color-accent-text)]">
              <Navigation className="w-8 h-8" />
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[var(--color-ink)] mb-4 tracking-tight">
              Operational Zone
            </h1>
            
            <p className="text-[var(--color-ink-soft)] text-base leading-relaxed mb-10 max-w-md mx-auto">
              SafePaws protects companions by neighborhood. Your approximate zone routes local sighting telemetry and broadcasts recovery alerts only to relevant nearby guardians.
            </p>
            
            <div className="space-y-3 flex flex-col items-center w-full max-w-sm mx-auto">
              <button 
                type="button"
                onClick={requestLocation}
                disabled={locationLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[var(--color-ink)] hover:bg-[var(--color-surface-dark-raised)] text-white font-bold text-xs uppercase tracking-widest transition-all rounded-full disabled:opacity-60 min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] cursor-pointer"
              >
                {locationLoading ? 'Detecting Local Zone...' : 'Detect Approximate Zone'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(2)}
                disabled={locationLoading}
                className="w-full py-3.5 px-6 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)] rounded-full transition-colors font-bold text-xs uppercase tracking-widest min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] cursor-pointer"
              >
                Enter Neighborhood Manually
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-10 border-b border-[var(--color-border)] pb-6 flex items-start justify-between">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-2 tracking-tight">
                  Emergency Contact
                </h1>
                <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed">
                  Provide your primary recovery phone and neighborhood to finalize guardian protection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] py-1 px-2 rounded min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] shrink-0"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            {error && (
              <div role="alert" className="mb-6 p-4 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] text-xs font-semibold rounded-r-lg flex items-center gap-2">
                <AlertCircle size={16} className="text-[var(--color-alert-clay)] shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="setup-phone" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} /> Recovery Phone Number *
                </label>
                <input 
                  id="setup-phone"
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/30" 
                />
                <p className="text-[11px] text-[var(--color-ink-soft)] leading-tight">
                  Protected: Phone numbers are withheld from public collar tag scans by default.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="setup-neighborhood" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> Operational Neighborhood *
                </label>
                <input 
                  id="setup-neighborhood"
                  type="text" 
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Oakridge Park"
                  className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xl font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/30" 
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading || !phone.trim() || !neighborhood.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[var(--color-ink)] hover:bg-[var(--color-surface-dark-raised)] text-white font-bold text-xs uppercase tracking-widest transition-all rounded-full disabled:opacity-40 min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] cursor-pointer"
                >
                  {loading ? (
                    'Securing Profile Record...'
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Activate Guardian Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
