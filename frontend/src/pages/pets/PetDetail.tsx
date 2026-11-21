import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, QrCode, AlertCircle, Trash2, Edit3, 
  MapPin, ShieldCheck, Heart, Info, ScanLine, ScanFace, Check, RefreshCw
} from 'lucide-react';
import { Pet } from '../../types';
import { ApiClient } from '../../utils/apiClient';
import { DashboardNav } from '../../components/DashboardNav';
import { QrTagModal } from '../../components/modals/QrTagModal';
import { usePetStore } from '../../store/petStore';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';

export default function PetDetail() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form state
  const [editAge, setEditAge] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editMicrochip, setEditMicrochip] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editMedical, setEditMedical] = useState('');

  useEffect(() => {
    async function loadPet() {
      if (!petId) return;
      try {
        const fetchedPet = await ApiClient.getPet(petId);
        setPet(fetchedPet);
        setEditAge(fetchedPet.age || '');
        setEditWeight(fetchedPet.weight || '');
        setEditMicrochip(fetchedPet.microchipId || '');
        setEditFeatures(fetchedPet.distinctiveFeatures?.join(', ') || '');
        setEditMedical(fetchedPet.medicalNotes || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load companion identity record');
      } finally {
        setLoading(false);
      }
    }
    loadPet();
  }, [petId]);

  const handleDelete = async () => {
    if (!petId) return;
    setIsDeleting(true);
    try {
      setActionError('');
      await ApiClient.deletePet(petId);
      // Clean up in-memory store and localStorage
      usePetStore.getState().removePet(petId);
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (e: any) {
      setActionError(e.message || 'Failed to delete pet identity record');
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  const handleLostAlert = async () => {
    if (!petId) return;
    try {
      setActionError('');
      setSuccessMessage('');
      await ApiClient.createAlert({
        petId: petId,
        lastSeenAddress: pet?.neighborhood || 'Location on record',
        description: `Lost companion: ${pet?.name}`,
      });
      setSuccessMessage('Missing alert broadcasted successfully to the SafePaws network.');
      const fetchedPet = await ApiClient.getPet(petId);
      setPet(fetchedPet);
      await usePetStore.getState().hydrate();
    } catch (e: any) {
      setActionError(e.message || 'Failed to broadcast missing alert');
    }
  };

  const handleUpdateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return;
    setIsUpdating(true);
    try {
      const featuresArray = editFeatures
        ? editFeatures.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const updated = await ApiClient.updatePet(petId, {
        age: editAge.trim(),
        weight: editWeight.trim(),
        microchipId: editMicrochip.trim(),
        distinctiveFeatures: featuresArray,
        medicalNotes: editMedical.trim(),
      });

      setPet(updated);
      setIsEditModalOpen(false);
      setSuccessMessage('Identity record updated successfully.');
      await usePetStore.getState().hydrate();
    } catch (e: any) {
      setActionError(e.message || 'Failed to update record');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-[var(--color-ink-soft)] uppercase tracking-widest text-xs font-bold gap-3">
          <RefreshCw size={24} className="animate-spin text-[var(--color-accent-text)]" />
          <span>Retrieving Biometric Identity Record...</span>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-serif text-[var(--color-ink)] mb-4 font-bold">Record Not Found</h2>
          <p className="text-[var(--color-ink-soft)] text-sm mb-8 max-w-sm">
            {error || 'This companion profile does not exist or has been removed from the registry.'}
          </p>
          <button 
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3.5 bg-[var(--color-ink)] text-white hover:bg-[var(--color-surface-dark-raised)] rounded-full font-bold text-xs uppercase tracking-widest transition-colors min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
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
      
      <main className="flex-1 max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32 w-full">
        
        {/* Navigation Breadcrumb */}
        <Link 
          to="/dashboard"
          className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mb-8 transition-colors font-bold text-xs tracking-widest uppercase min-h-[44px] py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-md"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Console</span>
        </Link>

        {actionError && (
          <div role="alert" className="mb-8 p-4 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] font-medium flex items-start gap-3 rounded-r-xl">
            <AlertCircle size={20} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
            <span className="text-sm">{actionError}</span>
          </div>
        )}

        {successMessage && (
          <div role="status" className="mb-8 p-4 bg-[var(--color-success)]/10 border-l-4 border-[var(--color-success)] text-[var(--color-ink)] font-medium flex items-start gap-3 rounded-r-xl">
            <ShieldCheck size={20} className="text-[var(--color-success)] shrink-0 mt-0.5" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: Editorial Image, Status & Biometrics */}
          <div className="w-full lg:w-1/2 flex flex-col">
            
            {/* Primary Portrait Card Container */}
            <div className="relative w-full aspect-[4/5] bg-white border border-[var(--color-border)] rounded-[var(--radius-28)] overflow-hidden p-3 mb-6 shadow-sm">
              <div className="w-full h-full rounded-[var(--radius-24)] overflow-hidden bg-[var(--color-bone)] relative">
                {pet.photoUrl ? (
                  <img 
                    src={pet.photoUrl} 
                    alt={pet.name} 
                    className="w-full h-full object-cover grayscale-[15%] contrast-105 mix-blend-multiply" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink-soft)] bg-[var(--color-bone)]">
                    <span className="text-7xl font-serif text-[var(--color-ink)]/20 mb-2">{pet.name.charAt(0)}</span>
                    <span className="text-xs font-bold uppercase tracking-widest mt-2">No Photo on File</span>
                  </div>
                )}

                {/* Missing Status Badge Overlay */}
                {!isSafe && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-alert-clay)] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse motion-reduce:animate-none" />
                      Missing Alert Active
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pet Name & Modal Quick Actions */}
            <div className="flex justify-between items-start mb-6 border-b border-[var(--color-border)] pb-6">
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-ink)] mb-1">
                  {pet.name}
                </h1>
                <p className="text-[var(--color-ink-soft)] text-lg font-serif italic">
                  {pet.breed} {pet.color ? `· ${pet.color}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-3 border border-[var(--color-border)] bg-white rounded-full text-[var(--color-ink)] hover:bg-[var(--color-bone)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  title="Edit Identity Details"
                  aria-label="Edit Identity Details"
                >
                  <Edit3 className="w-5 h-5 text-[var(--color-ink)]" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="p-3 border border-[var(--color-border)] bg-white rounded-full text-[var(--color-ink)] hover:bg-[var(--color-bone)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  title="View Smart Collar QR Tag"
                  aria-label="View Smart Collar QR Tag"
                >
                  <QrCode className="w-5 h-5 text-[var(--color-accent-text)]" />
                </button>
              </div>
            </div>
            
            {/* Dominant Biometric Dermal Signature Block */}
            <div className="flex items-center gap-5 bg-white border border-[var(--color-border)] rounded-[var(--radius-24)] p-5 shadow-xs">
              <div className="w-16 h-16 shrink-0 rounded-2xl border border-[var(--color-border)] overflow-hidden relative bg-[var(--color-bone)] flex items-center justify-center">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt="Nose-print biometric thumbnail" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                ) : (
                  <ScanFace size={24} className="text-[var(--color-accent-text)]" />
                )}
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent-text)] uppercase tracking-wider mb-0.5">
                  <ScanFace size={14} /> Biometric Signature Indexed
                </div>
                <div className="text-base font-mono text-[var(--color-ink)] font-bold tracking-wider truncate">
                  {pet.qrTagId?.slice(0, 10) || pet.id.slice(0, 8).toUpperCase()}-BIO
                </div>
                <div className="text-[11px] text-[var(--color-ink-soft)] uppercase tracking-widest mt-0.5">
                  Neural Matching Enabled
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Metadata, Health & Incident Actions */}
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            
            {/* Hierarchically Correct Section: Record Details */}
            <section aria-labelledby="record-details-heading">
              <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-3">
                <h2 id="record-details-heading" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info size={14} /> Record Details
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-text)] hover:underline min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] cursor-pointer"
                >
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-2">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider">Age</div>
                  <div className="text-lg font-serif text-[var(--color-ink)]">{pet.age ? `${pet.age} years` : '—'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider">Weight</div>
                  <div className="text-lg font-serif text-[var(--color-ink)]">{pet.weight ? `${pet.weight} kg` : '—'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider">Microchip ID</div>
                  <div className="text-sm font-mono text-[var(--color-ink)]">{pet.microchipId || 'None registered'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider">Neighborhood Zone</div>
                  <div className="text-lg font-serif text-[var(--color-ink)]">{pet.neighborhood || 'Local Area'}</div>
                </div>
              </div>
            </section>

            {/* Distinctive Features */}
            {pet.distinctiveFeatures && pet.distinctiveFeatures.length > 0 && (
              <section aria-labelledby="distinctive-features-heading">
                <h3 id="distinctive-features-heading" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-border)] pb-3">
                  Physical Characteristics
                </h3>
                <ul className="space-y-2 pt-1">
                  {pet.distinctiveFeatures.map((f, i) => (
                    <li key={i} className="text-base font-serif text-[var(--color-ink)] flex items-start gap-2.5">
                      <span className="text-[var(--color-accent-text)] font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Medical Advisories */}
            {pet.medicalNotes && (
              <section aria-labelledby="medical-advisories-heading">
                <h3 id="medical-advisories-heading" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-4 border-b border-[var(--color-border)] pb-3">
                  Medical Advisories
                </h3>
                <p className="text-base font-serif text-[var(--color-ink)] italic leading-relaxed pt-1 bg-white border border-[var(--color-border)] rounded-2xl p-4">
                  &ldquo;{pet.medicalNotes}&rdquo;
                </p>
              </section>
            )}

            {/* Incident Actions Section */}
            <section className="mt-auto pt-8 border-t border-[var(--color-border)] flex flex-col gap-4">
              {isSafe ? (
                <button
                  type="button"
                  onClick={handleLostAlert}
                  className="w-full py-4 px-6 bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] cursor-pointer"
                >
                  <AlertCircle size={18} />
                  <span>Report Missing (Broadcast Alert)</span>
                </button>
              ) : (
                <div className="w-full py-4 px-6 bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border-2 border-[var(--color-alert-clay)] rounded-full text-center font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <AlertCircle size={18} className="animate-pulse motion-reduce:animate-none" />
                  <span>Missing Alert Active in Network</span>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3.5 px-6 bg-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5 font-bold text-xs uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Remove Identity Record</span>
              </button>
            </section>

          </div>
        </div>
      </main>

      {/* Smart QR Tag Modal */}
      <QrTagModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        pet={pet}
      />

      {/* Accessible Radix Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md p-6 sm:p-8 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-[var(--radius-28)] shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center mb-5">
              <Trash2 className="w-7 h-7" />
            </div>

            <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-ink)] mb-3">
              Destroy Identity Record?
            </DialogTitle>

            <DialogDescription className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-8">
              This action permanently purges the biometric identity record for <strong>{pet.name}</strong> from the neural registry and revokes all collar tag lookups. This cannot be undone.
            </DialogDescription>

            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1 min-h-[44px]"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Purging Record...' : 'Confirm Purge'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Accessible Radix Edit Record Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg p-6 sm:p-8 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-[var(--radius-28)] shadow-2xl">
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-ink)] mb-2">
            Edit Companion Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--color-ink-soft)] mb-6">
            Update identification attributes and medical advisories for {pet.name}.
          </DialogDescription>

          <form onSubmit={handleUpdateRecord} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-age" className="block text-[11px] font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                  Age (Years)
                </label>
                <input
                  id="edit-age"
                  type="text"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="w-full bg-white border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                />
              </div>

              <div>
                <label htmlFor="edit-weight" className="block text-[11px] font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <input
                  id="edit-weight"
                  type="text"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full bg-white border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-microchip" className="block text-[11px] font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                Microchip ID
              </label>
              <input
                id="edit-microchip"
                type="text"
                value={editMicrochip}
                onChange={(e) => setEditMicrochip(e.target.value)}
                className="w-full bg-white border border-[var(--color-border)] rounded-xl px-3 py-2.5 font-mono text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>

            <div>
              <label htmlFor="edit-features" className="block text-[11px] font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                Distinctive Features (comma-separated)
              </label>
              <input
                id="edit-features"
                type="text"
                value={editFeatures}
                onChange={(e) => setEditFeatures(e.target.value)}
                className="w-full bg-white border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              />
            </div>

            <div>
              <label htmlFor="edit-medical" className="block text-[11px] font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                Medical Advisories & Allergies
              </label>
              <textarea
                id="edit-medical"
                rows={3}
                value={editMedical}
                onChange={(e) => setEditMedical(e.target.value)}
                className="w-full bg-white border border-[var(--color-border)] rounded-xl p-3 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] resize-none"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 min-h-[44px]"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving Changes...' : 'Save Record'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
