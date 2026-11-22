import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../../components/DashboardNav';
import { useAuthStore } from '../../store/authStore';
import { ApiClient } from '../../utils/apiClient';
import { usePetStore } from '../../store/petStore';
import { 
  AlertTriangle, Upload, PawPrint, Camera, CheckCircle2, 
  ChevronRight, ArrowLeft, RefreshCw, Sparkles, ArrowRight 
} from 'lucide-react';

export default function NewPet() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State - Complete schema fields
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [shareMedicalNotes, setShareMedicalNotes] = useState(false);
  const [microchipId, setMicrochipId] = useState('');

  // Biometrics State
  const [consentGiven, setConsentGiven] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Atomic state: track created pet ID so retries do not create duplicate records
  const [createdPetId, setCreatedPetId] = useState<string | null>(null);
  const [enrollmentFailed, setEnrollmentFailed] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, WEBP).');
        return;
      }
      // 5MB max file size check
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Maximum supported size is 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setEnrollmentFailed(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setError('You must consent to biometric data storage to proceed with identification.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      let activePetId = createdPetId;

      // 1. Create Pet Profile only if not already created in a previous attempt
      if (!activePetId) {
        const featuresArray = distinctiveFeatures
          ? distinctiveFeatures.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        const petResponse = await ApiClient.registerPet({
          name: name.trim(),
          species,
          breed: breed.trim(),
          color: color.trim(),
          age: age.trim(),
          weight: weight.trim(),
          distinctiveFeatures: featuresArray,
          medicalNotes: medicalNotes.trim(),
          shareMedicalNotes: shareMedicalNotes,
          microchipId: microchipId.trim(),
          ownerName: user?.name || undefined,
          ownerPhone: user?.phone || undefined,
          neighborhood: user?.neighborhood || undefined,
          consentGiven: true,
        });

        activePetId = petResponse.id;
        setCreatedPetId(activePetId);
      }

      // 2. Enroll Biometric Image if selected
      if (selectedFile && activePetId) {
        try {
          await ApiClient.enrollImage(activePetId, selectedFile);
        } catch (imgErr: any) {
          console.error("Biometric enrollment failed:", imgErr);
          setEnrollmentFailed(true);
          setError(`Pet profile registered, but biometric ML feature extraction failed: ${imgErr.message || 'Unknown error'}. You can retry with a different photo below, or proceed to profile.`);
          setIsSubmitting(false);
          return;
        }
      }

      // 3. Hydrate state to sync new pet in global store
      await usePetStore.getState().hydrate();
      
      // Move to confirmation step
      setStep(3);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register pet. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSkipMlAndFinish = async () => {
    if (!createdPetId) return;
    try {
      await usePetStore.getState().hydrate();
      navigate(`/pets/${createdPetId}`);
    } catch {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 md:py-16 md:pb-16 pb-32">
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mb-10 transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-md min-h-[44px]"
        >
          <ArrowLeft size={16} />
          <span>Back to Console</span>
        </Link>

        {/* Step Progress Bar */}
        <nav aria-label="Enrollment Progress" className="mb-14 relative">
          <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-[var(--color-border)] -z-0" />
          
          <div className="flex items-center justify-between relative z-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center bg-[var(--color-bone)] px-3">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    step === s 
                      ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-sm' 
                      : step > s 
                        ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                        : 'border-[var(--color-border)] bg-white text-[var(--color-ink-soft)]'
                  }`}
                  aria-current={step === s ? 'step' : undefined}
                >
                  {step > s ? <CheckCircle2 size={16} /> : `0${s}`}
                </div>
                <span className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${
                  step >= s ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
                }`}>
                  {s === 1 ? 'Details' : s === 2 ? 'Biometrics' : 'Confirmation'}
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* Wizard Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-ink)] mb-3 tracking-tight">
            {step === 1 && "Companion Enrollment"}
            {step === 2 && "Biometric Feature Mapping"}
            {step === 3 && "Profile Activated"}
          </h1>
          <p className="text-[var(--color-ink-soft)] text-base md:text-lg max-w-xl leading-relaxed">
            {step === 1 && "Provide your companion's core physical and medical characteristics for the permanent identity record."}
            {step === 2 && "Upload a front-facing photograph of their nose pattern. SafePaws extracts unique neural features to identify them if lost."}
            {step === 3 && `${name}'s identity record and smart collar tag are now actively secured by the SafePaws network.`}
          </p>
        </header>

        {error && (
          <div role="alert" className="mb-8 p-4 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] flex items-start gap-3 rounded-r-xl">
            <AlertTriangle size={20} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm leading-relaxed">{error}</p>
              {enrollmentFailed && (
                <button
                  type="button"
                  onClick={handleSkipMlAndFinish}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-text)] hover:underline inline-flex items-center min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-md"
                >
                  Skip image for now & view profile →
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleEnroll} className="space-y-8">
          
          {/* STEP 1: PHYSICAL & MEDICAL ATTRIBUTES */}
          {step === 1 && (
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-28)] p-6 sm:p-10 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Pet Name */}
                <div className="space-y-2">
                  <label htmlFor="pet-name" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Pet's Name *
                  </label>
                  <input 
                    id="pet-name" 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="e.g. Max"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xl font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>

                {/* Species */}
                <div className="space-y-2">
                  <label htmlFor="pet-species" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Species
                  </label>
                  <select 
                    id="pet-species" 
                    value={species} 
                    onChange={e => setSpecies(e.target.value as any)} 
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors cursor-pointer"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Breed */}
                <div className="space-y-2">
                  <label htmlFor="pet-breed" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Breed *
                  </label>
                  <input 
                    id="pet-breed" 
                    type="text" 
                    value={breed} 
                    onChange={e => setBreed(e.target.value)} 
                    required
                    placeholder="e.g. Golden Retriever"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <label htmlFor="pet-color" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Color / Markings
                  </label>
                  <input 
                    id="pet-color" 
                    type="text" 
                    value={color} 
                    onChange={e => setColor(e.target.value)} 
                    placeholder="e.g. Golden with white patch"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label htmlFor="pet-age" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Age (Years)
                  </label>
                  <input 
                    id="pet-age" 
                    type="text" 
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    placeholder="e.g. 3"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label htmlFor="pet-weight" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Weight (kg)
                  </label>
                  <input 
                    id="pet-weight" 
                    type="text" 
                    value={weight} 
                    onChange={e => setWeight(e.target.value)} 
                    placeholder="e.g. 25"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-serif text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>

                {/* Microchip ID */}
                <div className="space-y-2">
                  <label htmlFor="pet-microchip" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Microchip ID (Optional)
                  </label>
                  <input 
                    id="pet-microchip" 
                    type="text" 
                    value={microchipId} 
                    onChange={e => setMicrochipId(e.target.value)} 
                    placeholder="e.g. 985141002345678"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 font-mono text-base text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>

                {/* Distinctive Features */}
                <div className="space-y-2">
                  <label htmlFor="pet-features" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                    Distinctive Features
                  </label>
                  <input 
                    id="pet-features" 
                    type="text" 
                    value={distinctiveFeatures} 
                    onChange={e => setDistinctiveFeatures(e.target.value)} 
                    placeholder="Comma-separated (e.g. notched left ear, blue collar)"
                    className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40" 
                  />
                </div>
              </div>

              {/* Medical Advisories */}
              <div className="space-y-3 border-t border-[var(--color-border)] pt-6">
                <label htmlFor="pet-medical" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block">
                  Medical Advisories & Allergies
                </label>
                <textarea 
                  id="pet-medical" 
                  rows={3}
                  value={medicalNotes} 
                  onChange={e => setMedicalNotes(e.target.value)} 
                  placeholder="e.g. Requires daily insulin, sensitive to chicken, nervous around large dogs"
                  className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-xl p-4 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors placeholder:text-[var(--color-ink-soft)]/40 resize-none" 
                />
                {medicalNotes.trim() && (
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-[var(--color-bone)]/80 border border-[var(--color-border)]">
                    <input
                      type="checkbox"
                      checked={shareMedicalNotes}
                      onChange={e => setShareMedicalNotes(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-moss)] focus:ring-[var(--color-focus)]"
                    />
                    <div className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                      <span className="font-semibold text-[var(--color-ink)] block">Share emergency medical notes on collar tag</span>
                      <span>Allow finders scanning the public QR tag to view life-saving medical alerts. Phone numbers and email addresses are automatically scrubbed for privacy.</span>
                    </div>
                  </label>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="button" 
                  disabled={!name.trim() || !breed.trim()}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[var(--color-ink)] text-white font-bold uppercase tracking-widest rounded-full transition-all hover:bg-[var(--color-surface-dark-raised)] disabled:opacity-40 min-h-[44px] cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <span>Proceed to Biometrics</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BIOMETRIC NOSE-PRINT ENROLLMENT */}
          {step === 2 && (
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-28)] p-6 sm:p-10 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">
                  <Camera size={24} className="text-[var(--color-accent-text)]" />
                  <span>Neural Nose-Print Enrollment</span>
                </h2>
                <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed">
                  Our computer-vision model extracts microscopic dermal ridge patterns from your pet's nose to construct a machine-learning biometric signature. Upload a clear, well-lit close-up.
                </p>
              </div>
              
              {/* Accessible Keyboard-Focusable Dropzone */}
              <div 
                role="button"
                tabIndex={0}
                aria-label="Upload pet nose photograph"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[var(--radius-24)] p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative ${
                  previewUrl 
                    ? 'border-[var(--color-accent-text)] bg-[var(--color-bone)]/30' 
                    : 'border-[var(--color-border)] hover:border-[var(--color-ink)] hover:bg-[var(--color-bone)]/50'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[260px]`}
              >
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  aria-hidden="true"
                />
                
                {previewUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden border-4 border-[var(--color-accent-text)] shadow-lg relative bg-black">
                      <img src={previewUrl} alt="Pet nose biometric preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[var(--color-marigold)]/10 pointer-events-none" />
                    </div>
                    <p className="text-xs font-bold text-[var(--color-accent-text)] flex items-center justify-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 size={16} /> Image Staged for Biometric Extraction
                    </p>
                    <p className="text-xs text-[var(--color-ink-soft)]">Tap or press Enter to replace image</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="w-16 h-16 bg-[var(--color-bone)] rounded-full flex items-center justify-center mx-auto border border-[var(--color-border)] text-[var(--color-accent-text)]">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-ink)] text-lg font-serif">Upload Nose Photograph</p>
                      <p className="text-xs text-[var(--color-ink-soft)] mt-1">JPEG, PNG or WEBP up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Consent & Submission Section */}
              <div className="border-t border-[var(--color-border)] pt-8 space-y-6">
                <label className="flex items-start gap-3.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    required 
                    checked={consentGiven} 
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-ink)] focus:ring-[var(--color-focus)] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[var(--color-ink)] leading-relaxed flex-1">
                    <strong>I consent</strong> to the extraction, storage, and processing of my pet&rsquo;s biometric dermal features by the SafePaws neural network strictly for identification and lost-pet recovery.
                  </span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[var(--color-border)] hover:bg-[var(--color-bone)] text-[var(--color-ink)] font-bold text-xs uppercase tracking-widest rounded-full transition-colors min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    Back to Details
                  </button>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !consentGiven || !previewUrl}
                    className="w-full sm:w-auto flex-1 inline-flex justify-center items-center gap-2 px-8 py-4 bg-[var(--color-ink)] text-white hover:bg-[var(--color-surface-dark-raised)] font-bold text-xs uppercase tracking-widest rounded-full transition-all disabled:opacity-40 min-h-[44px] cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Enrolling Biometrics & Indexing...</span>
                      </>
                    ) : (
                      <>
                        <PawPrint size={16} />
                        <span>Finalize Companion Enrollment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ACTIVATION CONFIRMATION */}
          {step === 3 && (
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-28)] p-8 sm:p-14 text-center flex flex-col items-center shadow-sm">
              <div className="w-20 h-20 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-ink)] mb-3 tracking-tight">
                Profile Active on SafePaws
              </h2>
              <p className="text-[var(--color-ink-soft)] text-base max-w-md mx-auto mb-10 leading-relaxed">
                The neural biometric signature and smart collar QR tag for <strong>{name}</strong> have been indexed in the secure recovery network.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <Link 
                  to={`/pets/${createdPetId}`}
                  className="flex-1 inline-flex justify-center items-center gap-2 px-8 py-4 bg-[var(--color-ink)] text-white hover:bg-[var(--color-surface-dark-raised)] font-bold text-xs uppercase tracking-widest rounded-full transition-all min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <span>View Pet Record</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  to="/dashboard"
                  className="flex-1 inline-flex justify-center items-center px-8 py-4 bg-transparent border-2 border-[var(--color-border)] hover:bg-[var(--color-bone)] text-[var(--color-ink)] font-bold text-xs uppercase tracking-widest rounded-full transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  Return to Console
                </Link>
              </div>
            </div>
          )}

        </form>
      </main>
    </div>
  );
}
