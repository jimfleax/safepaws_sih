import React, { useState, useEffect } from 'react';
import { ApiClient } from '../utils/apiClient';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ArrowLeft, Activity, MapPin, AlignLeft } from 'lucide-react';

export default function ReportLost() {
  const { pets } = usePetStore();
  const navigate = useNavigate();
  
  const safePets = pets.filter(p => p.status !== 'lost');
  const [selectedPet, setSelectedPet] = useState(safePets.length > 0 ? safePets[0].id : '');

  useEffect(() => {
    if (!selectedPet && safePets.length > 0) {
      setSelectedPet(safePets[0].id);
    }
  }, [safePets, selectedPet]);

  const [lastSeen, setLastSeen] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    
    const pet = pets.find(p => p.id === selectedPet);
    if (!pet) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await ApiClient.createAlert({
        petId: pet.id,
        lastSeenAddress: lastSeen,
        description: description
      });
      await usePetStore.getState().hydrate();
      navigate(`/alerts/${res.id}`);
    } catch (err: any) {
      console.error('Failed to create alert:', err);
      setError(err.message || 'Failed to trigger alert. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32">
        <Link to="/lost" className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors font-bold text-xs tracking-widest uppercase mb-12">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Directory
        </Link>
        
        <header className="mb-14 border-b border-[var(--color-ink)]/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-[var(--color-alert)]" />
            <span className="text-xs font-bold text-[var(--color-alert)] uppercase tracking-widest">Emergency Broadcast System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4 text-[var(--color-ink)]">
            Declare Missing Identity
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
            Trigger a Level-1 community alert. We will notify nearby neighbors and push the biometric signature to the active tracking network immediately.
          </p>
        </header>

        {error && (
          <div className="mb-10 p-5 bg-[var(--color-alert)]/10 border-l-4 border-[var(--color-alert)] text-[var(--color-ink)] font-medium flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--color-alert)] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {safePets.length === 0 ? (
          <div className="py-20 text-center animate-in fade-in duration-700 delay-300 fill-mode-both ease-out border border-[var(--color-ink)]/10 bg-white/40 shadow-sm">
            <div className="w-20 h-20 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} className="text-[var(--color-ink-soft)]" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-4">No Secured Profiles Available</h3>
            <p className="text-[var(--color-ink-soft)] text-lg max-w-md mx-auto mb-8">
              There are no safe pets associated with your account capable of triggering an alert.
            </p>
            <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-4 border-2 border-[var(--color-ink)] text-[var(--color-ink)] font-bold uppercase tracking-widest hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] transition-colors">
              Return to Console
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            <div className="lg:col-span-8 animate-in fade-in duration-700 delay-300 fill-mode-both ease-out">
              <form onSubmit={handleSubmit} className="space-y-12">
                
                <div className="space-y-4">
                  <label htmlFor="pet-select" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> 01. Select Profile Identity
                  </label>
                  <select 
                    id="pet-select"
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-4 text-3xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-alert)] transition-colors cursor-pointer appearance-none"
                    required
                    disabled={isSubmitting}
                  >
                    {safePets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-4">
                  <label htmlFor="last-seen" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> 02. Last Known Vector
                  </label>
                  <input
                    type="text"
                    id="last-seen"
                    value={lastSeen}
                    onChange={(e) => setLastSeen(e.target.value)}
                    placeholder="e.g. Central Park near 72nd St entrance"
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-4 text-3xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-alert)] transition-colors placeholder:text-[var(--color-ink)]/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-4">
                  <label htmlFor="description" className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft size={14} /> 03. Context & Intelligence
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe collar color, behavior if approached, or direction headed..."
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-[var(--color-ink)]/20 py-4 text-2xl font-serif text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-alert)] transition-colors placeholder:text-[var(--color-ink)]/20 resize-none leading-relaxed"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-12 py-5 bg-[var(--color-alert)] text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#9A3926] transition-colors shadow-md disabled:opacity-50"
                  >
                    <ShieldAlert size={20} />
                    {isSubmitting ? 'Transmitting Data...' : 'Broadcast Alert'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="lg:col-span-4 animate-in fade-in duration-700 delay-500 fill-mode-both ease-out">
              <div className="bg-white/60 border border-[var(--color-ink)]/10 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert size={24} className="text-[var(--color-alert)]" />
                  <h3 className="text-xl font-serif font-bold text-[var(--color-ink)]">Protocol Initiated</h3>
                </div>
                <p className="text-[var(--color-ink-soft)] leading-relaxed mb-6">
                  Upon submission, the pet's secured biometric profile will be unlocked and pushed to the public recovery tracking network.
                </p>
                <ul className="space-y-4 pt-4 border-t border-[var(--color-ink)]/10">
                  <li className="flex gap-3 text-[var(--color-ink)] font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert)] mt-1.5 shrink-0" />
                    Local users within 10km notified
                  </li>
                  <li className="flex gap-3 text-[var(--color-ink)] font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert)] mt-1.5 shrink-0" />
                    QR tag flags as Missing on scan
                  </li>
                  <li className="flex gap-3 text-[var(--color-ink)] font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert)] mt-1.5 shrink-0" />
                    Biometric matching activated
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
