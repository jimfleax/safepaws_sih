import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ShieldAlert, MapPin, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AlertDetail() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { alerts, sightings, resolveAlert } = usePetStore();
  
  const alert = alerts.find(a => a.id === alertId);
  const alertSightings = sightings.filter(s => s.alertId === alertId);
  
  if (!alert) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
        <DashboardNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-[var(--color-ink)]">Alert not found</h2>
            <button onClick={() => navigate('/lost')} className="mt-6 text-[var(--color-alert-clay)] font-semibold uppercase tracking-wider text-sm hover:underline">
              Return to Recovery Board
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleResolve = async () => {
    try {
      const { ApiClient } = await import('../utils/apiClient');
      await ApiClient.resolveAlert(alert.id);
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  const isOwner = usePetStore.getState().pets.some(p => p.id === alert.petId);

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-20 md:pb-12 pb-28">
        <Link to="/lost" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-12">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Alerts
        </Link>
        
        {alert.status === 'active' && (
          <div className="mb-16 border-l-4 border-[var(--color-alert-clay)] pl-6 py-2 animate-in fade-in slide-in-from-left-4 duration-700 ease-out flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={24} className="text-[var(--color-alert-clay)]" />
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-alert-clay)]">
                  Active Crisis Alert: {alert.petName}
                </h1>
              </div>
              <p className="text-lg text-[var(--color-ink-soft)]">
                {alert.notifiedNeighborsCount} neighbors notified within {alert.broadcastRadiusKm}km radius
              </p>
            </div>
            {isOwner && (
              <button 
                onClick={handleResolve}
                className="px-8 py-4 bg-[var(--color-alert-clay)] text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-alert-clay)] shrink-0"
              >
                <CheckCircle size={18} />
                Mark as Found
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both ease-out">
            <div className="aspect-video sm:aspect-[4/3] relative bg-[var(--color-ink)]/5">
              <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-[var(--color-ink)]/10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-ink-soft)] font-semibold mb-2 flex items-center gap-2">
                    <Clock size={14} /> Time Lost
                  </p>
                  <p className="text-lg font-serif text-[var(--color-ink)]">{alert.timeAgo}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-ink-soft)] font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Last Seen
                  </p>
                  <p className="text-lg font-serif text-[var(--color-ink)]">{alert.lastSeenAddress}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-ink-soft)] font-semibold mb-2 flex items-center gap-2">
                    <Users size={14} /> Breed
                  </p>
                  <p className="text-lg font-serif text-[var(--color-ink)]">{alert.breed}</p>
                </div>
              </div>
              
              <article className="prose prose-lg prose-headings:font-serif prose-headings:text-[var(--color-ink)] prose-p:text-[var(--color-ink-soft)] max-w-none">
                <h3 className="text-3xl font-serif font-bold text-[var(--color-ink)] mb-6">Description & Additional Details</h3>
                <p className="leading-relaxed whitespace-pre-wrap text-xl">
                  {alert.description}
                </p>
              </article>
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both ease-out">
            {alert.status === 'active' && (
              <div className="bg-[var(--color-alert-clay)] p-8 text-white">
                <h3 className="text-2xl font-serif font-bold mb-4">Have information?</h3>
                <p className="text-white/80 mb-8 leading-relaxed">
                  If you have seen this pet, please report a sighting immediately. Your information is critical.
                </p>
                <Link 
                  to={`/sightings/new?alertId=${alert.id}`} 
                  className="block w-full py-4 bg-white text-[var(--color-alert-clay)] font-bold uppercase tracking-wider text-sm text-center hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-[var(--color-alert-clay)]"
                >
                  Report Sighting
                </Link>
              </div>
            )}
            
            <div>
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-[var(--color-ink)]/10">
                <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)]">
                  Sightings <span className="text-[var(--color-ink-soft)] text-lg font-sans">({alertSightings.length})</span>
                </h3>
              </div>
              
              {alertSightings.length === 0 ? (
                <p className="text-[var(--color-ink-soft)] text-lg italic">
                  No sightings reported yet.
                </p>
              ) : (
                <div className="space-y-8">
                  {alertSightings.map((sighting, index) => (
                    <div key={sighting.id} className="relative pl-6 border-l border-[var(--color-ink)]/20 pb-8 last:pb-0">
                      <div className="absolute w-3 h-3 bg-[var(--color-bone)] border-2 border-[var(--color-alert-clay)] rounded-full -left-[6.5px] top-1.5" />
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[var(--color-ink)] text-lg">{sighting.reporterName}</span>
                        <span className="text-sm text-[var(--color-ink-soft)] font-medium bg-[var(--color-ink)]/5 px-3 py-1 rounded-full">{sighting.time}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-4 text-[var(--color-ink)] font-medium">
                        <MapPin size={18} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{sighting.location}</span>
                      </div>
                      <p className="text-[var(--color-ink-soft)] leading-relaxed italic">
                        "{sighting.notes}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
