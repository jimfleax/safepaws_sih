import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Search, ArrowRight } from 'lucide-react';

export default function LostDogs() {
  const { alerts } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-20 md:pb-12 pb-28">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-[var(--color-ink)]/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight mb-4 text-[var(--color-ink)]">
              Active Recovery Board
            </h1>
            <p className="text-xl text-[var(--color-ink-soft)] leading-relaxed">
              These pets are currently missing in your area. Review their profiles carefully and report any sightings immediately to aid in their recovery.
            </p>
          </div>
          <Link 
            to="/lost/new" 
            className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-[var(--color-alert-clay)] text-white rounded-none font-semibold hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-alert-clay)] shrink-0"
          >
            <ShieldAlert size={20} />
            <span className="tracking-wide">Report Missing Pet</span>
          </Link>
        </header>

        {activeAlerts.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center animate-in fade-in duration-1000 delay-150 fill-mode-both">
            <div className="w-20 h-20 mb-8 border border-[var(--color-ink)]/20 rounded-full flex items-center justify-center">
              <Search className="text-[var(--color-ink-soft)]" size={32} />
            </div>
            <h2 className="text-3xl font-serif text-[var(--color-ink)] mb-4">No Active Alerts</h2>
            <p className="text-[var(--color-ink-soft)] text-lg max-w-md mx-auto">
              There are currently no reported lost pets in your area. SafePaws remains active.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-in fade-in duration-1000 delay-150 fill-mode-both">
            {activeAlerts.map(alert => (
              <Link 
                key={alert.id} 
                to={`/alerts/${alert.id}`}
                className="group block focus:outline-none focus:ring-2 focus:ring-[var(--color-alert-clay)] focus:ring-offset-4 focus:ring-offset-[var(--color-bone)]"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[var(--color-ink)]/5 mb-6">
                  <img 
                    src={alert.photoUrl} 
                    alt={alert.petName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-alert-clay)]" />
                  <div className="absolute top-4 left-4 bg-[var(--color-alert-clay)] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Missing
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-1">{alert.petName}</h3>
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-ink-soft)]">{alert.breed}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-[var(--color-ink)]/10 space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[var(--color-alert-clay)] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[var(--color-ink-soft)] font-semibold mb-0.5">Last Seen</p>
                        <p className="text-[var(--color-ink)] font-medium leading-snug">{alert.lastSeenAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[var(--color-ink-soft)] line-clamp-3 text-sm leading-relaxed">
                    {alert.description}
                  </p>
                  
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-alert-clay)]">{alert.timeAgo}</span>
                    <span className="text-sm font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:text-[var(--color-alert-clay)] transition-colors">
                      View details <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
