import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ApiClient } from '../utils/apiClient';
import { AlertCircle, ShieldAlert, MapPin, Clock, Users, ArrowLeft, CheckCircle, Activity, Camera } from 'lucide-react';

export default function AlertDetail() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { alerts, sightings, resolveAlert, pets } = usePetStore();
  
  const alertFromStore = alerts.find(a => a.id === alertId);
  const [fetchedAlert, setFetchedAlert] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!alertFromStore);
  const [fetchError, setFetchError] = useState<string>('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (alertFromStore) {
      setLoading(false);
      return;
    }
    if (!alertId) return;

    let isMounted = true;
    setLoading(true);
    ApiClient.getAlert(alertId)
      .then((data) => {
        if (!isMounted) return;
        const mapped = {
          id: data.id,
          petId: data.pet_id,
          petName: data.pet?.name || 'Unknown',
          breed: data.pet?.breed || 'Unknown',
          photoUrl: data.pet?.photos?.[0]?.url || data.pet?.photo_url || '',
          status: data.status,
          broadcastRadiusKm: 5,
          notifiedNeighborsCount: 0,
          timeAgo: data.created_at || 'Recently',
          lastSeenAddress: data.last_seen_address || '',
          description: data.description || '',
          sightingsCount: data.sightings?.length || 0,
        };
        setFetchedAlert(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setFetchError(err.message || 'Alert not found');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [alertId, alertFromStore]);

  const alert = alertFromStore || fetchedAlert;
  const alertSightings = sightings.filter(s => s.alertId === alertId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
        <DashboardNav />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-alert)] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="sr-only">Loading alert details...</span>
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <AlertCircle className="text-[var(--color-alert)] mx-auto mb-6" size={48} />
          <h2 className="text-3xl font-serif text-[var(--color-ink)] mb-4">{fetchError || 'Record Purged'}</h2>
          <p className="text-[var(--color-ink-soft)] text-lg mb-8 leading-relaxed">This alert may have been resolved, archived, or deleted by the network.</p>
          <button onClick={() => navigate('/lost')} className="px-8 py-4 border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] font-bold text-xs uppercase tracking-widest transition-colors">
            Return to Directory
          </button>
        </div>
      </div>
    );
  }

  const isOwner = pets.some(p => p.id === alert.petId);
  const isActive = alert.status === 'active';

  const handleResolve = async () => {
    try {
      setActionError('');
      const { ApiClient } = await import('../utils/apiClient');
      await ApiClient.resolveAlert(alert.id);
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (err: any) {
      setActionError(err.message || 'Failed to resolve alert');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 w-full flex flex-col">
        
        {/* Top Header Row */}
        <div className="px-6 lg:px-12 py-6 border-b border-[var(--color-ink)]/10 flex justify-between items-center bg-white/40 sticky top-0 z-10 backdrop-blur-md">
          <Link to="/lost" className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors font-bold text-xs tracking-widest uppercase">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Recovery Board
          </Link>

          {isOwner && isActive && (
            <button 
              onClick={handleResolve}
              className="px-6 py-2 bg-[var(--color-ink)] hover:bg-opacity-90 text-[var(--color-bone)] font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={14} />
              Resolve Incident
            </button>
          )}
        </div>

        <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-32">
          
          {actionError && (
            <div className="mb-10 p-5 bg-[var(--color-alert)]/10 border-l-4 border-[var(--color-alert)] text-[var(--color-ink)] font-medium flex items-start gap-3">
              <AlertCircle size={20} className="text-[var(--color-alert)] shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {/* STRONG ALERT HEADER */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              {isActive ? (
                <>
                  <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-alert)] rounded-full animate-pulse">
                    <Activity size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-[var(--color-alert)] text-sm uppercase tracking-widest">Active Level-1 Incident</span>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-success)] rounded-full">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-[var(--color-success)] text-sm uppercase tracking-widest">Incident Resolved</span>
                </>
              )}
            </div>

            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-[var(--color-ink)] tracking-tight mb-4">
              Missing: {alert.petName}
            </h1>
            
            {isActive && (
              <p className="text-xl lg:text-2xl font-serif italic text-[var(--color-ink-soft)] max-w-3xl leading-relaxed">
                Network scan activated. {alert.notifiedNeighborsCount} verified community members notified within a {alert.broadcastRadiusKm}km operational radius.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: Pet Identity & Details */}
            <div className="lg:col-span-7 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
              
              <div className="relative w-full aspect-[4/3] bg-white border border-[var(--color-ink)]/10 p-2 shadow-sm">
                {alert.photoUrl ? <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover grayscale-[20%]" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/20 bg-[#F4EDE4]"><span className="text-6xl font-serif mb-2">{alert.petName.charAt(0)}</span><span className="text-xs font-bold uppercase tracking-widest mt-4">No Photo</span></div>}
                
                {isActive && (
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-[var(--color-alert)] text-white px-4 py-2 font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
                      <ShieldAlert size={14} /> Missing Alert
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white border border-[var(--color-ink)]/10 p-8 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                  <div>
                    <p className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Clock size={12} /> Time Reported
                    </p>
                    <p className="text-lg font-serif text-[var(--color-ink)] font-bold">{alert.timeAgo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <MapPin size={12} /> Last Seen Vector
                    </p>
                    <p className="text-lg font-serif text-[var(--color-ink)] font-bold">{alert.lastSeenAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Users size={12} /> Species / Breed
                    </p>
                    <p className="text-lg font-serif text-[var(--color-ink)] font-bold">{alert.breed}</p>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-[var(--color-ink)]/10">
                  <h3 className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest mb-4">Incident Log & Description</h3>
                  <p className="text-xl font-serif text-[var(--color-ink)] leading-relaxed italic">
                    "{alert.description}"
                  </p>
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Timeline & Sightings */}
            <div className="lg:col-span-5 flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both">
              
              {isActive && !isOwner && (
                <div className="bg-[var(--color-alert)] p-10 text-white shadow-lg">
                  <h3 className="text-3xl font-serif font-bold mb-4">Have you seen {alert.petName}?</h3>
                  <p className="text-white/90 mb-8 text-lg leading-relaxed italic">
                    If you spot this pet, do not chase. Note the exact location and submit a sighting immediately.
                  </p>
                  <Link 
                    to={`/sightings/new?alertId=${alert.id}`} 
                    className="flex items-center justify-center gap-3 w-full py-5 bg-white text-[var(--color-alert)] font-bold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-colors shadow-md"
                  >
                    <Camera size={18} />
                    Report Sighting
                  </Link>
                </div>
              )}
              
              <div className="bg-white/50 border border-[var(--color-ink)]/10 p-8 shadow-sm flex-1">
                <div className="flex items-end justify-between mb-10 pb-6 border-b border-[var(--color-ink)]/10">
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-ink)] flex items-center gap-3">
                    <Activity size={24} className={isActive ? "text-[var(--color-alert)] animate-pulse" : "text-[var(--color-ink-soft)]"} />
                    Sighting Timeline
                  </h3>
                  <span className="text-[var(--color-ink-soft)] font-bold text-sm uppercase tracking-widest">
                    {alertSightings.length} Reports
                  </span>
                </div>
                
                {alertSightings.length === 0 ? (
                  <div className="text-center py-12 px-6 border-2 border-dashed border-[var(--color-ink)]/10">
                    <p className="text-[var(--color-ink-soft)] text-lg font-serif italic mb-2">
                      No sightings logged.
                    </p>
                    <p className="text-[var(--color-ink)]/40 text-sm font-bold uppercase tracking-widest">
                      Network Monitoring Active
                    </p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {alertSightings.map((sighting, index) => (
                      <div key={sighting.id} className="relative pl-8 border-l-2 border-[var(--color-ink)]/10 pb-2 last:pb-0">
                        <div className="absolute w-4 h-4 bg-[var(--color-bone)] border-4 border-[var(--color-alert)] rounded-full -left-[9px] top-1" />
                        
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-[var(--color-ink)] text-sm uppercase tracking-wider">{sighting.reporterName}</span>
                          <span className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-widest bg-[var(--color-ink)]/5 px-3 py-1 rounded-sm">
                            {sighting.time}
                          </span>
                        </div>
                        
                        <div className="flex items-start gap-3 mb-4">
                          <MapPin size={18} className="text-[var(--color-alert)] shrink-0 mt-0.5" />
                          <span className="font-serif text-[var(--color-ink)] text-lg leading-snug">{sighting.location}</span>
                        </div>
                        
                        {sighting.notes && (
                          <div className="bg-white border border-[var(--color-ink)]/5 p-4 italic text-[var(--color-ink)] text-base leading-relaxed shadow-sm">
                            "{sighting.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
