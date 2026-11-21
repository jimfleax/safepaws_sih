import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../../components/DashboardNav';
import { useAuthStore } from '../../store/authStore';
import { ApiClient } from '../../utils/apiClient';
import { usePetStore } from '../../store/petStore';
import { AlertTriangle, Upload, PawPrint, Camera, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export default function NewPet() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('dog');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createdPetId, setCreatedPetId] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setError('You must consent to biometric data storage to proceed.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Create Pet Profile
      const petResponse = await ApiClient.registerPet({
        name,
        species,
        breed,
        color,
        age,
        weight,
        consentGiven: true,
      });

      // 2. Enroll Image if selected (Machine Learning Pipeline)
      if (selectedFile && petResponse.id) {
        try {
          await ApiClient.enrollImage(petResponse.id, selectedFile);
        } catch (imgErr: any) {
          console.error("Biometric enrollment failed:", imgErr);
          setError(`Pet registered, but biometric ML enrollment failed: ${imgErr.message || 'Unknown error'}. You may need to retry image upload later.`);
          setIsSubmitting(false);
          return;
        }
      }

      setCreatedPetId(petResponse.id);
      
      // 3. Hydrate state to fetch new pet
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

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 md:pb-12 pb-28">
        
        <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mb-12 inline-block transition-colors">
          ← Back to Console
        </Link>

        {/* Progress Indication */}
        <div className="mb-16 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-ink)]/10 -z-10 -translate-y-1/2" />
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center bg-[var(--color-bone)] px-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                step === s 
                  ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bone)]' 
                  : step > s 
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bone)]'
                    : 'border-[var(--color-ink)]/20 bg-transparent text-[var(--color-ink-soft)]'
              }`}>
                {step > s ? <CheckCircle2 size={16} /> : `0${s}`}
              </div>
              <span className={`mt-3 text-xs font-bold uppercase tracking-widest ${
                step >= s ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
              }`}>
                {s === 1 ? 'Details' : s === 2 ? 'Identity' : 'Confirmation'}
              </span>
            </div>
          ))}
        </div>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-ink)] mb-4">
            {step === 1 && "New Pet Enrollment"}
            {step === 2 && "Biometric Mapping"}
            {step === 3 && "Secure Profile Created"}
          </h1>
          <p className="text-[var(--color-ink-soft)] text-lg max-w-xl">
            {step === 1 && "Enter their basic details to begin constructing the identity profile."}
            {step === 2 && "Upload a clear, front-facing photograph of their nose to generate the machine-learning signature."}
            {step === 3 && `${name}'s identity is now actively secured by the SafePaws network.`}
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-[var(--color-danger)]/10 border-l-4 border-[var(--color-danger)] text-[var(--color-ink)] flex gap-3">
            <AlertTriangle size={20} className="text-[var(--color-danger)] shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleEnroll} className="space-y-10">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Pet's Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required 
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                    placeholder="e.g. Max" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Species</label>
                  <select value={species} onChange={e => setSpecies(e.target.value)} 
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors cursor-pointer appearance-none">
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Breed</label>
                  <input type="text" value={breed} onChange={e => setBreed(e.target.value)} 
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                    placeholder="e.g. Golden Retriever" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Color / Markings</label>
                  <input type="text" value={color} onChange={e => setColor(e.target.value)} 
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                    placeholder="e.g. Golden with white paws" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Age (Years)</label>
                  <input type="text" value={age} onChange={e => setAge(e.target.value)} 
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                    placeholder="e.g. 3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Weight (kg)</label>
                  <input type="text" value={weight} onChange={e => setWeight(e.target.value)} 
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-3 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink)]/20" 
                    placeholder="e.g. 25" />
                </div>
              </div>

              <div className="pt-16 flex justify-end">
                <button 
                  type="button" 
                  disabled={!name.trim()}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest transition-colors hover:bg-opacity-90 disabled:opacity-50"
                >
                  Proceed to Identity <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="bg-white/50 border border-[var(--color-ink)]/15 p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-3 flex items-center gap-2">
                    <Camera size={24} /> Neural Feature Extraction
                  </h2>
                  <p className="text-[var(--color-ink-soft)] leading-relaxed">
                    Our machine learning pipeline uses your pet's unique nose pattern for identification. Upload a clear, front-facing close-up of their nose. Ensure good lighting.
                  </p>
                </div>
                
                <div 
                  className={`border-2 border-dashed ${previewUrl ? 'border-[var(--color-accent)]' : 'border-[var(--color-ink)]/20'} p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/40 transition-colors relative mb-8`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                  
                  {previewUrl ? (
                    <div className="space-y-6 w-full">
                      <div className="w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-[var(--color-accent)] shadow-xl relative">
                        <img src={previewUrl} alt="Pet nose preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[var(--color-accent)]/10 animate-pulse pointer-events-none" />
                      </div>
                      <p className="text-sm font-bold text-[var(--color-accent)] flex items-center justify-center gap-2 uppercase tracking-wider">
                        <CheckCircle2 size={18} /> Valid Signature Acquired
                      </p>
                      <p className="text-xs text-[var(--color-ink-soft)] uppercase tracking-widest">Tap to retake</p>
                    </div>
                  ) : (
                    <div className="space-y-4 py-8">
                      <div className="w-20 h-20 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload size={32} className="text-[var(--color-ink-soft)]" />
                      </div>
                      <p className="font-bold text-[var(--color-ink)] text-xl font-serif">Upload Image</p>
                      <p className="text-sm text-[var(--color-ink-soft)]">JPEG, PNG or WEBP up to 5MB</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--color-ink)]/10 pt-8 space-y-8">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input 
                        type="checkbox" 
                        required 
                        checked={consentGiven} 
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-[var(--color-ink)]/30 checked:bg-[var(--color-ink)] checked:border-[var(--color-ink)] transition-colors cursor-pointer"
                      />
                      <CheckCircle2 size={16} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-[var(--color-ink)] leading-relaxed flex-1">
                      <strong>I consent</strong> to the extraction, storage, and processing of my pet's biometric data by the machine learning pipeline for identification purposes.
                    </span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="w-full sm:w-auto px-8 py-4 bg-transparent text-[var(--color-ink)] font-bold uppercase tracking-widest hover:bg-white/50 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !consentGiven || !previewUrl}
                      className="w-full sm:w-auto flex-1 px-8 py-4 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enrolling Identity...</>
                      ) : (
                        <><PawPrint size={18} /> Finalize Enrollment</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="bg-white/60 border border-[var(--color-ink)]/15 p-12 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 size={48} className="text-[var(--color-success)]" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-4">
                  Profile Activated
                </h2>
                <p className="text-[var(--color-ink-soft)] text-lg max-w-md mx-auto mb-12">
                  The biometric signature for <strong>{name}</strong> is completely generated and active on the network.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Link 
                    to={`/pets/${createdPetId}`}
                    className="inline-flex justify-center items-center px-10 py-4 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-colors"
                  >
                    View Secure Profile
                  </Link>
                  <Link 
                    to="/dashboard"
                    className="inline-flex justify-center items-center px-10 py-4 bg-transparent border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-bold uppercase tracking-widest hover:bg-[var(--color-ink)]/5 transition-colors"
                  >
                    Return to Console
                  </Link>
                </div>
              </div>
            </div>
          )}

        </form>
      </main>
    </div>
  );
}
