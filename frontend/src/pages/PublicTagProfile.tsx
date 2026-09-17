import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Phone, AlertCircle } from 'lucide-react';
import { Pet } from '../types';
import { ApiClient } from '../utils/apiClient';

export default function PublicTagProfile() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTag() {
      if (!tagId) return;
      try {
        // We assume tagId corresponds to a pet ID or the backend handles resolving it via this route
        const fetchedPet = await ApiClient.getPet(tagId);
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
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-[#6F5D52]">Loading pet profile...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-[#241812]">{error || 'Pet not found'}</h2>
          <p className="mt-2 text-[#6F5D52]">This tag might be invalid or unregistered.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 text-[#DE6828] hover:underline"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-24">
      {/* Basic header */}
      <header className="bg-white border-b border-[#E9DCcb] p-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#DE6828]">SafePaws</h1>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E9DCcb]">
          <div className="w-full h-64 relative bg-[#241812]">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {pet.status === 'lost' && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase rounded-full shadow-sm">
                Reported Lost
              </div>
            )}
          </div>
          
          <div className="p-8">
            <h1 className="font-serif text-3xl font-bold text-[#241812] text-center mb-1">
              I am {pet.name}
            </h1>
            <p className="text-[#6F5D52] font-medium text-center text-lg mb-6">
              {pet.breed} {pet.color ? `· ${pet.color}` : ''}
            </p>

            {pet.status === 'lost' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="text-red-800 font-bold mb-1">Please Help Me Get Home!</h3>
                <p className="text-sm text-red-700">
                  My family is looking for me. If you found me, please contact them immediately.
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-3">Owner Contact</h3>
                <div className="flex items-center gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#E9DCcb]">
                  <Phone className="w-5 h-5 text-[#DE6828]" />
                  <a href={`tel:${pet.ownerPhone}`} className="text-[#241812] font-bold text-lg hover:underline">
                    {pet.ownerPhone}
                  </a>
                </div>
              </div>

              {pet.medicalNotes && (
                <div>
                  <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">Important Medical Notes</h3>
                  <div className="text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-100">
                    {pet.medicalNotes}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">More Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#DE6828] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#241812]">
                      <div className="font-medium">Neighborhood</div>
                      <div className="text-[#6F5D52]">{pet.neighborhood || 'Unknown'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#34A853] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#241812]">
                      <div className="font-medium">Verified Registration</div>
                      <div className="text-[#6F5D52]">Tag ID: {pet.qrTagId}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-6">
                <a
                  href={`tel:${pet.ownerPhone}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#241812] hover:bg-[#1A110D] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  Call Owner
                </a>
                
                <button
                  onClick={async () => {
                    if (!navigator.geolocation) {
                      alert('Geolocation is not supported by your browser');
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        try {
                          const { latitude, longitude } = position.coords;
                          await ApiClient.reportSighting({
                            reporterName: 'Anonymous Finder',
                            location: `${latitude}, ${longitude}`,
                            notes: `Direct location ping from tag ID: ${pet.qrTagId}`
                          });
                          alert('Location successfully sent to the owner!');
                        } catch (err) {
                          alert('Failed to send location. Please try calling the owner.');
                        }
                      },
                      () => {
                        alert('Unable to retrieve your location. Please check your permissions.');
                      }
                    );
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#DE6828] hover:bg-[#C9581B] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-5 h-5" />
                  Send My Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
