import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, QrCode, AlertCircle, Trash2, 
  MapPin, Phone, ShieldCheck, Heart, Info, ScanLine, ScanFace
} from 'lucide-react';
import { Pet } from '../../types';
import { ApiClient } from '../../utils/apiClient';
import { DashboardNav } from '../../components/DashboardNav';
import { QrTagModal } from '../../components/modals/QrTagModal';
import { usePetStore } from '../../store/petStore';

export default function PetDetail() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      setActionError('');
      await ApiClient.deletePet(petId);
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (e: any) {
      setActionError(e.message || 'Failed to delete pet');
      setShowDeleteConfirm(false);
    }
  };

  const handleLostAlert = async () => {
    if (!petId) return;
    try {
      setActionError('');
      setSuccessMessage('');
      await ApiClient.createAlert({
        petId: petId,
        lastSeenAddress: pet?.neighborhood || 'Unknown location',
        description: `Lost pet: ${pet?.name}`,
      });
      setSuccessMessage('Lost alert broadcasted successfully!');
      const fetchedPet = await ApiClient.getPet(petId);
      setPet(fetchedPet);
      await usePetStore.getState().hydrate();
    } catch (e: any) {
      setActionError(e.message || 'Failed to create alert');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
        <DashboardNav />
        <div className="flex-1 flex items-center justify-center text-[var(--color-ink-soft)] uppercase tracking-widest text-sm font-bold animate-pulse">
          Retrieving Identity Record...
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-serif text-[var(--color-ink)] mb-6">{error || 'Record Not Found'}</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] font-bold text-sm uppercase tracking-widest transition-colors"
          >
            Return to Console
          </button>
        </div>
      </div>
    );
  }

  const isSafe = pet.status === 'safe';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      
      <main className="flex-1 max-w-[1200px] mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32 w-full">
        <button 
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mb-10 lg:mb-14 transition-colors font-bold text-xs tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Console
        </button>

        {actionError && (
          <div className="mb-10 p-5 bg-[var(--color-alert)]/10 border-l-4 border-[var(--color-alert)] text-[var(--color-ink)] font-medium flex items-start gap-3">
            <AlertCircle size={20} className="text-[var(--color-alert)] shrink-0 mt-0.5" />
            <span>{actionError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-10 p-5 bg-[var(--color-success)]/10 border-l-4 border-[var(--color-success)] text-[var(--color-ink)] font-medium flex items-start gap-3">
            <ShieldCheck size={20} className="text-[var(--color-success)] shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: Editorial Image & Primary Identity */}
          <div className="w-full lg:w-1/2 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            
            <div className="relative w-full aspect-[4/5] bg-white border border-[var(--color-ink)]/10 p-2 mb-8 shadow-sm">
              {pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover grayscale-[20%] contrast-110 mix-blend-multiply" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/20 bg-[#F4EDE4]"><span className="text-6xl font-serif mb-2">{pet.name.charAt(0)}</span><span className="text-xs font-bold uppercase tracking-widest mt-4">No Photo</span></div>}
              {!isSafe && (
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-alert)] text-white text-[11px] font-bold uppercase tracking-widest shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Missing Alert Active
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-start mb-6 border-b border-[var(--color-ink)]/10 pb-6">
              <div>
                <h1 className="font-serif text-5xl lg:text-7xl font-bold tracking-tight text-[var(--color-ink)] mb-2">
                  {pet.name}
                </h1>
                <p className="text-[var(--color-ink-soft)] text-lg lg:text-xl font-serif italic">
                  {pet.breed} {pet.color ? `· ${pet.color}` : ''}
                </p>
              </div>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="p-3 border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] transition-colors shrink-0"
                title="View QR Tag"
                aria-label="View QR Tag"
              >
                <QrCode className="w-6 h-6" />
              </button>
            </div>
            
            {/* Dominant Biometric Treatment */}
            <div className="flex items-stretch gap-6 bg-white border border-[var(--color-ink)]/10 p-6 shadow-sm">
              <div className="w-20 h-20 shrink-0 border border-[var(--color-ink)]/20 overflow-hidden relative grayscale contrast-125">
                {pet.photoUrl ? <img src={pet.photoUrl} alt="Nose print biometric" className="w-full h-full object-cover mix-blend-multiply opacity-90" /> : <div className="w-full h-full bg-[var(--color-ink)]/5" />}
                <div className="absolute inset-0 bg-[var(--color-accent)]/10 mix-blend-color-burn" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-[0.2em] mb-1">
                  <ScanFace size={14} /> Biometric Signature Verified
                </div>
                <div className="text-xl font-mono text-[var(--color-ink)] font-bold tracking-wider">
                  {pet.qrTagId?.slice(0, 8) || pet.id.slice(0, 8).toUpperCase()}-BIO
                </div>
                <div className="text-xs text-[var(--color-ink-soft)] uppercase tracking-widest mt-1">
                  Active in Neural Database
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Quiet Metadata & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col gap-12 lg:pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both">
            
            {/* Metadata Section */}
            <section>
              <h3 className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Info size={14} /> Record Details
              </h3>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 border-t border-[var(--color-ink)]/10 pt-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest">Age</div>
                  <div className="text-lg font-serif text-[var(--color-ink)]">{pet.age || '—'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest">Weight</div>
                  <div className="text-lg font-serif text-[var(--color-ink)]">{pet.weight || '—'} kg</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest">Microchip ID</div>
                  <div className="text-lg font-mono text-[var(--color-ink)]">{pet.microchipId || 'None'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest">Neighborhood</div>
                  <div className="text-lg font-serif text-[var(--color-ink)]">{pet.neighborhood || '—'}</div>
                </div>
              </div>
            </section>

            {/* Distinctive Features */}
            {pet.distinctiveFeatures && pet.distinctiveFeatures.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-ink)]/10 pb-4">
                  Physical Characteristics
                </h3>
                <ul className="space-y-3 pt-2">
                  {pet.distinctiveFeatures.map((f, i) => (
                    <li key={i} className="text-lg font-serif text-[var(--color-ink)] flex items-start gap-3">
                      <span className="text-[var(--color-accent)] mt-1.5">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Medical Notes */}
            {pet.medicalNotes && (
              <section>
                <h3 className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-ink)]/10 pb-4">
                  Medical Advisories
                </h3>
                <p className="text-lg font-serif text-[var(--color-ink)] italic leading-relaxed pt-2">
                  "{pet.medicalNotes}"
                </p>
              </section>
            )}

            {/* Strategic Actions */}
            <section className="mt-auto pt-10 border-t border-[var(--color-ink)]/10 flex flex-col gap-4">
              {isSafe ? (
                <button
                  onClick={handleLostAlert}
                  className="w-full py-5 px-6 bg-[var(--color-alert)] hover:bg-[#9A3926] text-white font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                  <AlertCircle size={18} />
                  Report Missing
                </button>
              ) : (
                <div className="w-full py-5 px-6 bg-[var(--color-alert)]/10 text-[var(--color-alert)] border-2 border-[var(--color-alert)] text-center font-bold text-sm uppercase tracking-widest">
                  Missing Report Active
                </div>
              )}
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-4 px-6 bg-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Remove Identity Record
              </button>
            </section>

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-bone)] p-10 max-w-md w-full text-center border-t-4 border-[var(--color-danger)] shadow-2xl">
            <Trash2 className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-6" />
            <h4 className="font-serif text-3xl font-bold text-[var(--color-ink)] mb-4">Destroy Record?</h4>
            <p className="text-[var(--color-ink-soft)] leading-relaxed mb-10">
              This action permanently purges the biometric identity record for <strong>{pet.name}</strong> from the neural database and revokes tag access. This cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-4 bg-transparent border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-bold text-xs uppercase tracking-widest transition-colors hover:bg-[var(--color-ink)]/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-4 bg-[var(--color-danger)] hover:bg-[#B31D1D] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
