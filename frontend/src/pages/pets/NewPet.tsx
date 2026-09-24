import React, { useState, useRef } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
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
          // Don't completely fail if just image fails, but alert user
          setError(`Pet registered, but biometric ML enrollment failed: ${imgErr.message || 'Unknown error'}. You may need to retry image upload later.`);
          setIsSubmitting(false);
          // Proceed to dashboard anyway so they can see the pet
        }
      }

      // 3. Hydrate state to fetch new pet
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register pet. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 md:py-20 md:pb-12 pb-28">
        
        <Link to="/dashboard" className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <header className="mb-10 border-b border-[var(--color-ink)]/10 pb-8">
          <h1 className="text-4xl font-serif font-bold text-[var(--color-ink)] mb-2">Register Your Pet</h1>
          <p className="text-[var(--color-ink-soft)] text-lg">
            Create a secure profile with a biometric nose print to ensure they can always be identified.
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-[var(--color-danger)]/10 border-l-4 border-[var(--color-danger)] text-[var(--color-ink)] flex gap-3">
            <AlertTriangle size={20} className="text-[var(--color-danger)] shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white/50 border border-[var(--color-ink)]/15 p-6 space-y-6">
                <h2 className="text-xl font-serif font-bold flex items-center gap-2 border-b border-[var(--color-ink)]/10 pb-4">
                  <PawPrint size={20} /> Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider">Pet's Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg" placeholder="e.g. Max" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider">Species</label>
                    <select value={species} onChange={e => setSpecies(e.target.value)} className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg cursor-pointer">
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider">Breed</label>
                    <input type="text" value={breed} onChange={e => setBreed(e.target.value)} className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg" placeholder="e.g. Golden Retriever" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider">Color/Markings</label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg" placeholder="e.g. Golden with white paws" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider">Age (Years)</label>
                    <input type="text" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg" placeholder="e.g. 3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider">Weight (kg)</label>
                    <input type="text" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-lg" placeholder="e.g. 25" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="button" 
                    disabled={!name.trim()}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-8 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white/50 border border-[var(--color-ink)]/15 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--color-ink)]/10 pb-4">
                  <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                    <Camera size={20} /> Biometric Enrollment (ML)
                  </h2>
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                    ← Edit Info
                  </button>
                </div>

                <div className="bg-[var(--color-surface)] p-4 border border-[var(--color-border)] rounded-sm flex gap-3 text-sm text-[var(--color-ink-soft)]">
                  <Info size={24} className="shrink-0 text-[var(--color-accent)]" />
                  <p>Our machine learning pipeline uses your pet's unique nose pattern for identification. Upload a clear, front-facing close-up of their nose. Ensure good lighting.</p>
                </div>
                
                <div 
                  className={`border-2 border-dashed ${previewUrl ? 'border-[var(--color-accent)]' : 'border-[var(--color-ink)]/20'} p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/40 transition-colors relative`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                  
                  {previewUrl ? (
                    <div className="space-y-4 w-full">
                      <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[var(--color-accent)] shadow-md">
                        <img src={previewUrl} alt="Pet nose preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-bold text-[var(--color-accent)] flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> Photo Selected
                      </p>
                      <p className="text-xs text-[var(--color-ink-soft)] underline">Click to choose a different photo</p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-6">
                      <div className="w-16 h-16 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Upload size={24} className="text-[var(--color-ink-soft)]" />
                      </div>
                      <p className="font-bold text-[var(--color-ink)] text-lg">Click to upload photo</p>
                      <p className="text-sm text-[var(--color-ink-soft)]">JPEG, PNG or WEBP up to 5MB</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[var(--color-ink)]/10 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        required 
                        checked={consentGiven} 
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-[var(--color-ink)]/30 rounded-sm checked:bg-[var(--color-accent)] checked:border-[var(--color-accent)] transition-colors cursor-pointer"
                      />
                      <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-[var(--color-ink)] leading-relaxed flex-1">
                      <strong>I consent</strong> to the extraction, storage, and processing of my pet's biometric data by the machine learning pipeline for identification purposes.
                    </span>
                  </label>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !consentGiven}
                    className="w-full mt-4 py-4 bg-[var(--color-accent)] text-white font-bold uppercase tracking-widest hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enrolling Pet...</>
                    ) : (
                      <><PawPrint size={18} /> Register & Enroll Pet</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </form>
      </main>
    </div>
  );
}
