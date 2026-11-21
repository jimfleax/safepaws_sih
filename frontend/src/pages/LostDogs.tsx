import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
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
  X
} from 'lucide-react';

export default function LostDogs() {
  const { alerts } = usePetStore();
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32">
        
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
          
          <Link 
            to="/lost/new" 
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.98] shrink-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-alert-clay)]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report Missing Pet</span>
          </Link>
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
        {activeAlerts.length === 0 ? (
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
              <Link 
                key={alert.id} 
                to={`/alerts/${alert.id}`}
                className="group block bg-white border border-[var(--color-border)] hover:border-[var(--color-alert-clay)] rounded-3xl overflow-hidden transition-all shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-alert-clay)] flex flex-col"
              >
                {/* Photo & Badge */}
                <div className="aspect-[4/3] relative overflow-hidden bg-[var(--color-surface)]">
                  {alert.photoUrl ? (
                    <img 
                      src={alert.photoUrl} 
                      alt={alert.petName} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-soft)] opacity-40">
                      <Heart className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[var(--color-alert-clay)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Reported Missing</span>
                  </div>
                </div>
                
                {/* Information Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)] mb-1 leading-tight group-hover:text-[var(--color-alert-clay)] transition-colors">
                        {alert.petName}
                      </h3>
                      <p className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--color-ink-soft)]">
                        {alert.breed || 'Canine Companion'}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--color-border)] space-y-3 text-xs">
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-alert-clay)] mt-0.5 shrink-0" />
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[var(--color-ink-soft)] block">Reported</span>
                          <span className="font-semibold text-[var(--color-ink)]">{alert.timeAgo}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-alert-clay)] mt-0.5 shrink-0" />
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[var(--color-ink-soft)] block">Last Seen Vector</span>
                          <span className="text-[var(--color-ink)] line-clamp-2 leading-snug font-medium">
                            {alert.lastSeenAddress || 'Local Area'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Link Footer */}
                  <div className="pt-5 mt-5 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] group-hover:text-[var(--color-alert-clay)] transition-colors min-h-[36px]">
                    <span>View Incident Room</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}