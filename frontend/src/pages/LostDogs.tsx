import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  ArrowRight, 
  Radio, 
  Clock, 
  X,
  ScanLine,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { IncidentCard } from '../components/IncidentCard';
import { getExplicitSpecies } from '../utils/species';

export default function LostDogs() {
  const navigate = useNavigate();
  const { alerts, isLoading, hydrated, error, hydrate } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat' | 'other'>('all');

  // Compute live species distribution without heuristics
  const canineCount = activeAlerts.filter(a => getExplicitSpecies(a) === 'dog').length;
  const felineCount = activeAlerts.filter(a => getExplicitSpecies(a) === 'cat').length;
  const otherCount = activeAlerts.filter(a => {
    const s = getExplicitSpecies(a);
    return s === 'other' || s === 'unknown';
  }).length;

  // Client-side filtering across genuine backend records (Contract C2 Invariant)
  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSearch = 
      alert.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.lastSeenAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedSpecies === 'all') return matchesSearch;
    const species = getExplicitSpecies(alert);
    if (selectedSpecies === 'dog') return matchesSearch && species === 'dog';
    if (selectedSpecies === 'cat') return matchesSearch && species === 'cat';
    if (selectedSpecies === 'other') return matchesSearch && (species === 'other' || species === 'unknown');
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 pb-32">
        
        {/* Top Operational Header Bar */}
        <header className="mb-8 border-b border-[var(--color-border)] pb-8 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Radio className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
                <span>ACTIVE RECOVERY NETWORK // FIELD DISPATCH LEDGER</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-3 text-[var(--color-ink)]">
                Recovery Board
              </h1>
              <p className="text-sm sm:text-base text-[var(--color-ink-soft)] font-sans leading-relaxed">
                Active municipal search & recovery declarations. Every sighting logged into the ledger provides critical telemetry to assist in family reunification.
              </p>
            </div>
            
            {/* Quick Emergency Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/scan"
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-sm border-2 border-[var(--color-ink)] bg-white hover:bg-[var(--color-bone)] text-[var(--color-ink)] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:translate-y-[1px] min-h-[48px] sm:min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <ScanLine className="w-4 h-4 text-[var(--color-accent-text)]" aria-hidden="true" />
                <span>Scan Found Dog</span>
              </Link>
              <Link 
                to="/lost/new" 
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-sm bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:translate-y-[1px] min-h-[48px] sm:min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Report Missing Pet</span>
              </Link>
            </div>
          </div>

          {/* Telemetry Count Summary Strip */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-ink-soft)]">
            <span className="flex items-center gap-1.5 font-bold text-[var(--color-ink)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)]" />
              <span>{activeAlerts.length} Active Incidents</span>
            </span>
            <span aria-hidden="true">•</span>
            <span>{canineCount} Canines</span>
            <span aria-hidden="true">•</span>
            <span>{felineCount} Felines</span>
            {otherCount > 0 && (
              <>
                <span aria-hidden="true">•</span>
                <span>{otherCount} Other / Unconfirmed</span>
              </>
            )}
            <span aria-hidden="true" className="hidden sm:inline">•</span>
            <span className="text-[11px] text-[var(--color-ink-soft)]/90 hidden sm:inline">
              Citizen telemetry verified • Residential addresses privacy-masked
            </span>
          </div>
        </header>

        {/* Distressed Guardian Crisis Banner */}
        <section 
          aria-label="Emergency Pet Reporting Assistance" 
          className="mb-8 p-4 sm:p-5 bg-white border border-[var(--color-border)] border-l-4 border-l-[var(--color-marigold)] rounded-sm shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-sm bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)]/30 text-[var(--color-accent-text)] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[var(--color-ink)]">
                Missing a Companion in Your Neighborhood?
              </h2>
              <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed font-sans mt-0.5">
                Immediate publication alerts local searchers and activates your companion's public collar QR tag.
              </p>
            </div>
          </div>
          <Link
            to="/lost/new"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent-text)] hover:text-[#5C3100] hover:underline shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            <span>Declare Missing Companion</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </section>

        {/* Filter & Search Toolbar */}
        <section aria-label="Incident Search & Species Filters" className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            
            {/* Live Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[var(--color-ink-soft)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input 
                type="text"
                placeholder="Search by name, breed, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search incident alerts by name, breed, or location"
                className="w-full pl-10 pr-10 py-2.5 rounded-sm bg-white border border-[var(--color-border)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-all min-h-[48px] sm:min-h-[44px]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Species Filter Tablist */}
            <div 
              role="tablist" 
              aria-label="Filter incidents by species"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
            >
              <button
                role="tab"
                id="tab-species-all"
                aria-selected={selectedSpecies === 'all'}
                aria-controls="incidents-panel"
                onClick={() => setSelectedSpecies('all')}
                className={`px-3.5 py-2 rounded-sm text-xs font-mono font-bold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  selectedSpecies === 'all'
                    ? 'bg-[var(--color-ink)] text-white shadow-xs'
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bone)]/50'
                }`}
              >
                All Alerts ({activeAlerts.length})
              </button>

              <button
                role="tab"
                id="tab-species-dog"
                aria-selected={selectedSpecies === 'dog'}
                aria-controls="incidents-panel"
                onClick={() => setSelectedSpecies('dog')}
                className={`px-3.5 py-2 rounded-sm text-xs font-mono font-bold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  selectedSpecies === 'dog'
                    ? 'bg-[var(--color-ink)] text-white shadow-xs'
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bone)]/50'
                }`}
              >
                Canines ({canineCount})
              </button>

              <button
                role="tab"
                id="tab-species-cat"
                aria-selected={selectedSpecies === 'cat'}
                aria-controls="incidents-panel"
                onClick={() => setSelectedSpecies('cat')}
                className={`px-3.5 py-2 rounded-sm text-xs font-mono font-bold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  selectedSpecies === 'cat'
                    ? 'bg-[var(--color-ink)] text-white shadow-xs'
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bone)]/50'
                }`}
              >
                Felines ({felineCount})
              </button>

              {otherCount > 0 && (
                <button
                  role="tab"
                  id="tab-species-other"
                  aria-selected={selectedSpecies === 'other'}
                  aria-controls="incidents-panel"
                  onClick={() => setSelectedSpecies('other')}
                  className={`px-3.5 py-2 rounded-sm text-xs font-mono font-bold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                    selectedSpecies === 'other'
                      ? 'bg-[var(--color-ink)] text-white shadow-xs'
                      : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bone)]/50'
                  }`}
                >
                  Other ({otherCount})
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Board Listing Content */}
        <section id="incidents-panel" aria-label="Incident Docket Grid">
          {error ? (
            /* Recovery Network Error State */
            <div 
              role="alert" 
              className="py-16 px-6 text-center flex flex-col items-center border border-[var(--color-border)] bg-white rounded-sm p-8 sm:p-12 shadow-xs animate-in fade-in duration-300"
            >
              <div className="w-14 h-14 mb-4 bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 rounded-sm flex items-center justify-center">
                <ShieldAlert className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-ink)] mb-2 tracking-tight">
                Network Synchronization Unavailable
              </h2>
              <p className="text-[var(--color-ink-soft)] text-sm max-w-md mx-auto leading-relaxed font-sans mb-6">
                {error}
              </p>
              <button
                type="button"
                onClick={() => hydrate()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[var(--color-ink)] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <span>Retry Connection</span>
              </button>
            </div>
          ) : (isLoading || !hydrated) ? (
            /* Hydration Skeleton State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse" aria-label="Loading active recovery alerts" aria-busy="true">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-[var(--color-border)] rounded-sm overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="aspect-[16/10] bg-[var(--color-bone)]/70" />
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="h-6 bg-[var(--color-bone)] rounded-sm w-3/4" />
                      <div className="h-4 bg-[var(--color-bone)] rounded-sm w-1/2" />
                    </div>
                    <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
                      <div className="h-3 bg-[var(--color-bone)] rounded-sm w-full" />
                      <div className="h-3 bg-[var(--color-bone)] rounded-sm w-4/5" />
                    </div>
                    <div className="pt-5 border-t border-[var(--color-border)] flex gap-2">
                      <div className="h-10 bg-[var(--color-bone)] rounded-sm flex-1" />
                      <div className="h-10 bg-[var(--color-bone)] rounded-sm flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeAlerts.length === 0 ? (
            /* Zero-Incident State (Network Clear) */
            <div className="py-20 px-6 text-center flex flex-col items-center border border-[var(--color-border)] bg-white rounded-sm p-8 sm:p-12 shadow-xs animate-in fade-in duration-300">
              <div className="w-14 h-14 mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-ink)] mb-2 tracking-tight">
                No Active Recovery Incidents
              </h2>
              <p className="text-[var(--color-ink-soft)] text-sm max-w-md mx-auto leading-relaxed font-sans mb-6">
                The community recovery network is currently secure. Zero missing companion declarations are active on record.
              </p>
              <Link 
                to="/lost/new" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[var(--color-alert-clay)] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#9A3926] transition-colors min-h-[44px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Report Missing Pet</span>
              </Link>
            </div>
          ) : filteredAlerts.length === 0 ? (
            /* Search / Filter Empty State */
            <div className="py-16 px-6 text-center flex flex-col items-center border border-[var(--color-border)] bg-white rounded-sm p-8 shadow-xs animate-in fade-in">
              <Search className="w-10 h-10 text-[var(--color-ink-soft)] opacity-40 mb-3" aria-hidden="true" />
              <h2 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-2">
                No Matching Alerts Found
              </h2>
              <p className="text-[var(--color-ink-soft)] text-sm max-w-sm mx-auto font-sans leading-relaxed mb-6">
                No active recovery records match your filter: <strong className="text-[var(--color-ink)] font-semibold">"{searchQuery || selectedSpecies}"</strong>.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedSpecies('all'); }}
                className="px-6 py-3 rounded-sm bg-[var(--color-ink)] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Active Alerts Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
              {filteredAlerts.map(alert => (
                <IncidentCard
                  key={alert.id}
                  alert={alert}
                  onReportSighting={() => navigate(`/sightings/new?alertId=${alert.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
