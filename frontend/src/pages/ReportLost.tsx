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
  Radio,
  PawPrint,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { getExplicitSpecies } from '../utils/species';
import { Badge } from '../components/ui/Badge';
import { LedgerStatusStamp } from '../components/ui/LedgerStatusStamp';

export default function ReportLost() {
  const { pets, isLoading, hydrated, error: storeError, hydrate } = usePetStore();
  const navigate = useNavigate();
  
  const safePets = pets.filter(p => p.status !== 'lost');
  const [selectedPetId, setSelectedPetId] = useState(safePets.length > 0 ? safePets[0].id : '');

  useEffect(() => {
    if (!selectedPetId && safePets.length > 0) {
      setSelectedPetId(safePets[0].id);
    }
  }, [safePets, selectedPetId]);

  const [lastSeen, setLastSeen] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Selected pet profile reference
  const selectedPet = pets.find(p => p.id === selectedPetId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !selectedPet) {
      setError('Please select an enrolled companion profile before publishing.');
      return;
    }

    if (!lastSeen.trim()) {
      setError('Please provide the approximate last known vicinity or cross streets.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide observations, temperament, and distinctive features.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await ApiClient.createAlert({
        petId: selectedPet.id,
        lastSeenAddress: lastSeen.trim(),
        description: description.trim()
      });
      await usePetStore.getState().hydrate();
      navigate(`/alerts/${res.id}`);
    } catch (err: any) {
      console.error('Failed to create alert:', err);
      setError(err.message || 'Failed to trigger emergency alert. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 pb-32">
        
        {/* Navigation Breadcrumb */}
        <Link 
          to="/lost" 
          className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors font-mono text-xs tracking-wider uppercase mb-8 min-h-[44px] py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          <span>Back to Recovery Board</span>
        </Link>
        
        {/* Page Header: High-Urgency Crisis Triage Surface */}
        <header className="mb-10 border-b border-[var(--color-border)] pb-8 animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
            <span>ACTIVE RECOVERY REGISTRY // CRISIS TRIAGE DESK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-3 text-[var(--color-ink)]">
            Declare Missing Companion
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-ink-soft)] font-sans leading-relaxed max-w-2xl">
            Publish an emergency recovery docket. Your companion's registered traits, collar QR status, and last known vicinity will be logged in the public recovery ledger for neighborhood searchers to reference.
          </p>
        </header>

        {/* Global Error Alert */}
        {error && (
          <div 
            role="alert" 
            aria-live="assertive" 
            className="mb-8 p-4 sm:p-5 rounded-sm bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] font-medium flex items-start gap-3 animate-in fade-in"
          >
            <AlertTriangle className="w-5 h-5 text-[var(--color-alert-clay)] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <span className="font-bold block mb-0.5">Alert Transmission Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* State 1: Registry Hydration Loading State */}
        {(isLoading && !hydrated) ? (
          <div 
            role="status" 
            aria-live="polite" 
            className="py-20 text-center border border-[var(--color-border)] bg-white rounded-sm p-8 sm:p-12 shadow-xs"
          >
            <div className="w-8 h-8 border-3 border-[var(--color-marigold)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-[var(--color-ink)] mb-1">
              Accessing SafePaws Registry
            </h2>
            <p className="text-xs font-mono text-[var(--color-ink-soft)] uppercase tracking-wider">
              Retrieving enrolled companion profiles & recovery tag records...
            </p>
          </div>
        ) : (storeError && !hydrated && pets.length === 0) ? (
          /* State 2: Network Synchronization Error State (Contract C6) */
          <div 
            role="alert" 
            className="py-16 text-center border border-[var(--color-border)] bg-white rounded-sm p-8 sm:p-12 shadow-xs"
          >
            <div className="w-12 h-12 bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] rounded-sm flex items-center justify-center mx-auto mb-4 border border-[var(--color-alert-clay)]/20">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-2">
              Unable to Synchronize Pet Registry
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] max-w-md mx-auto mb-6 leading-relaxed">
              {storeError}
            </p>
            <button
              type="button"
              onClick={() => hydrate()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[var(--color-ink)] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>Retry Registry Connection</span>
            </button>
          </div>
        ) : (pets.length === 0) ? (
          /* State 3: Empathetic Unregistered Pet Experience (Contract C5) */
          <div className="border border-[var(--color-border)] bg-white rounded-sm p-8 sm:p-12 shadow-xs max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-sm bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-alert-clay)] uppercase block">
                  REGISTRATION PREREQUISITE
                </span>
                <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)]">
                  No Enrolled Companion Profiles on Record
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[var(--color-ink)]/90 leading-relaxed font-sans mb-8">
              <p>
                We recognize this is an intensely stressful and urgent moment. SafePaws missing pet alerts are linked directly to an enrolled pet profile so that when neighbors scan a collar QR tag or report a sighting, your companion's microchip, medical needs, and secure contact channels are instantly connected.
              </p>
              <p className="bg-[var(--color-bone)]/80 p-4 rounded-sm border border-[var(--color-border)] text-xs text-[var(--color-ink-soft)]">
                <strong className="text-[var(--color-ink)] block font-semibold mb-1">
                  Registration takes approximately 60 seconds.
                </strong>
                Once your pet's profile is created, you can immediately publish an emergency missing alert to the public recovery board.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--color-border)]">
              <Link 
                to="/pets/new" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm bg-[var(--color-alert-clay)] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#9A3926] transition-colors min-h-[48px] sm:min-h-[44px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <span>Enroll Companion Profile (~60s)</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link 
                to="/lost" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-sm bg-white border border-[var(--color-border)] text-[var(--color-ink)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-bone)] transition-colors min-h-[48px] sm:min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <span>Search Existing Alerts</span>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-[11px] font-mono text-[var(--color-ink-soft)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-trail)] shrink-0" aria-hidden="true" />
              <span>Truth-in-Engineering Invariant: SafePaws strictly prevents ghost alerts to protect the recovery board from false reports and extortion schemes.</span>
            </div>
          </div>
        ) : (safePets.length === 0) ? (
          /* State 4: All Registered Pets Already Marked Lost */
          <div className="py-16 text-center border border-[var(--color-border)] bg-white rounded-sm p-8 sm:p-12 shadow-xs max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-amber-50 text-amber-800 border border-amber-200 rounded-sm flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-2">
              All Enrolled Companions Currently Have Active Missing Declarations
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] max-w-md mx-auto mb-8 leading-relaxed font-sans">
              All registered pets on your account currently have active missing declarations logged in the recovery network. To review field observations or update status, visit your active incident dockets.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-sm bg-[var(--color-ink)] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                Return to Owner Console
              </Link>
              <Link 
                to="/lost" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-sm bg-white border border-[var(--color-border)] text-[var(--color-ink)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-bone)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                View Active Recovery Board
              </Link>
            </div>
          </div>
        ) : (
          /* State 5: Active Reporting Triage Funnel */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Primary Form Dossier Column */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-sm p-6 sm:p-8 shadow-xs space-y-8">
                
                {/* Step 1: Pet Identity Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pet-select" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[var(--color-marigold)]" aria-hidden="true" />
                      <span>01. Select Enrolled Companion</span>
                    </label>
                    <span className="text-[10px] font-mono text-[var(--color-ink-soft)] uppercase">
                      {safePets.length} Available Profile{safePets.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <select 
                    id="pet-select"
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    aria-describedby="pet-select-hint"
                    className="w-full bg-[var(--color-bone)]/50 border border-[var(--color-border)] rounded-sm py-3 px-3.5 text-sm font-semibold text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-all cursor-pointer min-h-[48px] sm:min-h-[44px]"
                    required
                    disabled={isSubmitting}
                  >
                    {safePets.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} — {pet.breed || 'Companion Animal'}
                      </option>
                    ))}
                  </select>

                  <span id="pet-select-hint" className="text-[11px] text-[var(--color-ink-soft)] font-sans block">
                    Only verified pets in Safe status are eligible for emergency missing declarations.
                  </span>

                  {/* Selected Pet Mini Preview Dossier */}
                  {selectedPet && (
                    <div className="mt-3 p-3.5 bg-[var(--color-bone)]/40 border border-[var(--color-border)] rounded-sm flex items-center gap-3">
                      <div className="w-12 h-12 rounded-sm bg-white border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
                        {selectedPet.photoUrl ? (
                          <img 
                            src={selectedPet.photoUrl} 
                            alt={`Profile photograph of ${selectedPet.name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Heart className="w-5 h-5 text-[var(--color-ink-soft)] stroke-1" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[var(--color-ink)] truncate">
                            {selectedPet.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] uppercase rounded-sm">
                            {selectedPet.species}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-[var(--color-ink-soft)] truncate mt-0.5">
                          {selectedPet.breed || 'Companion'} • QR Tag: #{selectedPet.qrTagId || selectedPet.id.slice(0, 6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Step 2: Last Known Location Vector (Contract C4: Privacy disclosure) */}
                <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="last-seen" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--color-alert-clay)]" aria-hidden="true" />
                      <span>02. Last Known Vicinity / Cross Streets</span>
                    </label>
                    <span className="text-[10px] font-mono text-[var(--color-alert-clay)] font-bold uppercase">
                      Mandatory
                    </span>
                  </div>

                  <input
                    type="text"
                    id="last-seen"
                    value={lastSeen}
                    onChange={(e) => setLastSeen(e.target.value)}
                    placeholder="e.g. Central Park near West 72nd St entrance, or Sector 4 Market"
                    aria-describedby="last-seen-hint"
                    className="w-full bg-[var(--color-bone)]/50 border border-[var(--color-border)] rounded-sm py-3 px-3.5 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-all placeholder:text-[var(--color-ink-soft)]/60 min-h-[48px] sm:min-h-[44px]"
                    required
                    disabled={isSubmitting}
                  />

                  <div id="last-seen-hint" className="p-3 bg-[var(--color-bone)]/60 border border-[var(--color-border)] rounded-sm flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[var(--color-accent-text)] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[11px] text-[var(--color-ink-soft)] leading-normal">
                      <strong>Privacy Notice (SEC-BACKEND-01):</strong> Exact house numbers are automatically masked on the public recovery board. Neighborhood landmarks or cross streets help volunteers search without compromising your residential address.
                    </span>
                  </div>
                </div>
                
                {/* Step 3: Description, Behavior & Observations */}
                <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="description" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-2">
                      <AlignLeft className="w-4 h-4 text-[var(--color-marigold)]" aria-hidden="true" />
                      <span>03. Context, Behavior & Distinctive Traits</span>
                    </label>
                    <span className="text-[10px] font-mono text-[var(--color-alert-clay)] font-bold uppercase">
                      Mandatory
                    </span>
                  </div>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe collar color, tags, temperament if approached (e.g. timid, friendly), distinctive marks, favorite treats/whistles, or direction last seen heading..."
                    aria-describedby="description-hint"
                    rows={4}
                    className="w-full bg-[var(--color-bone)]/50 border border-[var(--color-border)] rounded-sm py-3 px-3.5 text-sm text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-all placeholder:text-[var(--color-ink-soft)]/60 resize-none leading-relaxed font-sans"
                    required
                    disabled={isSubmitting}
                  />

                  <span id="description-hint" className="text-[11px] text-[var(--color-ink-soft)] font-sans block">
                    Observational details help searchers identify your pet quickly and approach safely without startling them.
                  </span>
                </div>
                
                {/* Submit Action */}
                <div className="pt-6 border-t border-[var(--color-border)]">
                  <button 
                    type="submit"
                    disabled={isSubmitting || !selectedPetId || !lastSeen.trim() || !description.trim()}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:opacity-50 min-h-[48px] sm:min-h-[44px] cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                    <span>{isSubmitting ? 'Publishing Alert...' : 'Publish Missing Pet Alert'}</span>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Tactical Protocol Information Sidebar */}
            <aside aria-label="Incident Activation Protocol" className="lg:col-span-5 space-y-6">
              
              {/* Protocol Card */}
              <div className="bg-white border border-[var(--color-border)] rounded-sm p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-sm bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[var(--color-ink-soft)] uppercase block">
                      INCIDENT PROTOCOL
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[var(--color-ink)]">
                      Activation Sequence
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mb-5 font-sans">
                  Upon publishing, SafePaws executes the verified civic recovery activation sequence:
                </p>

                <ul className="space-y-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-ink)]">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1 shrink-0" />
                    <div>
                      <strong className="block font-semibold">1. Public QR Tag Shift</strong>
                      <span className="text-[var(--color-ink-soft)] leading-relaxed">
                        Scanning the collar tag (`/p/:tagId`) immediately reflects an active missing status with direct sighting submission triggers.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1 shrink-0" />
                    <div>
                      <strong className="block font-semibold">2. Recovery Board Docket</strong>
                      <span className="text-[var(--color-ink-soft)] leading-relaxed">
                        Your companion's incident dossier is published to `/lost` with residential privacy suppression.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1 shrink-0" />
                    <div>
                      <strong className="block font-semibold">3. Observational Sighting Timeline</strong>
                      <span className="text-[var(--color-ink-soft)] leading-relaxed">
                        Neighbors and volunteers can log time-stamped sightings directly to your recovery dossier.
                      </span>
                    </div>
                  </li>
                </ul>

                {/* Anti-Scam Reminder */}
                <div className="mt-6 pt-5 border-t border-[var(--color-border)] bg-amber-50/70 p-3.5 rounded-sm border border-amber-200/60">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-900 uppercase mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                    <span>Guardian Protection Policy</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-ink-soft)] leading-relaxed">
                    SafePaws never charges for pet recovery. Beware of callers demanding wire transfers or verification codes to return an animal.
                  </p>
                </div>
              </div>

            </aside>

          </div>
        )}
      </main>
    </div>
  );
}
