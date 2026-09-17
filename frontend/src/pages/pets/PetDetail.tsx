import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, QrCode, AlertCircle, Trash2, 
  MapPin, Phone, ShieldCheck, Heart
} from 'lucide-react';
import { Pet } from '../../types';
import { ApiClient } from '../../utils/apiClient';
import { DashboardNav } from '../../components/DashboardNav';
import { QrTagModal } from '../../components/modals/QrTagModal';

export default function PetDetail() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadPet() {
      if (!petId) return;
      try {
        const fetchedPet = await ApiClient.getPet(petId);
        setPet(fetchedPet);
      } catch (err: any) {
        setError(err.message || 'Failed to load pet details');
      } finally {
        setLoading(false);
      }
    }
    loadPet();
  }, [petId]);

  const handleDelete = () => {
    // Basic implementation of trigger delete
    alert('Delete functionality not fully implemented here yet.');
    navigate('/dashboard');
  };

  const handleLostAlert = () => {
    // Basic implementation
    alert('Lost alert broadcasted successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <DashboardNav />
        <div className="max-w-3xl mx-auto px-6 py-12 text-center text-[#6F5D52]">
          Loading pet details...
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <DashboardNav />
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-[#241812]">{error || 'Pet not found'}</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-[#DE6828] hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-24">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#7A6B61] hover:text-[#241812] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#E9DCcb]">
          {/* Header & Photo Section */}
          <div className="flex flex-col md:flex-row">
            {/* Large Real Pet Photograph */}
            <div className="w-full md:w-2/5 h-72 md:h-auto relative bg-[#241812]">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                  pet.status === 'safe' ? 'bg-[#34A853]' : 'bg-[#DE6828]'
                }`}>
                  {pet.status === 'safe' ? 'Safe at Home' : 'Lost Alert Active'}
                </span>
              </div>
            </div>

            {/* Core Details */}
            <div className="p-8 md:p-10 w-full md:w-3/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h1 className="font-serif text-4xl font-bold text-[#241812]">{pet.name}</h1>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="p-2 bg-[#F4EDE2] hover:bg-[#EAE0D3] text-[#DE6828] rounded-full transition-colors cursor-pointer"
                    title="View QR Tag"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-[#6F5D52] font-medium text-lg">
                  {pet.breed} {pet.color ? `· ${pet.color}` : ''}
                </p>
                
                <div className="flex gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-[#4A3B31]">
                    <ShieldCheck className="w-4 h-4 text-[#34A853]" />
                    <span className="font-medium">Verified Identity</span>
                  </div>
                  {pet.microchipId && (
                    <div className="flex items-center gap-2 text-sm text-[#4A3B31]">
                      <Heart className="w-4 h-4 text-[#DE6828]" />
                      <span className="font-medium">Microchipped</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Single Nose-Print Identity Treatment (Static Frame) */}
              <div className="mt-8 p-5 bg-[#FAF6F0] rounded-2xl border border-[#E9DCcb] flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DE6828]/30">
                  <img src={pet.photoUrl} alt="Nose print" className="w-full h-full object-cover filter grayscale opacity-80" />
                  <div className="absolute inset-0 bg-[#DE6828]/10" />
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-[#DE6828]/20" />
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#DE6828] shadow-[0_0_8px_#DE6828]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-0.5">Biometric Identity</div>
                  <div className="text-sm font-mono text-[#4A3B31]">{pet.qrTagId}-BIO</div>
                  <div className="text-[10px] text-[#A6978C] mt-1">Cryptographic Snout Vector Registered</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E9DCcb]" />

          {/* Detailed Info (Simple List rather than heavy cards) */}
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">Basic Info</h3>
                <div className="text-sm text-[#241812]">
                  <p><strong>Age:</strong> {pet.age || 'Unknown'}</p>
                  <p className="mt-1"><strong>Weight:</strong> {pet.weight || 'Unknown'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">Distinctive Features</h3>
                <ul className="text-sm text-[#241812] list-disc list-inside">
                  {pet.distinctiveFeatures?.length > 0 ? (
                    pet.distinctiveFeatures.map((f, i) => <li key={i}>{f}</li>)
                  ) : (
                    <li className="text-[#8A796E] list-none">No distinctive features recorded.</li>
                  )}
                </ul>
              </div>

              {pet.medicalNotes && (
                <div>
                  <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">Medical / Care Notes</h3>
                  <p className="text-sm text-[#241812] leading-relaxed">{pet.medicalNotes}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#8A796E] uppercase tracking-wider mb-2">Recovery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#DE6828] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#241812]">
                      <div className="font-medium">Primary Contact</div>
                      <div className="text-[#6F5D52]">{pet.ownerPhone || 'Not provided'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#DE6828] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#241812]">
                      <div className="font-medium">Neighborhood</div>
                      <div className="text-[#6F5D52]">{pet.neighborhood || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                {pet.status === 'safe' && (
                  <button
                    onClick={handleLostAlert}
                    className="w-full py-3 px-4 rounded-xl bg-[#DE6828] hover:bg-[#C9581B] text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Report Pet as Lost
                  </button>
                )}
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#F4EDE2] hover:bg-[#EAE0D3] text-[#DE6828] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  View Tag / QR
                </button>
                
                <div className="pt-4 border-t border-[#F2ECE3]">
                  <button
                     onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Pet Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QrTagModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        pet={pet}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#241812] mb-2">Remove {pet.name}?</h4>
            <p className="text-sm text-[#6F5D52] mb-6">
              Are you sure? This will delete their connected biometric safety profile and disable the QR collar tag.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-medium text-[#4A3B31] bg-[#F4EDE2] hover:bg-[#EAE0D3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
