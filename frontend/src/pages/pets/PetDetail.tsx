import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, QrCode, AlertCircle, Trash2, 
  MapPin, Phone, ShieldCheck, Heart, Info
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

  const handleResolveAlert = async () => {
    if (!petId) return;
    try {
      setActionError('');
      setSuccessMessage('');
      
      // We need to resolve the active alert for this pet
      const store = usePetStore.getState();
      const activeAlert = store.alerts.find(a => a.petId === petId && a.status === 'active');
      
      if (activeAlert) {
        await ApiClient.resolveAlert(activeAlert.id);
      }
      
      setSuccessMessage('Alert resolved successfully!');
      const fetchedPet = await ApiClient.getPet(petId);
      setPet(fetchedPet);
      await store.hydrate();
    } catch (e: any) {
      setActionError(e.message || 'Failed to resolve alert');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col">
        <DashboardNav />
        <div className="flex-1 flex items-center justify-center text-[var(--color-trail)]">
          Loading identity record...
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-serif text-[var(--color-ink)] mb-4">{error || 'Pet not found'}</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[var(--color-marigold)] hover:text-[var(--color-accent-hover)] font-semibold transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isSafe = pet.status === 'safe';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] pb-32">
      <DashboardNav />
      
      <main className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 text-[var(--color-trail)] hover:text-[var(--color-ink)] mb-8 lg:mb-12 transition-colors font-medium text-sm tracking-wide uppercase"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Dashboard
        </button>

        {actionError && (
          <div className="mb-8 p-4 bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/30 rounded text-[var(--color-alert-clay)] font-semibold flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{actionError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 p-4 bg-[#63684B]/10 border border-[#63684B]/30 rounded text-[#63684B] font-semibold flex items-start gap-3">
            <ShieldCheck size={20} className="shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Photo & Identity */}
          <div className="w-full md:w-1/2 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            
            <div className="relative w-full aspect-[4/5] bg-[var(--color-border)] overflow-hidden rounded-sm mb-8">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
              {!isSafe && (
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-alert-clay)] text-white text-[11px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                    Lost Alert Active
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-end gap-4 mb-2">
                <h1 className="font-serif text-[48px] lg:text-[64px] leading-[0.9] tracking-[-0.03em] text-[var(--color-ink)]">
                  {pet.name}
                </h1>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="mb-1 p-2 text-[var(--color-trail)] hover:text-[var(--color-marigold)] transition-colors"
                  title="View QR Tag"
                  aria-label="View QR Tag"
                >
                  <QrCode className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-[var(--color-trail)] text-[16px] lg:text-[18px] font-serif italic mb-8">
                {pet.breed} {pet.color ? `· ${pet.color}` : ''}
              </p>

              {/* Physical Nose-print Treatment */}
              <div className="group flex items-center gap-5 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-ink-soft)] transition-colors cursor-default">
                <div className="relative w-16 h-16 bg-[var(--color-bone)] overflow-hidden mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-300">
                  <img 
                    src={pet.photoUrl} 
                    alt="Nose print biometric" 
                    className="w-full h-full object-cover filter contrast-[1.2] grayscale opacity-80 mix-blend-darken" 
                  />
                  <div className="absolute inset-0 bg-[var(--color-marigold)] mix-blend-screen opacity-10" />
                  <div className="absolute inset-0 border-[3px] border-[var(--color-surface)] mix-blend-overlay" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-1">
                    Verified Biometric Identity
                  </div>
                  <div className="text-[14px] font-mono text-[var(--color-ink)] font-medium tracking-tight">
                    {pet.qrTagId}-BIO
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-[var(--color-success)] opacity-80" />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Quiet Metadata & Actions */}
          <div className="w-full md:w-1/2 flex flex-col gap-10 md:pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both">
            
            {/* Owner Metadata */}
            <section>
              <h3 className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-border)] pb-2">
                Recovery Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-[13px] text-[var(--color-trail)]">Primary</span>
                  <span className="text-[15px] text-[var(--color-ink)] font-medium">{pet.ownerPhone || 'Not provided'}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-[13px] text-[var(--color-trail)]">Neighborhood</span>
                  <span className="text-[15px] text-[var(--color-ink)] font-medium">{pet.neighborhood || 'Not provided'}</span>
                </div>
              </div>
            </section>

            {/* Basic Info */}
            <section>
              <h3 className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-border)] pb-2">
                Physical Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-[13px] text-[var(--color-trail)]">Age</span>
                  <span className="text-[15px] text-[var(--color-ink)] font-medium">{pet.age || 'Unknown'}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-[13px] text-[var(--color-trail)]">Weight</span>
                  <span className="text-[15px] text-[var(--color-ink)] font-medium">{pet.weight || 'Unknown'}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-[13px] text-[var(--color-trail)]">Microchip</span>
                  <span className="text-[15px] text-[var(--color-ink)] font-medium">{pet.microchipId || 'None recorded'}</span>
                </div>
              </div>
            </section>

            {/* Distinctive Features */}
            {pet.distinctiveFeatures && pet.distinctiveFeatures.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-border)] pb-2">
                  Distinctive Features
                </h3>
                <ul className="space-y-2">
                  {pet.distinctiveFeatures.map((f, i) => (
                    <li key={i} className="text-[15px] text-[var(--color-ink)] font-medium before:content-['—'] before:mr-3 before:text-[var(--color-trail)]">
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Medical Notes */}
            {pet.medicalNotes && (
              <section>
                <h3 className="text-[10px] font-bold text-[var(--color-trail)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-border)] pb-2">
                  Medical Notes
                </h3>
                <p className="text-[15px] text-[var(--color-ink)] leading-relaxed font-medium italic">
                  {pet.medicalNotes}
                </p>
              </section>
            )}

            {/* Actions */}
            <section className="mt-8 pt-8 border-t border-[var(--color-border)] space-y-4">
              {isSafe ? (
                <button
                  onClick={handleLostAlert}
                  className="w-full py-4 px-6 bg-[var(--color-alert-clay)] hover:opacity-90 text-white font-semibold text-[14px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Missing
                </button>
              ) : (
                <button
                  onClick={handleResolveAlert}
                  className="w-full py-4 px-6 bg-[var(--color-success)] hover:opacity-90 text-white font-semibold text-[14px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Resolve Alert (Mark Safe)
                </button>
              )}
              
              <button
                onClick={() => alert('Edit identity feature coming soon.')}
                className="w-full py-4 px-6 bg-transparent hover:bg-[var(--color-border)] text-[var(--color-ink)] font-semibold text-[14px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-[var(--color-ink-soft)]/30 hover:border-[var(--color-ink-soft)]"
              >
                Edit Identity Record
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-4 px-6 bg-transparent hover:bg-[var(--color-border)] text-[var(--color-trail)] hover:text-[var(--color-alert-clay)] font-semibold text-[14px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-transparent"
              >
                <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-ink)]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] p-8 max-w-md w-full text-center">
            <Trash2 className="w-8 h-8 text-[var(--color-alert-clay)] mx-auto mb-6" />
            <h4 className="font-serif text-[32px] leading-tight text-[var(--color-ink)] mb-4">Remove Record?</h4>
            <p className="text-[15px] text-[var(--color-trail)] leading-relaxed mb-8">
              This action permanently deletes the biometric identity record for {pet.name} and revokes tag access.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full py-4 bg-[var(--color-alert-clay)] hover:opacity-90 text-white font-semibold text-[14px] uppercase tracking-widest transition-colors"
              >
                Confirm Removal
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-4 bg-transparent hover:bg-[var(--color-border)] text-[var(--color-ink)] font-semibold text-[14px] uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
