import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Camera, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { usePetStore } from '../../store/petStore';
import { Pet } from '../../types';
import { DashboardNav } from '../../components/DashboardNav';
import { useAuthStore } from '../../store/authStore';

export default function NewPet() {
  const navigate = useNavigate();
  const { addPet } = usePetStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'other',
    breed: '',
    color: '',
    age: '',
    weight: '',
    ownerPhone: '',
    microchipId: '',
    medicalNotes: '',
    distinctiveFeatures: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.ownerPhone) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
      setScanComplete(false);
      setIsScanning(false);
    }
  };

  const startNoseCapture = () => {
    if (!photoPreview) {
      setError('Please upload a photo first.');
      return;
    }
    setError('');
    setIsScanning(true);
    // Simulate biometric scan process
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2400);
  };

  const handleNextStep2 = () => {
    if (!photoPreview || !scanComplete) {
      setError('Please capture the nose-print biometrics before proceeding.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleComplete = () => {
    const featuresArray = formData.distinctiveFeatures
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      color: formData.color,
      age: formData.age,
      weight: formData.weight,
      photoUrl: photoPreview || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      microchipId: formData.microchipId,
      status: 'safe',
      userId: user?.id || 'user-1',
      ownerPhone: formData.ownerPhone,
      medicalNotes: formData.medicalNotes,
      distinctiveFeatures: featuresArray,
      qrTagId: `SP-${Math.floor(Math.random() * 900) + 100}-${formData.name.substring(0, 3).toUpperCase()}`,
    };

    addPet(newPet);
    navigate(`/pets/${newPet.id}`);
  };

  // Motion variants for small step transitions
  const stepVariants = {
    initial: { opacity: 0, x: 10 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -10 }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      <DashboardNav />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 flex flex-col">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => step > 1 ? setStep((step - 1) as 1|2) : navigate('/dashboard')}
            className="flex items-center gap-2 text-[#7A6B61] hover:text-[#241812] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-2 h-2 rounded-full ${step >= s ? 'bg-[#DE6828]' : 'bg-[#E5D7C7]'}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#E9DCcb] p-6 sm:p-10 flex-1">
          <AnimatePresence mode="wait">
            
            {/* STAGE A: Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#241812] mb-2">Pet Details</h1>
                  <p className="text-[#6F5D52] text-sm">Let's start with the basics to build their safety profile.</p>
                </div>

                <form id="details-form" onSubmit={handleNextStep1} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                        placeholder="e.g. Olive"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                          Species
                        </label>
                        <select
                          value={formData.species}
                          onChange={e => setFormData({...formData, species: e.target.value as 'dog'|'cat'|'other'})}
                          className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                        >
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                          Breed *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.breed}
                          onChange={e => setFormData({...formData, breed: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                          placeholder="e.g. Golden Retriever"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                          Age
                        </label>
                        <input
                          type="text"
                          value={formData.age}
                          onChange={e => setFormData({...formData, age: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                          placeholder="e.g. 3 years"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                          Weight
                        </label>
                        <input
                          type="text"
                          value={formData.weight}
                          onChange={e => setFormData({...formData, weight: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                          placeholder="e.g. 60 lbs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                        Coat Color & Markings
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                        placeholder="e.g. Honey gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                        Owner Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.ownerPhone}
                        onChange={e => setFormData({...formData, ownerPhone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                        placeholder="e.g. +1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#453429] uppercase tracking-wider mb-1">
                        Distinctive Features (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.distinctiveFeatures}
                        onChange={e => setFormData({...formData, distinctiveFeatures: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCCEC0] bg-[#FAF6F0] text-[#241812] text-sm focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                        placeholder="e.g. White chest patch, floppy left ear"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#DE6828] hover:bg-[#C9581B] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    Continue to Photo
                  </button>
                </form>
              </motion.div>
            )}

            {/* STAGE B: Photo + Nose Capture */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex flex-col h-full"
              >
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#241812] mb-2">Biometric Profile</h1>
                  <p className="text-[#6F5D52] text-sm">Upload a clear photo of your pet's face to map their unique snout print.</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  {/* Photo Preview & Scanner Area */}
                  <div className="relative w-full max-w-sm aspect-square bg-[#27170E] rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                    {!photoPreview ? (
                      <div className="text-center p-6">
                        <Camera className="w-10 h-10 text-[#DE6828]/50 mx-auto mb-3" />
                        <p className="text-sm text-[#D8C7BA]">No photo selected</p>
                      </div>
                    ) : (
                      <>
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        
                        {/* Scanning Ray / Grid Animation */}
                        {isScanning && (
                          <div className="absolute inset-0 bg-[#DE6828]/20 flex flex-col items-center justify-center">
                            <div className="w-full h-1 bg-[#DE6828] shadow-[0_0_15px_#DE6828] animate-pulse" />
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 border border-[#DE6828]/40" />
                          </div>
                        )}

                        {/* Verified Geometric Vector Points when complete */}
                        {scanComplete && (
                          <div className="absolute inset-0 bg-[#34A853]/15 flex items-center justify-center pointer-events-none">
                            <div className="absolute top-[35%] left-[38%] w-2 h-2 rounded-full bg-[#34A853] shadow-[0_0_8px_#34A853]" />
                            <div className="absolute top-[35%] right-[38%] w-2 h-2 rounded-full bg-[#34A853] shadow-[0_0_8px_#34A853]" />
                            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#DE6828] shadow-[0_0_10px_#DE6828]" />
                            <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-dashed border-[#34A853]" />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions for Step 2 */}
                  <div className="w-full max-w-sm space-y-3">
                    <label className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#DE6828] text-[#DE6828] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FAF6F0] transition-colors">
                      <Camera className="w-5 h-5" />
                      <span>{photoPreview ? 'Change Photo' : 'Upload Pet Photo'}</span>
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
                        className="w-full py-3.5 rounded-xl bg-[#241812] text-white font-bold text-sm shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Mapping biometrics...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Capture Nose-Print Identity
                          </>
                        )}
                      </button>
                    )}

                    {scanComplete && (
                      <div className="p-3 bg-green-50 text-green-800 rounded-xl text-xs font-medium text-center border border-green-200">
                        Biometric vectors securely captured.
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleNextStep2}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors ${
                    scanComplete ? 'bg-[#DE6828] hover:bg-[#C9581B] text-white' : 'bg-[#E5D7C7] text-[#8A796E] cursor-not-allowed'
                  }`}
                >
                  Continue to Confirmation
                </button>
              </motion.div>
            )}

            {/* STAGE C: Confirmation */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ duration: 0.2 }}
                className="space-y-8 flex flex-col items-center text-center py-6"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#241812] mb-3">Profile Ready</h1>
                  <p className="text-[#6F5D52] text-sm max-w-sm mx-auto">
                    {formData.name}'s biometric profile has been created. A unique Smart QR tag will now be generated to keep them safe.
                  </p>
                </div>

                <div className="w-full p-4 bg-[#FAF6F0] rounded-2xl border border-[#E9DCcb] flex items-center gap-4 text-left">
                  <img src={photoPreview || ''} alt="Pet" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-[#241812]">{formData.name}</div>
                    <div className="text-xs text-[#6F5D52]">{formData.breed}</div>
                    <div className="text-xs font-mono text-[#DE6828] mt-1">Status: Protected</div>
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full py-4 rounded-xl bg-[#34A853] hover:bg-[#2E9447] text-white font-bold text-base shadow-md transition-colors mt-4"
                >
                  Save & Generate Tag
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
