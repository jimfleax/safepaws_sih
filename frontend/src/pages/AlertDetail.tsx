import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ApiClient } from '../utils/apiClient';
import { NeighborhoodAlert, CommunitySighting } from '../types';
import { 
  AlertCircle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  CheckCircle2,
  Activity, 
  Camera,
  ShieldCheck,
  Lock,
  Eye,
  X
} from 'lucide-react';

export default function AlertDetail() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { alerts, sightings, pets } = usePetStore();
  
  const alertFromStore = alerts.find(a => a.id === alertId);
  const [fetchedAlert, setFetchedAlert] = useState<NeighborhoodAlert | null>(null);
  const [fetchedSightings, setFetchedSightings] = useState<CommunitySighting[]>([]);
  const [loading, setLoading] = useState<boolean>(!alertFromStore);
  const [fetchError, setFetchError] = useState<string>('');
  
  // Owner resolution state (Contract C6)
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [resolvedLocally, setResolvedLocally] = useState(false);

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

        // Ingest genuine sightings array returned by backend endpoint
        const mappedSightings: CommunitySighting[] = (data.sightings || []).map((s: any) => ({
          id: s.id,
          alertId: s.alert_id || data.id,
          reporterName: s.reporter_name || 'Community Observer',
          location: s.location || '',
          notes: s.notes || '',
          time: s.time ? new Date(s.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          confirmed: s.confirmed ?? false,
        }));

        // Resolve linked pet if present in authenticated store (typed source only)
        const linkedPet = pets.find(p => p.id === data.pet_id);

        // Map root response fields (consuming pet_name, breed, photo_url directly from AlertResponse)
        const mapped: NeighborhoodAlert = {
          id: data.id,
          petId: data.pet_id,
          petName: data.pet_name || data.pet?.name || 'Unknown Companion',
          breed: data.breed || data.pet?.breed || 'Unknown Breed',
          photoUrl: data.photo_url || data.pet?.photos?.[0]?.url || data.pet?.photo_url || '',
          status: data.status,
          timeAgo: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Recently',
          lastSeenAddress: data.last_seen_address || '',
          description: data.description || '',
          sightingsCount: mappedSightings.length,
          species: linkedPet ? linkedPet.species : undefined,
        };

        setFetchedAlert(mapped);
        setFetchedSightings(mappedSightings);
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
  }, [alertId, alertFromStore, pets]);

  const rawAlert = alertFromStore || fetchedAlert;
  const alert = rawAlert ? {
    ...rawAlert,
    status: resolvedLocally ? ('resolved' as const) : rawAlert.status
  } : null;

  // Deduplicate and merge Zustand store sightings with direct API fetched sightings
  const storeSightings = sightings.filter(s => s.alertId === alertId);
  const combinedSightings = [...storeSightings];
  for (const fs of fetchedSightings) {
    if (!combinedSightings.some(s => s.id === fs.id)) {
      combinedSightings.push(fs);
    }
  }
  const alertSightings = combinedSightings;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
        <DashboardNav />
        <main id="main-content" tabIndex={-1} className="outline-none flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-4 border-[var(--color-marigold)] border-t-[var(--color-ink)] rounded-full animate-spin mb-4" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
            Hydrating Incident Dossier...
          </span>
        </main>
      </div>
    );
  }

  if (!alert) {
    return (
      <main id="main-content" tabIndex={-1} className="outline-none min-h-screen bg-[var(--color-bone)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 border border-[var(--color-ink)]/10 bg-white shadow-sm rounded-sm">
          <AlertCircle className="text-[var(--color-alert-clay)] mx-auto mb-6" size={48} aria-hidden="true" />
          <h1 className="text-3xl font-serif text-[var(--color-ink)] mb-4">{fetchError || 'Incident Not Found'}</h1>
          <p className="text-[var(--color-ink-soft)] text-sm mb-8 leading-relaxed font-sans">
            This alert record may have been resolved, archived, or is inaccessible from your location.
          </p>
          <button 
            onClick={() => navigate('/lost')} 
            className="min-h-[48px] sm:min-h-[44px] px-8 py-3.5 border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] font-bold text-xs uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            Return to Recovery Board
          </button>
        </div>
      </main>
    );
  }

  const isOwner = pets.some(p => p.id === alert.petId);
  const isActive = alert.status === 'active';

  // Section C: Location privacy enforcement (SEC-BACKEND-01)
  // Public users must NEVER see raw residential street addresses.
  const displayLocation = isOwner 
    ? (alert.lastSeenAddress || 'Address on file')
    : 'Vicinity details restricted for privacy';

  // Owner resolution submission (Contract C6)
  const handleConfirmResolve = async () => {
    setIsResolving(true);
    setActionError('');
    try {
      await ApiClient.resolveAlert(alert.id);
      setResolvedLocally(true);
      setShowResolveModal(false);
      await usePetStore.getState().hydrate();
    } catch (err: any) {
      setActionError(err.message || 'Failed to resolve incident');
      setShowResolveModal(false);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 w-full flex flex-col">
        
        {/* Top Header Row — Field Incident Bar */}
        <div className="px-6 lg:px-12 py-5 border-b border-[var(--color-ink)]/10 flex justify-between items-center bg-white/70 sticky top-0 z-10 backdrop-blur-md">
          <Link 
            to="/lost" 
            className="group inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors font-bold text-xs tracking-widest uppercase min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Recovery Board</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Status indicator with accessible foreground */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider rounded border ${
              isActive 
                ? 'bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border-[var(--color-alert-clay)]/20' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[var(--color-alert-clay)] animate-pulse' : 'bg-emerald-600'}`} />
              <span>{isActive ? 'STATUS: ACTIVE SEARCH' : 'STATUS: RESOLVED'}</span>
            </span>

            {/* Owner Resolve Action (Contract C6) */}
            {isOwner && isActive && (
              <button 
                onClick={() => setShowResolveModal(true)}
                className="px-5 py-2.5 bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-[var(--color-bone)] font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
              >
                <CheckCircle size={14} />
                <span>Mark Safe & Resolve</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-14 pb-32">
          
          {actionError && (
            <div role="alert" className="mb-10 p-5 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] font-medium flex items-start gap-3 rounded-sm">
              <AlertCircle size={20} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {/* INCIDENT DOSSIER HEADER */}
          <div className="mb-12 border-b border-[var(--color-ink)]/10 pb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-soft)] bg-white px-2.5 py-1 border border-[var(--color-ink)]/10 rounded">
                INCIDENT ID: #{alert.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="font-mono text-xs text-[var(--color-ink-soft)]">
                LOGGED: {alert.timeAgo}
              </span>
              {!isActive && (
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded uppercase tracking-wider">
                  CASE CONCLUDED // COMPANION SAFE
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-[var(--color-ink)] tracking-tight mb-4">
              Missing: {alert.petName}
            </h1>
            
            {isActive ? (
              <p className="text-lg lg:text-xl font-serif italic text-[var(--color-ink-soft)] max-w-3xl leading-relaxed">
                Active missing pet incident record. Observational sightings submitted by the community are logged to the timeline below.
              </p>
            ) : (
              <p className="text-lg lg:text-xl font-serif italic text-emerald-800 max-w-3xl leading-relaxed">
                This incident record has been successfully resolved and concluded. The companion is confirmed safely reunited.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* LEFT COLUMN: Pet Identity & Details */}
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              
              {/* Photo Box */}
              <div className="relative w-full aspect-[4/3] bg-white border border-[var(--color-ink)]/15 p-2.5 shadow-sm rounded-sm">
                {alert.photoUrl ? (
                  <img 
                    src={alert.photoUrl} 
                    alt={`Photograph of missing pet ${alert.petName}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/30 bg-[#F4EDE4]">
                    <span className="text-6xl font-serif mb-2">{alert.petName.charAt(0)}</span>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest mt-2">No Photo on File</span>
                  </div>
                )}
                
                {isActive ? (
                  <div className="absolute top-5 left-5">
                    <span className="bg-[var(--color-alert-clay)] text-white px-3 py-1.5 font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 rounded">
                      <ShieldAlert size={14} /> ACTIVE INCIDENT
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-5 left-5">
                    <span className="bg-emerald-700 text-white px-3 py-1.5 font-mono font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 rounded">
                      <CheckCircle2 size={14} /> REUNITED & SAFE
                    </span>
                  </div>
                )}
              </div>
              
              {/* Telemetry Dossier Grid */}
              <div className="bg-white border border-[var(--color-ink)]/15 p-8 shadow-sm rounded-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                      <Clock size={12} className="text-[var(--color-ink-soft)]" /> Time Logged
                    </p>
                    <p className="text-base font-serif text-[var(--color-ink)] font-bold">{alert.timeAgo}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                      <MapPin size={12} className="text-[var(--color-alert-clay)]" /> Vicinity Area
                    </p>
                    <p className="text-base font-serif text-[var(--color-ink)] font-bold">{displayLocation}</p>
                    {!isOwner && (
                      <span className="text-[10px] font-mono text-[var(--color-ink-soft)] block mt-1">
                        <Lock size={10} className="inline mr-1" />
                        SEC-BACKEND-01: Address suppressed on public view.
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                      <Users size={12} className="text-[var(--color-ink-soft)]" /> Companion Breed
                    </p>
                    <p className="text-base font-serif text-[var(--color-ink)] font-bold">{alert.breed}</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-ink)]/10">
                  <h2 className="text-xs font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-3">
                    Incident Narrative & Distinguishing Traits
                  </h2>
                  <p className="text-lg font-serif text-[var(--color-ink)] leading-relaxed italic bg-[var(--color-bone)]/50 p-4 border-l-2 border-[var(--color-ink)]/20">
                    "{alert.description || 'No additional narrative logged.'}"
                  </p>
                </div>
              </div>

              {/* Safe Reunification & Anti-Scam Guidance */}
              <div className="bg-amber-50/80 border border-amber-200/80 p-6 rounded-sm text-xs text-[var(--color-ink)] space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider font-mono">
                  <ShieldCheck size={16} className="text-amber-700" />
                  <span>Safe Verification & Anti-Scam Guidance</span>
                </div>
                <p className="text-[var(--color-ink-soft)] leading-relaxed font-sans">
                  Never wire funds, pay advance courier deposits, or reveal SMS verification codes to claim a pet. SafePaws will never ask for payment to facilitate a recovery. Arrange any physical reunion in daylight at a busy public municipal location.
                </p>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Sightings Ledger */}
            <div className="lg:col-span-5 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 ease-out">
              
              {/* Sighting Action Card */}
              {isActive && !isOwner && (
                <div className="bg-[var(--color-ink)] p-8 text-[var(--color-bone)] shadow-md border-t-4 border-[var(--color-marigold)] rounded-sm">
                  <h2 className="text-2xl font-serif font-bold mb-3">Have you spotted {alert.petName}?</h2>
                  <p className="text-[var(--color-bone)]/80 mb-6 text-sm leading-relaxed font-sans">
                    Do not chase an unfamiliar animal. Maintain visual contact from a safe distance and submit an observational sighting with descriptive details immediately.
                  </p>
                  <Link 
                    to={`/sightings/new?alertId=${alert.id}`} 
                    className="flex items-center justify-center gap-2.5 w-full py-4 bg-[var(--color-marigold)] text-[var(--color-ink)] font-bold uppercase tracking-wider text-xs hover:bg-[var(--color-marigold)]/90 transition-colors shadow-sm min-h-[48px] sm:min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                  >
                    <Camera size={16} />
                    <span>Submit Observational Sighting</span>
                  </Link>
                </div>
              )}

              {/* Resolved Card for Non-Owners */}
              {!isActive && (
                <div className="bg-emerald-50 border border-emerald-200 p-8 shadow-sm rounded-sm text-emerald-950">
                  <div className="flex items-center gap-2.5 mb-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 size={18} className="text-emerald-700" />
                    <span>Reunion Recorded</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-2">Search Closed</h2>
                  <p className="text-emerald-800 text-sm leading-relaxed font-sans">
                    The guardian of {alert.petName} has resolved this alert. Sighting submissions for this case are officially concluded. Thank you to the community scouts for their vigilance.
                  </p>
                </div>
              )}
              
              {/* Sightings Timeline Card */}
              <div className="bg-white border border-[var(--color-ink)]/15 p-6 sm:p-8 shadow-sm flex-1 rounded-sm">
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-[var(--color-ink)]/10">
                  <h2 className="text-xl font-serif font-bold text-[var(--color-ink)] flex items-center gap-2.5">
                    <Activity size={20} className={isActive ? "text-[var(--color-alert-clay)] animate-pulse" : "text-[var(--color-ink-soft)]"} />
                    <span>Sighting Field Ledger</span>
                  </h2>
                  <span className="font-mono text-[var(--color-ink-soft)] text-xs font-bold uppercase tracking-wider">
                    {alertSightings.length} {alertSightings.length === 1 ? 'Report' : 'Reports'}
                  </span>
                </div>
                
                {alertSightings.length === 0 ? (
                  <div className="text-center py-12 px-6 border border-dashed border-[var(--color-ink)]/15 bg-[var(--color-bone)]/30 rounded-sm">
                    <p className="text-[var(--color-ink-soft)] text-base font-serif italic mb-2">
                      No observational sightings logged yet.
                    </p>
                    <p className="text-[var(--color-ink-soft)]/60 text-xs font-mono uppercase tracking-widest">
                      Active Monitoring In Progress
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {alertSightings.map((sighting) => {
                      const isConfirmed = sighting.confirmed === true;
                      return (
                        <div 
                          key={sighting.id} 
                          className={`relative pl-6 border-l-2 ${isConfirmed ? 'border-emerald-600' : 'border-[var(--color-marigold)]/70'} pb-5 last:pb-0`}
                        >
                          {/* Dot marker */}
                          <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 ${isConfirmed ? 'bg-emerald-600 ring-2 ring-emerald-200' : 'bg-[var(--color-marigold)]'}`} />
                          
                          {/* Header row */}
                          <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                            <span className="font-bold text-[var(--color-ink)] text-xs uppercase tracking-wider">
                              {sighting.reporterName}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--color-ink-soft)] bg-[var(--color-bone)] px-2 py-0.5 rounded border border-[var(--color-ink)]/10">
                              {sighting.time}
                            </span>
                          </div>
                          
                          {/* Sighting Status Differentiation (Contract C4) */}
                          <div className="mb-2.5">
                            {isConfirmed ? (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded uppercase tracking-wider">
                                <CheckCircle2 size={11} className="text-emerald-700" />
                                <span>VERIFIED OBSERVATION // CONFIRMED</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-900 bg-amber-50 border border-dashed border-amber-300 px-2 py-0.5 rounded uppercase tracking-wider">
                                <Eye size={11} className="text-amber-700" />
                                <span>COMMUNITY OBSERVATION // UNVERIFIED</span>
                              </span>
                            )}
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-start gap-2 mb-2 text-xs">
                            <MapPin size={14} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
                            <span className="text-[var(--color-ink)] font-medium leading-snug">{sighting.location}</span>
                          </div>
                          
                          {/* Notes */}
                          {sighting.notes && (
                            <div className="bg-[var(--color-bone)]/50 border border-[var(--color-ink)]/5 p-3 italic text-[var(--color-ink)] text-xs leading-relaxed rounded">
                              "{sighting.notes}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OWNER CONFIRM RESOLUTION MODAL (Contract C6) */}
        {showResolveModal && (
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="resolve-modal-title"
            aria-describedby="resolve-modal-desc"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          >
            <div className="bg-white border-2 border-[var(--color-ink)] max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-xl space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                    OWNER RESOLUTION PROTOCOL
                  </span>
                  <h3 id="resolve-modal-title" className="text-2xl font-serif font-bold text-[var(--color-ink)]">
                    Confirm Case Resolution
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  disabled={isResolving}
                  className="min-h-[44px] min-w-[44px] p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] flex items-center justify-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              <div id="resolve-modal-desc" className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed font-sans">
                <p>
                  Marking this incident resolved will conclude active community search efforts on the Recovery Board and update <strong className="text-[var(--color-ink)]">{alert.petName}</strong>'s registry status to <strong>Safe</strong>.
                </p>
                <p className="font-serif italic text-base text-[var(--color-ink)]">
                  Are you certain your companion is safely home and in your care?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  disabled={isResolving}
                  className="min-h-[48px] sm:min-h-[44px] px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] font-bold text-xs uppercase tracking-widest rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  Keep Search Active
                </button>

                <button
                  type="button"
                  onClick={handleConfirmResolve}
                  disabled={isResolving}
                  className="min-h-[48px] sm:min-h-[44px] px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] shadow-sm disabled:opacity-50"
                >
                  {isResolving ? (
                    <span>Resolving Incident...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Yes, Mark Companion Safe</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
