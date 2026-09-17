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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout failed:', e);
    }
    logout();
  };

  const requestLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setStep(2);
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            const addr = data.address;
            const placeName = addr.neighbourhood || addr.suburb || addr.city_district || addr.city || addr.town || addr.village || '';
            if (placeName) {
              setNeighborhood(placeName);
            }
          }
        } catch (error) {
          console.error("Failed to fetch address:", error);
        } finally {
          setLocationLoading(false);
          setStep(2);
        }
      },
      (error) => {
        console.error("Location error:", error);
        setLocationLoading(false);
        setStep(2);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !neighborhood) return;
    setLoading(true);

    try {
      const res = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ phone, neighborhood }),
      });

      if (res.ok) {
        setProfileCompleted(true);
        navigate('/');
      } else {
        console.error('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F1E7] text-[#1C1A17] p-6 relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E2811F]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4C7A52]/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="absolute top-8 left-8">
        <div className="font-serif text-[24px] tracking-tight font-bold text-[#E2811F]">SafePaws</div>
      </header>
      
      <button 
        onClick={handleLogout} 
        className="absolute top-8 right-8 text-[13px] font-bold tracking-wider uppercase text-[#63684B] hover:text-[#1C1A17] transition-colors"
      >
        Sign Out
      </button>

      <div className="w-full max-w-[440px]">
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8 px-4">
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[#1C1A17]' : 'bg-[#E5E0D8]'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[#1C1A17]' : 'bg-[#E5E0D8]'}`} />
        </div>

        <div className="bg-white rounded-[2rem] p-10 sm:p-12 shadow-[0_8px_30px_rgba(28,26,23,0.04)] border border-[#E5E0D8] relative z-10 text-center">
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-[#F6F1E7] rounded-full flex items-center justify-center mx-auto mb-8">
                <Navigation className="w-8 h-8 text-[#E2811F]" />
              </div>
              <h1 className="font-serif text-[36px] leading-tight text-[#1C1A17] mb-4">Set Location</h1>
              <p className="text-[#63684B] text-[15px] leading-relaxed mb-10 max-w-sm mx-auto">
                SafePaws relies on local community alerts. We need your neighborhood to accurately map sightings and broadcast alerts.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={requestLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#E2811F] hover:bg-[#CA721A] text-white rounded-full font-semibold text-[15px] transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(226,129,31,0.25)] disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {locationLoading ? 'Locating...' : 'Enable Auto-Location'}
                </button>
                <button 
                  onClick={() => setStep(2)}
                  disabled={locationLoading}
                  className="w-full py-4 text-[#63684B] hover:text-[#1C1A17] transition-colors font-semibold text-[15px] disabled:opacity-50"
                >
                  Enter manually instead
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 text-left">
              <h1 className="font-serif text-[36px] leading-tight text-[#1C1A17] mb-3 text-center">Contact Info</h1>
              <p className="text-[#63684B] text-[15px] leading-relaxed mb-8 text-center">
                Provide your emergency contact details so the community can reach you instantly.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2 flex items-center gap-2">
                    <Phone size={14} /> Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-4 border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Neighborhood *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-5 py-4 border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all" 
                    placeholder="e.g. Oakridge Park"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 py-4 bg-[#1C1A17] hover:bg-[#2A2723] text-white rounded-full font-semibold text-[15px] shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
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
