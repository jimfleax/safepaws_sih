import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  ArrowRight, 
  Activity, 
  Radio, 
  Clock, 
  Filter,
  Heart,
  X,
  ScanLine
} from 'lucide-react';
import { IncidentCard } from '../components/IncidentCard';

export default function LostDogs() {
  const navigate = useNavigate();
  const { alerts, isLoading, hydrated, error, hydrate } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');

  // Client-side filtering across genuine backend records
  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSearch = 
      alert.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.lastSeenAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If species filtering is applied
    if (selectedSpecies === 'all') return matchesSearch;
    // Check breed/species heuristic if available
    const isCat = alert.breed.toLowerCase().includes('cat') || alert.breed.toLowerCase().includes('feline');
    if (selectedSpecies === 'cat') return matchesSearch && isCat;
    if (selectedSpecies === 'dog') return matchesSearch && !isCat;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 min-w-0 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-[var(--color-border)] pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>ACTIVE RECOVERY NETWORK</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4 text-[var(--color-ink)]">
              Recovery Board
            </h1>
            <p className="text-base md:text-lg text-[var(--color-ink-soft)] font-light leading-relaxed">
              These active broadcasts represent companions currently missing in your community. Every observation helps reunite a family.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/scan"
              className="group inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-[var(--color-ink)] bg-white hover:bg-[var(--color-surface)] text-[var(--color-ink)] font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-[0.98] shrink-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-ink)]"
            >
              <ScanLine className="w-4 h-4 text-[var(--color-accent-text)]" />
              <span>Scan Found Dog</span>
            </Link>
            <Link 
              to="/lost/new" 
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.98] shrink-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-alert-clay)]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Missing Pet</span>
            </Link>
          </div>
        </header>

        {/* Filter & Search Toolbar */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Live Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[var(--color-ink-soft)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by name, breed, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[var(--color-border)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Species Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedSpecies('all')}
              aria-pressed={selectedSpecies === 'all'}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                selectedSpecies === 'all'
                  ? 'bg-[var(--color-ink)] text-white shadow-sm'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)]'
              }`}
            >
              All Alerts ({activeAlerts.length})
            </button>
            <button
              onClick={() => setSelectedSpecies('dog')}
              aria-pressed={selectedSpecies === 'dog'}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                selectedSpecies === 'dog'
                  ? 'bg-[var(--color-ink)] text-white shadow-sm'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)]'
              }`}
            >
              Canines
            </button>
            <button
              onClick={() => setSelectedSpecies('cat')}
              aria-pressed={selectedSpecies === 'cat'}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                selectedSpecies === 'cat'
                  ? 'bg-[var(--color-ink)] text-white shadow-sm'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)]'
              }`}
            >
              Felines
            </button>
          </div>
        </div>

        {/* Board Listing Content */}
        {(isLoading || !hydrated) ? (
          /* Hydration Skeleton State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse" aria-label="Loading active recovery alerts" aria-busy="true">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[var(--color-border)] rounded-[var(--radius-24)] overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="aspect-[16/10] bg-[var(--color-surface)]" />
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-[var(--color-bone)] rounded-md w-3/4" />
                    <div className="h-4 bg-[var(--color-bone)] rounded-md w-1/2" />
                  </div>
                  <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
                    <div className="h-3 bg-[var(--color-bone)] rounded w-full" />
                    <div className="h-3 bg-[var(--color-bone)] rounded w-4/5" />
                  </div>
                  <div className="pt-5 border-t border-[var(--color-border)] flex gap-2">
                    <div className="h-10 bg-[var(--color-bone)] rounded-xl flex-1" />
                    <div className="h-10 bg-[var(--color-bone)] rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Recovery Network Error State */
          <div className="py-20 px-6 text-center flex flex-col items-center border border-[var(--color-border)] bg-white rounded-3xl p-8 sm:p-12 shadow-sm animate-in fade-in duration-300">
            <div className="w-16 h-16 mb-6 bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-ink)] mb-3 tracking-tight">
              Network Synchronization Unavailable
            </h2>
            <p className="text-[var(--color-ink-soft)] text-sm max-w-md mx-auto leading-relaxed font-light mb-6">
              {error}
            </p>
            <button
              onClick={() => hydrate()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-ink)] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px] cursor-pointer"
            >
              <span>Retry Connection</span>
            </button>
          </div>
        ) : activeAlerts.length === 0 ? (
          /* Zero-Incident State (Network Secure) */
          <div className="py-24 px-6 text-center flex flex-col items-center border border-[var(--color-border)] bg-white rounded-3xl p-8 sm:p-12 shadow-sm animate-in fade-in duration-500">
            <div className="w-16 h-16 mb-6 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center text-emerald-600">
              <ShieldAlert className="w-8 h-8 opacity-70" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-3 tracking-tight">
              No Active Recovery Incidents
            </h2>
            <p className="text-[var(--color-ink-soft)] text-sm max-w-md mx-auto leading-relaxed font-light mb-6">
              The community recovery network is currently secure. No missing alerts are active in your operational zone.
            </p>
            <Link 
              to="/lost/new" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-ink)] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Broadcast a Missing Pet</span>
            </Link>
          </div>
        ) : filteredAlerts.length === 0 ? (
          /* Search Empty State */
          <div className="py-20 px-6 text-center flex flex-col items-center border border-[var(--color-border)] bg-white rounded-3xl p-8 shadow-sm animate-in fade-in">
            <Search className="w-10 h-10 text-[var(--color-ink-soft)] opacity-40 mb-4" />
            <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-2">
              No Matching Alerts Found
            </h3>
            <p className="text-[var(--color-ink-soft)] text-sm max-w-sm mx-auto font-light leading-relaxed mb-6">
              No active recovery records match your filter: <strong className="text-[var(--color-ink)] font-semibold">"{searchQuery}"</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSpecies('all'); }}
              className="px-6 py-3 rounded-xl bg-[var(--color-ink)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Active Alerts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {filteredAlerts.map(alert => (
              <IncidentCard
                key={alert.id}
                alert={alert}
                onReportSighting={() => navigate(`/sightings/new?alertId=${alert.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}