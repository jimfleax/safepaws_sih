import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Search, ArrowRight, Activity } from 'lucide-react';

export default function LostDogs() {
  const { alerts } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-[var(--color-ink)]/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <Activity size={16} className="text-[var(--color-alert)]" />
              <span className="text-xs font-bold text-[var(--color-alert)] uppercase tracking-widest">Global Scan Active</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-none mb-6 text-[var(--color-ink)]">
              Recovery Board
            </h1>
            <p className="text-xl font-serif italic text-[var(--color-ink-soft)] leading-relaxed">
              These profiles represent active Level-1 incidents in your network zone. Review immediately.
            </p>
          </div>
          <Link 
            to="/lost/new" 
            className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-[var(--color-alert)] hover:bg-[#9A3926] text-white font-bold text-sm uppercase tracking-widest transition-colors shadow-md shrink-0"
          >
            <ShieldAlert size={18} />
            Report Missing Pet
          </Link>
        </header>

        {activeAlerts.length === 0 ? (
          <div className="py-32 px-6 text-center flex flex-col items-center border-2 border-dashed border-[var(--color-ink)]/10 bg-white/40 animate-in fade-in duration-1000 delay-150 fill-mode-both">
            <div className="w-24 h-24 mb-8 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center">
              <Search className="text-[var(--color-ink-soft)]" size={40} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-[var(--color-ink)] mb-4 tracking-tight">No Active Incidents</h2>
            <p className="text-[var(--color-ink-soft)] text-lg max-w-md mx-auto leading-relaxed">
              The network is currently secure. No missing alerts are active in your operational zone.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 animate-in fade-in duration-1000 delay-150 fill-mode-both">
            {activeAlerts.map(alert => (
              <Link 
                key={alert.id} 
                to={`/alerts/${alert.id}`}
                className="group block bg-white border border-[var(--color-ink)]/10 hover:border-[var(--color-alert)]/50 transition-all shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-alert)]"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[var(--color-bone)]">
                  <img 
                    src={alert.photoUrl} 
                    alt={alert.petName} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-105 grayscale-[10%]" 
                  />
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--color-alert)]" />
                  <div className="absolute top-4 left-4 bg-[var(--color-alert)] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-md flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Missing
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-1 leading-none">{alert.petName}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">{alert.breed}</p>
                  </div>
                  
                  <div className="pt-5 border-t border-[var(--color-ink)]/10 space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)] font-bold mb-1">Time Elapsed</p>
                      <p className="text-[var(--color-alert)] font-bold font-mono tracking-tight">{alert.timeAgo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)] font-bold mb-1">Last Seen Vector</p>
                      <p className="text-[var(--color-ink)] font-serif line-clamp-2 leading-snug">{alert.lastSeenAddress}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-[var(--color-ink)]/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)] group-hover:text-[var(--color-alert)] transition-colors flex items-center gap-2">
                      View Profile <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
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
