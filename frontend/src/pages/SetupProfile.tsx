import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { MapPin, Navigation, Phone, ArrowRight } from 'lucide-react';

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
      navigate('/pets/new');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bone)] text-[var(--color-ink)] p-6 relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-marigold)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-success)]/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="absolute top-8 left-8">
        <div className="font-serif text-[24px] tracking-tight font-bold text-[var(--color-marigold)]">SafePaws</div>
      </header>
      
      <button 
        onClick={handleLogout} 
        className="absolute top-8 right-8 text-[13px] font-bold tracking-wider uppercase text-[var(--color-trail)] hover:text-[var(--color-ink)] transition-colors"
      >
        Sign Out
      </button>

      <div className="w-full max-w-[440px]">
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8 px-4">
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-border)]'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-border)]'}`} />
        </div>

        <div className="bg-white rounded-[2rem] p-10 sm:p-12 shadow-[0_8px_30px_rgba(28,26,23,0.04)] border border-[var(--color-border)] relative z-10 text-center">
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-[var(--color-bone)] rounded-full flex items-center justify-center mx-auto mb-8">
                <Navigation className="w-8 h-8 text-[var(--color-marigold)]" />
              </div>
              <h1 className="font-serif text-[36px] leading-tight text-[var(--color-ink)] mb-4">Set Location</h1>
              <p className="text-[var(--color-trail)] text-[15px] leading-relaxed mb-10 max-w-sm mx-auto">
                SafePaws relies on local community alerts. We need your neighborhood to accurately map sightings and broadcast alerts.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={requestLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-marigold)] hover:opacity-90 text-white rounded-full font-semibold text-[15px] transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_var(--color-accent)] disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {locationLoading ? 'Locating...' : 'Enable Auto-Location'}
                </button>
                <button 
                  onClick={() => setStep(2)}
                  disabled={locationLoading}
                  className="w-full py-4 text-[var(--color-trail)] hover:text-[var(--color-ink)] transition-colors font-semibold text-[15px] disabled:opacity-50"
                >
                  Enter manually instead
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 text-left">
              <h1 className="font-serif text-[36px] leading-tight text-[var(--color-ink)] mb-3 text-center">Contact Info</h1>
              <p className="text-[var(--color-trail)] text-[15px] mb-8 leading-relaxed">
                Provide your emergency contact details so the community can reach you instantly.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-[1rem] bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm font-medium">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-trail)] uppercase tracking-[0.12em] mb-2 flex items-center gap-2">
                    <Phone size={14} /> Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-4 border border-[var(--color-border)] bg-[var(--color-bone)] text-[var(--color-ink)] text-[15px] rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] transition-all" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[var(--color-trail)] uppercase tracking-[0.12em] mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Neighborhood *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-5 py-4 border border-[var(--color-border)] bg-[var(--color-bone)] text-[var(--color-ink)] text-[15px] rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] transition-all" 
                    placeholder="e.g. Oakridge Park"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-ink)] hover:bg-[var(--color-ink-soft)] text-white rounded-full font-semibold text-[15px] shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? 'Saving...' : 'Complete Profile'}
                    {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
