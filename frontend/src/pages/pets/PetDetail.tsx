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

  const handleDelete = async () => {
    if (!petId) return;
    try {
      await ApiClient.deletePet(petId);
      navigate('/dashboard');
    } catch (e: any) {
      alert(e.message || 'Failed to delete pet');
    }
  };

  const handleLostAlert = async () => {
    if (!petId) return;
    try {
      await ApiClient.createAlert({
        petId: petId,
        lastSeenAddress: pet?.neighborhood || 'Unknown location',
        description: `Lost pet: ${pet?.name}`,
      });
      alert('Lost alert broadcasted successfully!');
      // reload pet to reflect status change
      const fetchedPet = await ApiClient.getPet(petId);
      setPet(fetchedPet);
    } catch (e: any) {
      alert(e.message || 'Failed to create alert');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E7]">
        <DashboardNav />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center text-[#63684B]">
          Loading pet details...
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F6F1E7]">
        <DashboardNav />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-serif text-[#1C1A17] mb-4">{error || 'Pet not found'}</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[#E2811F] hover:text-[#C9721B] font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isSafe = pet.status === 'safe';

  return (
    <div className="min-h-screen bg-[#F6F1E7] pb-32">
      <DashboardNav />
      
      <main className="max-w-[1040px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 text-[#63684B] hover:text-[#1C1A17] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[14px] font-medium tracking-wide">BACK TO DASHBOARD</span>
        </button>

        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(28,26,23,0.04)] border border-[#E5E0D8] overflow-hidden">
          
          {/* Top Section: Photo & Core Details */}
          <div className="flex flex-col md:flex-row">
            
            {/* Image Column */}
            <div className="w-full md:w-[45%] lg:w-[40%] relative bg-[#E5E0D8]">
              <div className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(28,26,23,0.2) 0%, transparent 25%, transparent 75%, rgba(28,26,23,0.4) 100%)',
                }}
              />
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-full h-[60vh] md:h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Status Badge */}
              <div className="absolute top-6 left-6 z-20">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-md backdrop-blur-md ${
                  isSafe ? 'bg-[#4C7A52]/90' : 'bg-[#B3452F]/90'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSafe ? 'bg-[#A3D9B0]' : 'bg-[#FFB4A3]'}`} />
                  {isSafe ? 'Safe at Home' : 'Lost Alert Active'}
                </span>
              </div>
            </div>

            {/* Core Details Column */}
            <div className="w-full md:w-[55%] lg:w-[60%] p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h1 className="font-serif text-[42px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[#1C1A17]">
                    {pet.name}
                  </h1>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="flex-shrink-0 p-3 bg-[#F6F1E7] hover:bg-[#E5E0D8] text-[#E2811F] rounded-full transition-colors"
                    title="View QR Tag"
                    aria-label="View QR Tag"
                  >
                    <QrCode className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-[#63684B] text-[18px] leading-relaxed mb-8">
                  {pet.breed} {pet.color ? `· ${pet.color}` : ''}
                </p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#F6F1E7] rounded-full text-[13px] text-[#1C1A17] font-medium border border-[#E5E0D8]">
                    <ShieldCheck className="w-4 h-4 text-[#4C7A52]" />
                    <span>Verified Identity</span>
                  </div>
                  {pet.microchipId && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#F6F1E7] rounded-full text-[13px] text-[#1C1A17] font-medium border border-[#E5E0D8]">
                      <Heart className="w-4 h-4 text-[#E2811F]" />
                      <span>Microchipped</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Single Restrained Nose-Print Identity Treatment */}
              <div className="p-6 bg-[#F6F1E7] rounded-[1.5rem] border border-[#E5E0D8] flex items-center gap-5 transition-shadow hover:shadow-sm">
                <div className="relative w-16 h-16 rounded-[1rem] overflow-hidden border border-[#E2811F]/30 bg-white">
                  <img src={pet.photoUrl} alt="Nose print biometric" className="w-full h-full object-cover filter grayscale opacity-90" />
                  <div className="absolute inset-0 bg-[#E2811F]/5 mix-blend-overlay" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#1C1A17]/10 rounded-[1rem]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1">Biometric Record</div>
                  <div className="text-[14px] font-mono text-[#1C1A17] font-medium tracking-tight mb-0.5">{pet.qrTagId}-BIO</div>
                  <div className="text-[12px] text-[#63684B]">Nose-print securely linked to tag</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#E5E0D8]" />

          {/* Bottom Section: Details & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Information Grid */}
            <div className="p-8 sm:p-10 lg:p-12 md:border-r border-[#E5E0D8] space-y-10">
              
              <div>
                <h3 className="text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
                  <span className="w-3 h-px bg-[#63684B]" />
                  Basic Info
                </h3>
                <div className="grid grid-cols-2 gap-4 text-[15px] text-[#1C1A17]">
                  <div>
                    <span className="block text-[#63684B] text-[13px] mb-1">Age</span>
                    {pet.age || 'Unknown'}
                  </div>
                  <div>
                    <span className="block text-[#63684B] text-[13px] mb-1">Weight</span>
                    {pet.weight || 'Unknown'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
                  <span className="w-3 h-px bg-[#63684B]" />
                  Distinctive Features
                </h3>
                {pet.distinctiveFeatures?.length > 0 ? (
                  <ul className="space-y-2 text-[15px] text-[#1C1A17]">
                    {pet.distinctiveFeatures.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#E2811F]">•</span> {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#63684B] text-[15px] italic">No distinctive features recorded.</p>
                )}
              </div>

              {pet.medicalNotes && (
                <div>
                  <h3 className="text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
                    <span className="w-3 h-px bg-[#63684B]" />
                    Medical Notes
                  </h3>
                  <p className="text-[15px] text-[#1C1A17] leading-relaxed bg-[#F6F1E7]/50 p-4 rounded-xl border border-[#E5E0D8]">
                    {pet.medicalNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Recovery & Actions */}
            <div className="p-8 sm:p-10 lg:p-12 space-y-10 bg-[#FAF8F5]">
              
              <div>
                <h3 className="text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                  <span className="w-3 h-px bg-[#63684B]" />
                  Recovery Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 p-2 bg-white rounded-lg border border-[#E5E0D8]">
                      <Phone className="w-4 h-4 text-[#E2811F]" />
                    </div>
                    <div>
                      <div className="text-[13px] text-[#63684B] mb-0.5">Primary Contact</div>
                      <div className="text-[15px] font-medium text-[#1C1A17]">{pet.ownerPhone || 'Not provided'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 p-2 bg-white rounded-lg border border-[#E5E0D8]">
                      <MapPin className="w-4 h-4 text-[#E2811F]" />
                    </div>
                    <div>
                      <div className="text-[13px] text-[#63684B] mb-0.5">Neighborhood</div>
                      <div className="text-[15px] font-medium text-[#1C1A17]">{pet.neighborhood || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-[#E5E0D8]">
                {isSafe && (
                  <button
                    onClick={handleLostAlert}
                    className="w-full py-4 px-6 rounded-full bg-[#B3452F] hover:bg-[#9A3926] active:bg-[#7D2E1E] text-white font-semibold text-[15px] shadow-[0_4px_14px_rgba(179,69,47,0.3)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Report Pet as Lost
                  </button>
                )}
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full py-4 px-6 rounded-full bg-white border border-[#E5E0D8] hover:bg-[#F6F1E7] text-[#1C1A17] font-semibold text-[15px] shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <QrCode className="w-5 h-5 text-[#E2811F]" />
                  View Smart Tag
                </button>
                
                <div className="pt-6 text-center">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 text-[#B3452F] hover:text-[#9A3926] text-[14px] font-medium transition-colors"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C1A17]/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 sm:p-10 max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-[#B3452F]/10 text-[#B3452F] flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-[28px] leading-tight text-[#1C1A17] mb-3">Remove {pet.name}?</h4>
            <p className="text-[16px] text-[#63684B] leading-relaxed mb-8">
              This will permanently delete their connected biometric safety profile and disable the QR collar tag. This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3.5 rounded-full font-semibold text-[#1C1A17] bg-[#F6F1E7] border border-[#E5E0D8] hover:bg-[#E5E0D8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3.5 rounded-full font-semibold text-white bg-[#B3452F] hover:bg-[#9A3926] transition-colors shadow-md"
              >
                Remove Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
