import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Users, Heart, MapPin, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Community() {
  const { alerts, sightings, pets } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const [activeTab, setActiveTab] = useState<'alerts' | 'sightings'>('alerts');

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 md:pb-12 pb-32">
        
        {/* Header */}
        <header className="mb-16 border-b border-[var(--color-ink)]/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-ink)] font-bold tracking-tight mb-4">
              Recovery Network
            </h1>
            <p className="text-xl text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
              Coordinate with neighbors and track community sightings to bring pets home safely.
            </p>
          </div>
          <Link 
            to="/sightings/new" 
            className="group inline-flex items-center gap-3 px-6 py-4 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-colors shrink-0"
          >
            <Eye size={18} />
            Report Sighting
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-y border-[var(--color-ink)]/20 mb-16 animate-in fade-in duration-700 delay-150 fill-mode-both ease-out divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-ink)]/20">
          <div className="p-8 flex flex-col justify-center bg-white/30">
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--color-ink-soft)] mb-2">Registered Pets</p>
            <p className="font-serif text-5xl text-[var(--color-ink)]">{pets.length}</p>
          </div>
          
          <div className="p-8 flex flex-col justify-center bg-white/30">
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--color-ink-soft)] mb-2">Reunited</p>
            <p className="font-serif text-5xl text-[var(--color-ink)]">{alerts.filter(a => a.status === 'resolved').length}</p>
          </div>
          
          <div className="p-8 flex flex-col justify-center bg-[var(--color-alert-clay)]/10">
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--color-alert-clay)] mb-2">Active Alerts</p>
            <p className="font-serif text-5xl text-[var(--color-alert-clay)]">{activeAlerts.length}</p>
          </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex items-center gap-8 mb-12 border-b border-[var(--color-ink)]/10 animate-in fade-in duration-700 delay-300 fill-mode-both ease-out">
          <button 
            onClick={() => setActiveTab('alerts')} 
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === 'alerts' ? 'text-[var(--color-alert-clay)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
            }`}
          >
            Missing Pets
            {activeTab === 'alerts' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--color-alert-clay)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('sightings')} 
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === 'sightings' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
            }`}
          >
            Community Sightings
            {activeTab === 'sightings' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--color-ink)]" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] animate-in fade-in duration-700 delay-300 fill-mode-both ease-out">
          
          {/* Active Alerts View */}
          {activeTab === 'alerts' && (
            <>
              {activeAlerts.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center mb-6">
                    <Heart className="text-[var(--color-ink-soft)]" size={32} />
                  </div>
                  <h3 className="font-serif text-3xl text-[var(--color-ink)] mb-4">No active alerts</h3>
                  <p className="text-[var(--color-ink-soft)] text-lg max-w-md mx-auto">The neighborhood is currently safe. No pets are reported missing.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeAlerts.map(alert => (
                    <Link 
                      key={alert.id} 
                      to={`/alerts/${alert.id}`}
                      className="group block bg-white/50 border border-[var(--color-ink)]/10 hover:border-[var(--color-alert-clay)]/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-64 aspect-video sm:aspect-square relative bg-[var(--color-ink)]/5 shrink-0 overflow-hidden">
                          <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-alert-clay)]" />
                        </div>
                        <div className="p-6 sm:p-8 flex flex-col justify-between w-full">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)]">{alert.petName}</h3>
                              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert-clay)] animate-pulse" />
                                Missing
                              </span>
                            </div>
                            <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-ink-soft)] mb-6">{alert.breed}</p>
                            
                            <div className="flex items-start gap-3 mb-4">
                              <MapPin size={18} className="text-[var(--color-alert-clay)] mt-0.5 shrink-0" />
                              <p className="text-[var(--color-ink)] leading-snug">{alert.lastSeenAddress}</p>
                            </div>
                            <p className="text-[var(--color-ink-soft)] line-clamp-2 leading-relaxed">
                              {alert.description}
                            </p>
                          </div>
                          
                          <div className="mt-8 pt-4 border-t border-[var(--color-ink)]/10 flex justify-between items-center">
                            <span className="text-sm font-medium text-[var(--color-ink-soft)]">{alert.timeAgo}</span>
                            <span className="text-sm font-bold uppercase tracking-wider text-[var(--color-alert-clay)] flex items-center gap-2 group-hover:gap-3 transition-all">
                              View Profile <ArrowRight size={16} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sightings View */}
          {activeTab === 'sightings' && (
            <>
              {sightings.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-[var(--color-ink)]/5 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="text-[var(--color-ink-soft)]" size={32} />
                  </div>
                  <h3 className="font-serif text-3xl text-[var(--color-ink)] mb-4">No recent sightings</h3>
                  <p className="text-[var(--color-ink-soft)] text-lg max-w-md mx-auto">Community members haven't reported any stray sightings recently.</p>
                </div>
              ) : (
                <div className="space-y-0 border-y border-[var(--color-ink)]/20 divide-y divide-[var(--color-ink)]/20">
                  {sightings.map(sighting => (
                    <div key={sighting.id} className="py-10 flex flex-col md:flex-row gap-8">
                      <div className="md:w-64 shrink-0">
                        <div className="text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1">{sighting.reporterName}</div>
                        <div className="text-sm text-[var(--color-ink-soft)]">{sighting.time}</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-4 text-[var(--color-ink)]">
                          <MapPin size={20} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
                          <span className="text-lg leading-snug">{sighting.location}</span>
                        </div>
                        <p className="text-[var(--color-ink)] text-lg leading-relaxed italic mb-8">
                          "{sighting.notes}"
                        </p>
                        
                        {sighting.alertId ? (
                          <Link 
                            to={`/alerts/${sighting.alertId}`} 
                            className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-alert-clay)] hover:text-[var(--color-ink)] transition-colors"
                          >
                            View Related Alert <ArrowRight size={16} />
                          </Link>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-ink-soft)]">
                            Unmatched Sighting
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
