import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../../store/petStore';
import { Camera, ArrowRight, AlertCircle, RefreshCw, CheckCircle2, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '../ui/Dialog';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    color: '',
    age: '',
    weight: '',
    distinctiveFeatures: '',
    medicalNotes: ''
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [createdPetId, setCreatedPetId] = useState<string | null>(null);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      setError('Please provide at least a name and breed.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setScanComplete(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startNoseCapture = async () => {
    if (!photoFile) return;
    setIsScanning(true);
    setError('');
    
    try {
      const features = formData.distinctiveFeatures 
        ? formData.distinctiveFeatures.split(',').map(s => s.trim()).filter(Boolean)
        : [];
        
      const { ApiClient } = await import('../../utils/apiClient');
      const { user } = useAuthStore.getState();
      
      if (!user || !user.name || !user.phone || !user.neighborhood) {
        throw new Error("Missing owner profile information. Please complete your profile first.");
      }

      const newPet = await ApiClient.registerPet({
        name: formData.name,
        species: formData.species as any,
        breed: formData.breed,
        color: formData.color,
        age: formData.age,
        weight: formData.weight,
        distinctiveFeatures: features,
        medicalNotes: formData.medicalNotes,
        ownerName: user.name,
        ownerPhone: user.phone,
        neighborhood: user.neighborhood,
      });
      
      setCreatedPetId(newPet.id);
      
      await ApiClient.enrollImage(newPet.id, photoFile);
      
      setIsScanning(false);
      setScanComplete(true);
    } catch (err: any) {
      setIsScanning(false);
      setError(err.message || 'Failed to enroll biometric record.');
    }
  };

  const handleNextStep2 = () => {
    if (!photoPreview || !scanComplete || !createdPetId) {
      setError('Please complete the biometric enrollment.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await usePetStore.getState().hydrate();
      onClose();
      navigate(`/pets/${createdPetId}`);
    } catch (e) {
      console.error(e);
      onClose();
      navigate(`/pets/${createdPetId}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setStep(1);
        setPhotoPreview(null);
        setPhotoFile(null);
        setScanComplete(false);
        setCreatedPetId(null);
        setFormData({name: '', species: 'dog', breed: '', color: '', age: '', weight: '', distinctiveFeatures: '', medicalNotes: ''});
        onClose();
      }
    }}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-[#F6F1E7] border-[#E5E0D8]">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          
          {/* Editorial Left Side */}
          <div className="hidden md:flex w-[40%] bg-[#1C1A17] relative flex-col p-10 text-white overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
              <img 
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop" 
                alt="Dog profile background" 
                className="w-full h-full object-cover filter grayscale"
              />
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <h1 className="font-serif text-[42px] leading-[1.1] tracking-tight mb-4">
                Secure Your Companion
              </h1>
              <p className="text-[#E5E0D8] text-[16px] leading-relaxed">
                Create a verifiable biometric profile for your pet to protect them within the SafePaws network.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 mt-auto">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>

          {/* Form Right Side */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 relative">
            <DialogClose className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-[var(--color-ink-soft)] transition-colors">
              <X className="w-5 h-5" />
            </DialogClose>

            <DialogTitle className="sr-only">Register New Pet</DialogTitle>

            <div className="max-w-[440px] mx-auto mt-4">
              
              {/* STAGE A: Basic Info */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="font-serif text-[28px] text-[#1C1A17] mb-2">Basic Details</h2>
                    <p className="text-[#63684B] text-[14px]">Enter your pet's core identification data.</p>
                  </div>

                  <form onSubmit={handleNextStep1} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1.5">Pet Name *</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#1C1A17] text-[15px] focus:ring-2 focus:ring-[#E2811F] outline-none" placeholder="e.g. Olive" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1.5">Species</label>
                        <select value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#1C1A17] text-[15px] focus:ring-2 focus:ring-[#E2811F] outline-none">
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1.5">Breed *</label>
                        <input type="text" required value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#1C1A17] text-[15px] focus:ring-2 focus:ring-[#E2811F] outline-none" placeholder="e.g. Golden Retriever" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1.5">Color</label>
                        <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#1C1A17] text-[15px] focus:ring-2 focus:ring-[#E2811F] outline-none" placeholder="e.g. Golden" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1.5">Age</label>
                        <input type="text" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#1C1A17] text-[15px] focus:ring-2 focus:ring-[#E2811F] outline-none" placeholder="e.g. 3 years" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-1.5">Distinctive Features</label>
                      <input type="text" value={formData.distinctiveFeatures} onChange={e => setFormData({...formData, distinctiveFeatures: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#1C1A17] text-[15px] focus:ring-2 focus:ring-[#E2811F] outline-none" placeholder="e.g. White chest patch" />
                    </div>

                    {error && (
                      <div className="p-3 bg-[#B3452F]/10 text-[#B3452F] rounded-xl text-[13px] flex items-center gap-2 border border-[#B3452F]/20">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <div className="pt-4">
                      <button type="submit" className="w-full py-3.5 rounded-full bg-[#E2811F] hover:bg-[#CA721A] text-white font-semibold text-[15px] shadow-[0_4px_14px_rgba(226,129,31,0.25)] transition-all flex justify-center items-center gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STAGE B: Photo */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div>
                    <h2 className="font-serif text-[28px] text-[#1C1A17] mb-2">Biometric Map</h2>
                    <p className="text-[#63684B] text-[14px]">Upload a clear, front-facing photo to securely enroll their nose-print.</p>
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    <div className="relative w-full aspect-square bg-white rounded-[2rem] overflow-hidden border border-[#E5E0D8] flex items-center justify-center shadow-inner">
                      {!photoPreview ? (
                        <div className="text-center p-8">
                          <Camera className="w-10 h-10 text-[#1C1A17]/20 mx-auto mb-3" />
                          <p className="text-[13px] text-[#63684B] font-medium">No photo selected</p>
                        </div>
                      ) : (
                        <>
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          {isScanning && (
                            <div className="absolute inset-0 bg-[#E2811F]/10 flex flex-col items-center justify-center">
                              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E2811F] shadow-[0_0_20px_#E2811F] animate-scan" />
                            </div>
                          )}
                          {scanComplete && (
                            <div className="absolute inset-0 bg-[#1C1A17]/20 flex items-center justify-center backdrop-blur-[2px]">
                              <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-[#4C7A52]" />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="w-full space-y-3">
                      <label className="w-full py-3.5 rounded-full border border-[#E5E0D8] bg-white text-[#1C1A17] hover:bg-[#F6F1E7] font-semibold text-[14px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                        <Camera className="w-4 h-4 text-[#E2811F]" />
                        <span>{photoPreview ? 'Select Different Photo' : 'Upload Pet Photo'}</span>
                        <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className="hidden" />
                      </label>

                      {photoPreview && !scanComplete && (
                        <button onClick={startNoseCapture} disabled={isScanning} className="w-full py-3.5 rounded-full bg-[#1C1A17] hover:bg-[#2A2723] text-white font-semibold text-[14px] flex justify-center items-center gap-2 disabled:opacity-70 shadow-sm">
                          {isScanning ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Mapping features...</>
                          ) : (
                            <><Sparkles className="w-4 h-4 text-[#E2811F]" /> Enroll Biometric Record</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-[#B3452F]/10 text-[#B3452F] rounded-xl text-[13px] flex items-center gap-2 border border-[#B3452F]/20">
                      <AlertCircle className="w-4 h-4 shrink-0" />{error}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button onClick={() => setStep(1)} className="text-[#63684B] hover:text-[#1C1A17] text-[13px] font-semibold">Back</button>
                    <button onClick={handleNextStep2} className={`py-3 px-6 rounded-full font-semibold text-[14px] flex items-center gap-2 transition-all ${scanComplete ? 'bg-[#E2811F] text-white shadow-[0_4px_14px_rgba(226,129,31,0.25)]' : 'bg-[#E5E0D8] text-[#63684B] opacity-50 cursor-not-allowed'}`}>
                      Confirm <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE C: Ready */}
              {step === 3 && (
                <div className="space-y-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="w-16 h-16 bg-[#4C7A52]/10 rounded-full flex items-center justify-center mt-2">
                    <CheckCircle2 className="w-8 h-8 text-[#4C7A52]" />
                  </div>
                  
                  <div>
                    <h2 className="font-serif text-[28px] text-[#1C1A17] mb-2">Profile Ready</h2>
                    <p className="text-[#63684B] text-[14px] leading-relaxed">
                      {formData.name}'s biometric profile is actively secured on the SafePaws network.
                    </p>
                  </div>

                  <div className="w-full p-4 bg-white rounded-2xl border border-[#E5E0D8] flex items-center gap-4 text-left shadow-sm">
                    <img src={photoPreview || ''} alt="Pet" className="w-14 h-14 rounded-xl object-cover border border-[#E5E0D8]" />
                    <div>
                      <div className="font-serif text-[18px] text-[#1C1A17] leading-tight">{formData.name}</div>
                      <div className="text-[13px] text-[#63684B]">{formData.breed}</div>
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#4C7A52]/10 text-[#4C7A52] text-[10px] font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" /> Protected
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 w-full">
                    <button onClick={handleComplete} disabled={loading} className="w-full py-3.5 rounded-full bg-[#1C1A17] hover:bg-[#2A2723] text-white font-semibold text-[15px] shadow-sm disabled:opacity-70">
                      {loading ? 'Finalizing...' : 'View Pet Profile'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
