import React, { useMemo, useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { PetCard } from '../components/PetCard';
import { Link } from 'react-router-dom';
import { 
  Plus, ShieldAlert, ArrowRight, Activity, 
  MapPin, Search, AlertCircle, RefreshCw, LayoutGrid, List as ListIcon 
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const { pets, alerts, hydrated, isLoading, error, hydrate } = usePetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');

  // Rigorous status separation:
  const lostPets = useMemo(() => pets.filter(p => p.status === 'lost' || p.status === 'sightings_reported'), [pets]);
  const activePets = useMemo(() => pets.filter(p => p.status !== 'lost' && p.status !== 'sightings_reported'), [pets]);
  const safePets = useMemo(() => pets.filter(p => p.status === 'safe'), [pets]);
  const unreviewedPets = useMemo(() => pets.filter(p => p.status !== 'lost' && p.status !== 'sightings_reported' && p.status !== 'safe'), [pets]);
  const hasLostPet = lostPets.length > 0;

  // Filtered active pets based on search query
  const filteredActivePets = useMemo(() => {
    if (!searchQuery.trim()) return activePets;
    const query = searchQuery.toLowerCase();
    return activePets.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.breed.toLowerCase().includes(query) ||
      (p.color && p.color.toLowerCase().includes(query)) ||
      (p.microchipId && p.microchipId.toLowerCase().includes(query))
    );
  }, [activePets, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans selection:bg-[var(--color-ink)] selection:text-white">
      <DashboardNav />
      
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 w-full max-w-6xl mx-auto px-6 py-10 md:py-16 md:pb-16 pb-32">
        
        {/* 1. CONSOLE TELEMETRY HEADER */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-8">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-3">
              Console
            </h1>
            <div className="flex items-center gap-3">
              {hasLostPet ? (
                <>
                  <span className="relative flex h-3.5 w-3.5" aria-hidden="true">
                    <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-[var(--color-alert-clay)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--color-alert-clay)]"></span>
                  </span>
                  <span className="text-xs font-bold text-[var(--color-alert-clay)] uppercase tracking-[0.2em]">
                    Active Recovery Protocol ({lostPets.length})
                  </span>
                </>
              ) : pets.length > 0 ? (
                <>
                  {error ? (
                    <>
                      <span className="h-3 w-3 rounded-full bg-[var(--color-marigold)]" aria-hidden="true"></span>
                      <span className="text-xs font-bold text-[var(--color-accent-text)] uppercase tracking-[0.2em]">
                        Offline Notice
                      </span>
                    </>
                  ) : unreviewedPets.length > 0 ? (
                    <>
                      <span className="h-3 w-3 rounded-full bg-[var(--color-marigold)]" aria-hidden="true"></span>
                      <span className="text-xs font-bold text-[var(--color-accent-text)] uppercase tracking-[0.2em]">
                        Review Required ({unreviewedPets.length})
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-3 w-3 rounded-full bg-[var(--color-success)]" aria-hidden="true"></span>
                      <span className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em]">
                        All Companions Safe ({safePets.length})
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className={`h-3 w-3 rounded-full ${error ? 'bg-[var(--color-alert-clay)]' : 'bg-[var(--color-border)]'}`} aria-hidden="true"></span>
                  <span className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em]">
                    {error ? 'Sync Unavailable' : isLoading ? 'Connecting...' : 'Console Ready'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Add CTA in Header */}
          <Link 
            to="/pets/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-white hover:bg-[var(--color-surface-dark-raised)] rounded-full font-bold text-xs uppercase tracking-widest transition-all min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Add Pet</span>
          </Link>
        </header>

        {/* 2. ERROR STATE (If API hydration failed or network error occurred) */}
        {error && (
          <div className="mb-12 p-6 rounded-[var(--radius-24)] bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-[var(--color-alert-clay)] shrink-0" />
              <div>
                <p className="font-bold text-sm text-[var(--color-ink)]">
                  {pets.length === 0 ? "Network Synchronization Error" : "Companion Records Out of Sync"}
                </p>
                <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                  {error} {pets.length > 0 && "Displaying currently loaded records."}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => hydrate()}
              className="gap-2 min-h-[44px]"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Retry Sync</span>
            </Button>
          </div>
        )}

        {/* 3. LOADING SKELETONS (Prevent Flash of Empty State) */}
        {(!hydrated || isLoading) && pets.length === 0 && (
          <div className="space-y-6 animate-pulse motion-reduce:animate-none">
            <div className="h-6 w-48 bg-[var(--color-border)] rounded-md mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 rounded-[var(--radius-28)] bg-white/70 border border-[var(--color-border)] p-4 flex flex-col justify-between">
                  <div className="h-48 w-full bg-[var(--color-bone)] rounded-[var(--radius-24)]" />
                  <div className="space-y-2 mt-4">
                    <div className="h-6 w-3/4 bg-[var(--color-bone)] rounded" />
                    <div className="h-4 w-1/2 bg-[var(--color-bone)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TRUE EMPTY STATE (Only when hydrated and genuinely 0 pets) */}
        {hydrated && !isLoading && pets.length === 0 && !error && (
          <div className="py-20 px-8 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-28)] bg-white/50 text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-marigold)]/10 text-[var(--color-accent-text)] flex items-center justify-center mx-auto mb-6">
              <Plus size={28} />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-3 tracking-tight">
              No Registered Companions
            </h2>
            <p className="text-[var(--color-ink-soft)] mb-8 text-base leading-relaxed max-w-lg mx-auto">
              Enroll your pet to generate their verifiable biometric nose-print and collar QR tag. If they ever wander, the SafePaws community network can identify and safeguard them instantly.
            </p>
            <Link 
              to="/pets/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-ink)] text-white hover:bg-[var(--color-surface-dark-raised)] rounded-full font-bold text-xs uppercase tracking-widest transition-all min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>Begin First Enrollment</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* 5. URGENT CRISIS INCIDENTS (Priority Section if lost pets exist) */}
        {hasLostPet && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--color-alert-clay)]/20 pb-4">
              <h2 className="text-xs font-bold text-[var(--color-alert-clay)] uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldAlert size={16} /> 
                <span>Active Incidents ({lostPets.length})</span>
              </h2>
            </div>
            
            <div className="flex flex-col gap-6">
              {lostPets.map((pet) => {
                const activeAlert = alerts.find(a => a.petId === pet.id);
                return (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    viewMode="crisis" 
                    activeAlert={activeAlert} 
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* 6. COMPANION PROFILES (Active records with explicit status badges) */}
        {activePets.length > 0 && (
          <section className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[var(--color-border)] pb-4">
              <div>
                <h2 className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em]">
                  Companion Profiles ({activePets.length})
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search Bar if 4+ pets */}
                {activePets.length >= 4 && (
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                    <input
                      type="text"
                      placeholder="Search pets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-full bg-white border border-[var(--color-border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] w-40 sm:w-48 min-h-[44px]"
                      aria-label="Filter pets by name or breed"
                    />
                  </div>
                )}

                {/* View Mode Toggle if 3+ pets */}
                {activePets.length >= 3 && (
                  <div className="inline-flex rounded-full bg-white border border-[var(--color-border)] p-1 gap-1" role="group" aria-label="Layout view options">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-pressed={viewMode === 'grid'}
                      className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                        viewMode === 'grid' 
                          ? 'bg-[var(--color-ink)] text-white shadow-xs font-bold' 
                          : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)]'
                      }`}
                      aria-label="Grid view"
                      title="Grid view"
                    >
                      <LayoutGrid size={16} aria-hidden="true" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('row')}
                      aria-pressed={viewMode === 'row'}
                      className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                        viewMode === 'row' 
                          ? 'bg-[var(--color-ink)] text-white shadow-xs font-bold' 
                          : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)]'
                      }`}
                      aria-label="List row view"
                      title="List row view"
                    >
                      <ListIcon size={16} aria-hidden="true" />
                      <span className="hidden sm:inline">List</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Cards Display */}
            {viewMode === 'row' ? (
              <div className="flex flex-col gap-4">
                {filteredActivePets.map((pet) => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    viewMode="row" 
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivePets.map((pet) => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    viewMode="grid" 
                  />
                ))}
              </div>
            )}

            {filteredActivePets.length === 0 && searchQuery && (
              <div className="text-center py-12 text-[var(--color-ink-soft)] text-sm">
                No pets matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
