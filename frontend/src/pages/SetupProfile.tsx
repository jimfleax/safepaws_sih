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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] text-[#241812]">
      <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full relative z-10">
        <button 
          onClick={handleLogout} 
          className="absolute top-4 right-4 text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
        >
          Logout
        </button>
        {step === 1 ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FDF8F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-[#DE6828]" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Set Your Location</h1>
            <p className="mb-8 text-[#6B5E55]">
              We need your location to show you pets missing and found in your neighborhood.
            </p>
            
            <button 
              onClick={requestLocation}
              disabled={locationLoading}
              className="w-full flex items-center justify-center gap-2 py-3 mb-3 bg-[#DE6828] text-white rounded-xl font-medium hover:bg-[#C95A20] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {locationLoading ? (
                'Getting Location...'
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
              className="w-full py-3 text-[#6B5E55] hover:text-[#241812] transition-colors font-medium disabled:opacity-50 cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Setup Your Profile</h1>
            <p className="mb-6 text-[#6B5E55]">Please provide your contact details to help coordinate pet rescues in your neighborhood.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E8DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE6828]" 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Neighborhood *</label>
                <input 
                  type="text" 
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E8DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE6828]" 
                  placeholder="e.g. Oakridge Park"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-4 bg-[#DE6828] text-white rounded-xl font-medium hover:bg-[#C95A20] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
