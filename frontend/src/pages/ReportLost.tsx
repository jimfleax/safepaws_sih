import React, { useState, useEffect } from 'react';
import { ApiClient } from '../utils/apiClient';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ArrowLeft, 
  Activity, 
  MapPin, 
  AlignLeft, 
  CheckCircle2, 
  Info,
  Radio
} from 'lucide-react';

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
      setError(err.message || 'Failed to trigger emergency alert. Please check connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 max-w-6xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32">
        
        {/* Navigation Breadcrumb */}
        <Link 
          to="/lost" 
          className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors font-mono text-xs tracking-wider uppercase mb-10 min-h-[44px] min-w-[44px] py-2"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Recovery Board</span>
        </Link>
        
        {/* Page Header - Instant Tier 3 Crisis Rendering (0ms delay) */}
        <header className="mb-12 border-b border-[var(--color-border)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ACTIVE RECOVERY REGISTRY</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3 text-[var(--color-ink)]">
            Declare Missing Companion
          </h1>
          <p className="text-base md:text-lg text-[var(--color-ink-soft)] font-light leading-relaxed max-w-2xl">
            Activate an official community alert. We log your companion's profile, description, and last known location in the public recovery ledger for community members and searchers to reference.
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] font-medium flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold block mb-0.5">Alert Transmission Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Empty / No Eligible Pets State */}
        {safePets.length === 0 ? (
          <div className="py-20 text-center border border-[var(--color-border)] bg-white rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-ink-soft)]">
              <ShieldAlert className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-3">
              No Eligible Pet Profiles Available
            </h3>
            <p className="text-[var(--color-ink-soft)] text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
              All registered pets on your account either have an active missing alert or no pets are registered yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[var(--color-ink)] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px]"
              >
                Return to Owner Console
              </Link>
              <Link 
                to="/lost" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-ink)] font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-surface)] transition-colors min-h-[44px]"
              >
                View Active Alerts
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Form Section */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
                
                {/* Step 1: Pet Selection */}
                <div className="space-y-2">
                  <label htmlFor="pet-select" className="text-xs font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[var(--color-marigold)]" />
                    <span>01. Select Pet Profile</span>
                  </label>
                  <div className="relative">
                    <select 
                      id="pet-select"
                      value={selectedPet}
                      onChange={(e) => setSelectedPet(e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-base font-semibold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] transition-all cursor-pointer"
                      required
                      disabled={isSubmitting}
                    >
                      {safePets.map(pet => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.breed || 'Canine Companion'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[11px] text-[var(--color-ink-soft)] font-light block">
                    Only verified pets in 'Safe' status can be reported.
                  </span>
                </div>
                
                {/* Step 2: Last Seen Vector */}
                <div className="space-y-2">
                  <label htmlFor="last-seen" className="text-xs font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--color-alert-clay)]" />
                    <span>02. Last Known Location / Cross Streets</span>
                  </label>
                  <input
                    type="text"
                    id="last-seen"
                    value={lastSeen}
                    onChange={(e) => setLastSeen(e.target.value)}
                    placeholder="e.g. Central Park near West 72nd St entrance"
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] transition-all placeholder:text-[var(--color-ink-soft)]/50"
                    required
                    disabled={isSubmitting}
                  />
                  <span className="text-[11px] text-[var(--color-ink-soft)] font-light block">
                    Approximate neighborhood or street landmark where your pet was last spotted.
                  </span>
                </div>
                
                {/* Step 3: Description & Context */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-xs font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft className="w-4 h-4 text-[var(--color-marigold)]" />
                    <span>03. Context, Behavior & Observations</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe collar color, tags, behavior if approached (e.g. timid, friendly), distinctive marks, or direction headed..."
                    rows={4}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] transition-all placeholder:text-[var(--color-ink-soft)]/50 resize-none leading-relaxed"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Submit Action */}
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-alert-clay)] disabled:opacity-50 min-h-[44px]"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{isSubmitting ? 'Publishing Alert...' : 'Publish Missing Pet Alert'}</span>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Protocol Information Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[var(--color-ink)]">
                    Activation Protocol
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mb-6 font-light">
                  When an alert is published, your companion's active incident record is logged in the SafePaws recovery registry:
                </p>
                <ul className="space-y-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-ink)]">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1 shrink-0" />
                    <span>
                      <strong className="block font-semibold">Public QR Tag Status</strong>
                      Anyone scanning the collar tag sees an active missing status with direct sighting submission options.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1 shrink-0" />
                    <span>
                      <strong className="block font-semibold">Active Incident Registry</strong>
                      An incident notice is posted in the community recovery ledger for searchers and neighbors to reference.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1 shrink-0" />
                    <span>
                      <strong className="block font-semibold">Biometric Match Identification</strong>
                      Field observations submitted through the biometric scanner can be cross-referenced against your pet's registered record.
                    </span>
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