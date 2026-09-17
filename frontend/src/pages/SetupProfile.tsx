import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { MapPin, Navigation } from 'lucide-react';

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
            // Try to get a meaningful neighborhood/locality string
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
        setStep(2); // Proceed anyway if location denied
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
    <div className="min-h-screen flex items-center justify-center bg-[#F6F1E7] text-[#1C1A17] p-4 sm:p-6">
      <div className="p-8 sm:p-10 bg-white rounded-3xl shadow-sm border border-[#E5E0D8] max-w-md w-full relative z-10">
        <button 
          onClick={handleLogout} 
          className="absolute top-6 right-6 text-sm font-semibold text-[#8A8175] hover:text-[#1C1A17] transition-colors cursor-pointer"
        >
          Logout
        </button>
        {step === 1 ? (
          <div className="text-center pt-4">
            <div className="w-20 h-20 bg-[#F6F1E7] rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-[#E2811F]" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-3 text-[#1C1A17]">Set Your Location</h1>
            <p className="mb-10 text-[#63684B] leading-relaxed">
              We need your location to accurately map missing pets and sightings in your local neighborhood network.
            </p>
            
            <button 
              onClick={requestLocation}
              disabled={locationLoading}
              className="w-full flex items-center justify-center gap-2 py-4 mb-3 bg-[#E2811F] text-white rounded-xl font-bold text-sm hover:bg-[#C9721B] transition-colors disabled:opacity-50 shadow-md cursor-pointer"
            >
              {locationLoading ? (
                'Locating...'
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  Grant Location Access
                </>
              )}
            </button>
            <button 
              onClick={() => setStep(2)}
              disabled={locationLoading}
              className="w-full py-3 text-[#8A8175] hover:text-[#1C1A17] transition-colors font-medium text-sm disabled:opacity-50 cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        ) : (
          <div className="pt-4">
            <h1 className="font-serif text-3xl font-bold mb-3 text-[#1C1A17]">Profile Details</h1>
            <p className="mb-8 text-[#63684B] leading-relaxed">
              Provide your emergency contact details so finders can reach you instantly.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#8A8175] uppercase tracking-wider mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all" 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A8175] uppercase tracking-wider mb-2">Neighborhood *</label>
                <input 
                  type="text" 
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all" 
                  placeholder="e.g. Oakridge Park"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-8 bg-[#1C1A17] hover:bg-[#2A2723] text-white rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving Profile...' : 'Complete Profile Setup'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
