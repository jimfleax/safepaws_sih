import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../../store/petStore';
import { Camera, ArrowRight, AlertCircle, RefreshCw, CheckCircle2, Sparkles, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Pet } from '../../types';

export default function NewPet() {
  const navigate = useNavigate();
  const addPet = usePetStore(state => state.addPet);
  
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
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setScanComplete(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startNoseCapture = () => {
    setIsScanning(true);
    // Simulating ML processing delay for enrollment
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  const handleNextStep2 = () => {
    if (!photoPreview || !scanComplete) {
      setError('Please complete the biometric enrollment.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleComplete = async () => {
    setLoading(true);
    // Build distinctive features array
    const features = formData.distinctiveFeatures 
      ? formData.distinctiveFeatures.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: formData.name,
      species: formData.species as any,
      breed: formData.breed,
      color: formData.color,
      age: formData.age,
      weight: formData.weight,
      distinctiveFeatures: features,
      medicalNotes: formData.medicalNotes,
      photoUrl: photoPreview || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop',
      status: 'safe',
      qrTagId: `TAG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    addPet(newPet);
    navigate(`/pets/${newPet.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F6F1E7]">
      
      {/* Editorial Left Side */}
      <div className="hidden md:flex w-[40%] lg:w-[45%] bg-[#1C1A17] relative flex-col justify-between p-12 lg:p-16 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1600&auto=format&fit=crop" 
            alt="Dog profile background" 
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-[#E5E0D8] hover:text-white transition-colors mb-16"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-[14px] font-bold tracking-wider uppercase">Cancel Setup</span>
          </button>
          
          <h1 className="font-serif text-[48px] lg:text-[64px] leading-[1.05] tracking-tight mb-6">
            Secure Your<br/>Companion
          </h1>
          <p className="text-[#E5E0D8] text-[18px] max-w-sm leading-relaxed">
            Create a verifiable biometric profile for your pet to protect them within the SafePaws network.
          </p>
        </div>

        <div className="relative z-10 text-[12px] uppercase tracking-widest text-[#E5E0D8]/60 font-bold">
          Step {step} of 3
        </div>
      </div>

      {/* Form Right Side */}
      <div className="flex-1 w-full flex items-center justify-center p-6 sm:p-12 lg:p-16">
        
        {/* Mobile Header / Cancel */}
        <div className="md:hidden absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white rounded-full shadow-sm border border-[#E5E0D8] text-[#63684B]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-[480px]">
          
          {/* Progress Indicator (Mobile) */}
          <div className="md:hidden flex items-center gap-2 mb-10 mt-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#1C1A17]' : 'bg-[#E5E0D8]'}`} 
              />
            ))}
          </div>

          <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgba(28,26,23,0.04)] border border-[#E5E0D8]">
            
            {/* STAGE A: Basic Info */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="font-serif text-[32px] text-[#1C1A17] mb-2">Basic Details</h2>
                  <p className="text-[#63684B] text-[15px]">Enter your pet's core identification data.</p>
                </div>

                <form onSubmit={handleNextStep1} className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2">
                      Pet Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all"
                      placeholder="e.g. Olive"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2">
                        Species
                      </label>
                      <select
                        value={formData.species}
                        onChange={e => setFormData({...formData, species: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all appearance-none"
                      >
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2">
                        Breed *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.breed}
                        onChange={e => setFormData({...formData, breed: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all"
                        placeholder="e.g. Golden Retriever"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all"
                        placeholder="e.g. Golden"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2">
                        Age
                      </label>
                      <input
                        type="text"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all"
                        placeholder="e.g. 3 years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#63684B] uppercase tracking-[0.12em] mb-2">
                      Distinctive Features
                    </label>
                    <input
                      type="text"
                      value={formData.distinctiveFeatures}
                      onChange={e => setFormData({...formData, distinctiveFeatures: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#E5E0D8] bg-[#F6F1E7] text-[#1C1A17] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E2811F] transition-all"
                      placeholder="e.g. White chest patch (comma separated)"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-[#B3452F]/10 text-[#B3452F] rounded-xl text-[14px] flex items-center gap-3 border border-[#B3452F]/20">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="group w-full py-4 rounded-full bg-[#E2811F] hover:bg-[#CA721A] text-white font-semibold text-[15px] shadow-[0_4px_14px_rgba(226,129,31,0.25)] transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STAGE B: Photo + Nose Capture */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div>
                  <h2 className="font-serif text-[32px] text-[#1C1A17] mb-2">Biometric Map</h2>
                  <p className="text-[#63684B] text-[15px]">Upload a clear, front-facing photo to securely enroll their nose-print.</p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  {/* Photo Preview & Scanner */}
                  <div className="relative w-full aspect-square bg-[#F6F1E7] rounded-[2rem] overflow-hidden border border-[#E5E0D8] flex items-center justify-center">
                    {!photoPreview ? (
                      <div className="text-center p-8">
                        <Camera className="w-12 h-12 text-[#1C1A17]/20 mx-auto mb-4" />
                        <p className="text-[14px] text-[#63684B] font-medium">No photo selected</p>
                      </div>
                    ) : (
                      <>
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        
                        {/* Clean Scanning Indicator */}
                        {isScanning && (
                          <div className="absolute inset-0 bg-[#E2811F]/10 flex flex-col items-center justify-center">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E2811F] shadow-[0_0_20px_#E2811F] animate-scan" />
                          </div>
                        )}

                        {/* Honest Structural Indicator */}
                        {scanComplete && (
                          <div className="absolute inset-0 bg-[#1C1A17]/20 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
                            <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                              <CheckCircle2 className="w-8 h-8 text-[#4C7A52]" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-full space-y-4">
                    <label className="w-full py-4 rounded-full border border-[#E5E0D8] bg-white text-[#1C1A17] hover:bg-[#F6F1E7] font-semibold text-[15px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Camera className="w-5 h-5 text-[#E2811F]" />
                      <span>{photoPreview ? 'Select Different Photo' : 'Upload Pet Photo'}</span>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>

                    {photoPreview && !scanComplete && (
                      <button
                        onClick={startNoseCapture}
                        disabled={isScanning}
                        className="w-full py-4 rounded-full bg-[#1C1A17] hover:bg-[#2A2723] text-white font-semibold text-[15px] shadow-sm transition-transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Mapping features...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 text-[#E2811F]" />
                            Enroll Biometric Record
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-[#B3452F]/10 text-[#B3452F] rounded-xl text-[14px] flex items-center gap-3 border border-[#B3452F]/20">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[#63684B] hover:text-[#1C1A17] text-[14px] font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep2}
                    className={`group py-4 px-8 rounded-full font-semibold text-[15px] shadow-sm transition-all flex items-center gap-2 ${
                      scanComplete ? 'bg-[#E2811F] hover:bg-[#CA721A] text-white shadow-[0_4px_14px_rgba(226,129,31,0.25)] hover:-translate-y-0.5' : 'bg-[#E5E0D8] text-[#63684B] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Confirm
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE C: Confirmation */}
            {step === 3 && (
              <div className="space-y-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="w-20 h-20 bg-[#4C7A52]/10 rounded-full flex items-center justify-center mb-2 mt-4">
                  <CheckCircle2 className="w-10 h-10 text-[#4C7A52]" />
                </div>
                
                <div>
                  <h2 className="font-serif text-[32px] text-[#1C1A17] mb-3">Profile Ready</h2>
                  <p className="text-[#63684B] text-[15px] max-w-sm mx-auto leading-relaxed">
                    {formData.name}'s biometric profile has been successfully created. A unique digital Smart Tag has been generated.
                  </p>
                </div>

                <div className="w-full p-5 bg-[#F6F1E7] rounded-[1.5rem] border border-[#E5E0D8] flex items-center gap-5 text-left shadow-sm">
                  <img src={photoPreview || ''} alt="Pet" className="w-16 h-16 rounded-[1rem] object-cover border border-[#E5E0D8]" />
                  <div>
                    <div className="font-serif text-[20px] text-[#1C1A17] leading-tight mb-0.5">{formData.name}</div>
                    <div className="text-[14px] text-[#63684B] mb-1">{formData.breed}</div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4C7A52]/10 text-[#4C7A52] text-[11px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      Protected
                    </div>
                  </div>
                </div>

                <div className="pt-6 w-full">
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-[#1C1A17] hover:bg-[#2A2723] text-white font-semibold text-[15px] shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? 'Finalizing...' : 'View Pet Profile'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
