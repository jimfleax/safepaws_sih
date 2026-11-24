import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { ApiClient } from '../utils/apiClient';
import { NeighborhoodAlert } from '../types';
import { 
  Eye, 
  MapPin, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Navigation, 
  ExternalLink, 
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function ReportSighting() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramAlertId = searchParams.get('alertId') || '';
  
  const { alerts, pets } = usePetStore();
  const { user } = useAuthStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  
  const [alertId, setAlertId] = useState(paramAlertId);
  const [subjectAlert, setSubjectAlert] = useState<NeighborhoodAlert | null>(null);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [reporterName, setReporterName] = useState(user?.name || '');
  const [sightingLocation, setSightingLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsMessage, setGpsMessage] = useState('');

  const [submissionState, setSubmissionState] = useState<'draft' | 'submitting' | 'success' | 'error'>('draft');
  const [submissionReceipt, setSubmissionReceipt] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Hydrate or fetch subject alert if alertId is present in query params
  useEffect(() => {
    if (!alertId) {
      setSubjectAlert(null);
      return;
    }

    const foundInStore = alerts.find(a => a.id === alertId);
    if (foundInStore) {
      setSubjectAlert(foundInStore);
      return;
    }

    let isMounted = true;
    setLoadingSubject(true);
    ApiClient.getAlert(alertId)
      .then((data) => {
        if (!isMounted) return;
        const linkedPet = pets.find(p => p.id === data.pet_id);
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
          sightingsCount: (data.sightings || []).length,
          species: linkedPet ? linkedPet.species : undefined,
        };
        setSubjectAlert(mapped);
        setLoadingSubject(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setSubjectAlert(null);
        setLoadingSubject(false);
      });

    return () => {
      isMounted = false;
    };
  }, [alertId, alerts, pets]);

  // Handle GPS coordinate capture
  const handleCaptureCoordinates = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('locating');
    setGpsMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        setSightingLocation(`Coordinates: ${lat}, ${lng} (GPS accuracy within ~${Math.round(position.coords.accuracy)}m)`);
        setGpsStatus('success');
        setGpsMessage('Current coordinates recorded.');
      },
      (err) => {
        setGpsStatus('error');
        setGpsMessage(err.message || 'Location access denied or unavailable.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionState('submitting');
    setErrorMessage('');
    
    try {
      // Contract C1: Direct real API POST /api/v1/sightings/
      const serverSighting = await ApiClient.reportSighting({
        reporterName: reporterName.trim(),
        location: sightingLocation.trim(),
        notes: notes.trim(),
        alertId: alertId || undefined
      });
      
      // Hydrate store so global timeline includes newly created sighting
      await usePetStore.getState().hydrate();
      
      // Contract C2: In-situ Archival Sighting Receipt (Never redirect away before user inspects receipt!)
      setSubmissionReceipt(serverSighting);
      setSubmissionState('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit sighting to field ledger. Please retry.');
      setSubmissionState('error');
    }
  };

  // Reset form to record another observation
  const handleResetForNewObservation = () => {
    setSightingLocation('');
    setNotes('');
    setGpsStatus('idle');
    setGpsMessage('');
    setSubmissionReceipt(null);
    setSubmissionState('draft');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 max-w-4xl w-full mx-auto px-6 py-10 md:py-16 md:pb-16 pb-32">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to={alertId ? `/alerts/${alertId}` : "/lost"} 
            className="group inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>{alertId ? 'Back to Incident Dossier' : 'Back to Recovery Board'}</span>
          </Link>
        </div>

        {/* Operational Header */}
        <header className="mb-10 border-b border-[var(--color-border)] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[var(--color-border)] rounded-sm text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-soft)] mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--color-marigold)] animate-pulse" />
            <span>FIELD OBSERVATION LOG // CITIZEN DISPATCH REPORT</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-[var(--color-ink)] mb-3">
            Log a Field Observation
          </h1>
          <p className="text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-2xl font-serif italic">
            Citizen reports provide critical chronological telemetry to family search teams. Please report factual physical observations without startling the companion.
          </p>
        </header>

        {/* IN-SITU ARCHIVAL RECEIPT STATE (Contract C2 & C4) */}
        {submissionState === 'success' && submissionReceipt && (
          <section 
            aria-labelledby="receipt-title" 
            className="animate-in fade-in slide-in-from-bottom-3 duration-500 bg-white border-2 border-[var(--color-ink)] shadow-md p-6 sm:p-10 mb-12 rounded-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--color-ink-soft)] block mb-1">
                  OFFICIAL SUBMISSION RECEIPT
                </span>
                <h2 id="receipt-title" className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-ink)] flex items-center gap-2.5">
                  <CheckCircle2 size={26} className="text-emerald-700 shrink-0" />
                  <span>Observation Logged to Ledger</span>
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 font-mono text-xs font-bold bg-[var(--color-bone)] border border-[var(--color-border)] rounded text-[var(--color-ink)]">
                  REF: #SGT-{submissionReceipt.id ? submissionReceipt.id.slice(0, 8).toUpperCase() : 'PENDING'}
                </span>
              </div>
            </div>

            {/* Receipt Verification Status Banner (Contract C4) */}
            <div className="my-6 p-4 bg-amber-50 border-l-4 border-amber-600 rounded-sm">
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900">
                    STATUS: COMMUNITY REPORT // UNVERIFIED
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-sans">
                    Community reports are recorded as unverified. The available source record does not identify an authorized confirmation process or the provenance of a confirmed status. No automated biometrics or simulated verification is applied.
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Docket Metadata Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-[var(--color-bone)]/60 border border-[var(--color-border)] rounded-sm my-6 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[var(--color-ink-soft)] uppercase tracking-wider block mb-1">
                  Server Timestamp
                </span>
                <span className="font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                  <Clock size={13} className="text-[var(--color-ink-soft)]" />
                  {submissionReceipt.time ? new Date(submissionReceipt.time).toLocaleString() : 'Just now'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--color-ink-soft)] uppercase tracking-wider block mb-1">
                  Reporting Citizen
                </span>
                <span className="font-bold text-[var(--color-ink)]">
                  {submissionReceipt.reporter_name || 'Anonymous Community Observer'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-[var(--color-ink-soft)] uppercase tracking-wider block mb-1">
                  Recorded Vicinity / Coordinates
                </span>
                <span className="font-bold text-[var(--color-ink)] flex items-start gap-1.5">
                  <MapPin size={14} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
                  <span className="font-sans text-sm">{submissionReceipt.location}</span>
                </span>
              </div>

              {submissionReceipt.notes && (
                <div className="sm:col-span-2 pt-3 border-t border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-ink-soft)] uppercase tracking-wider block mb-1">
                    Recorded Observation Notes
                  </span>
                  <p className="font-serif italic text-sm text-[var(--color-ink)] leading-relaxed bg-white p-3 border border-[var(--color-border)] rounded">
                    "{submissionReceipt.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Receipt Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-[var(--color-border)]">
              {submissionReceipt.alert_id && (
                <Link
                  to={`/alerts/${submissionReceipt.alert_id}`}
                  className="flex-1 min-h-[48px] sm:min-h-[44px] px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] hover:bg-[var(--color-ink)]/90 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] shadow-xs"
                >
                  <FileText size={16} />
                  <span>View Incident Dossier</span>
                  <ExternalLink size={14} className="opacity-70 ml-1" />
                </Link>
              )}

              <Link
                to="/lost"
                className="flex-1 min-h-[48px] sm:min-h-[44px] px-6 py-3 border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <span>Return to Recovery Board</span>
              </Link>

              <button
                type="button"
                onClick={handleResetForNewObservation}
                className="min-h-[48px] sm:min-h-[44px] px-5 py-3 border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <Plus size={16} />
                <span>Log Another Sighting</span>
              </button>
            </div>
          </section>
        )}

        {/* DRAFT FORM STATE */}
        {submissionState !== 'success' && (
          <>
            {/* Subject Companion Context Banner (If linked to an incident) */}
            {subjectAlert && (
              <div className="mb-8 p-5 bg-white border border-[var(--color-border)] border-l-4 border-l-[var(--color-alert-clay)] shadow-xs rounded-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {subjectAlert.photoUrl ? (
                      <img 
                        src={subjectAlert.photoUrl} 
                        alt={subjectAlert.petName} 
                        className="w-14 h-14 object-cover rounded-sm border border-[var(--color-border)]"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[var(--color-bone)] flex items-center justify-center font-serif text-xl font-bold text-[var(--color-ink-soft)] border border-[var(--color-border)] rounded-sm">
                        {subjectAlert.petName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)] block">
                        LINKED INCIDENT DOCKET #{subjectAlert.id.slice(0, 6).toUpperCase()}
                      </span>
                      <h2 className="text-xl font-serif font-bold text-[var(--color-ink)]">
                        Subject: {subjectAlert.petName}
                      </h2>
                      <p className="text-xs text-[var(--color-ink-soft)]">
                        {subjectAlert.breed} {subjectAlert.species ? `• ${subjectAlert.species}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => { setAlertId(''); setSubjectAlert(null); }}
                    className="text-xs font-mono text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] underline min-h-[44px] min-w-[44px] px-2 flex items-center"
                    aria-label="Clear linked alert and report general sighting"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div 
                role="alert" 
                className="mb-8 p-5 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] flex items-start gap-3 rounded-sm"
              >
                <AlertTriangle size={20} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="block font-bold">Transmission Error</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Sighting Intake Form */}
            <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-[var(--color-border)] p-6 sm:p-10 shadow-sm rounded-sm">
              
              {/* Alert Selection (If not pre-selected or user cleared) */}
              {!subjectAlert && (
                <div className="space-y-2">
                  <label htmlFor="alert-select" className="block text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-ink)]">
                    Subject Incident Docket (Optional)
                  </label>
                  <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                    Select an active missing companion case if you can identify the pet, or leave as General Observation.
                  </p>
                  <select
                    id="alert-select"
                    value={alertId}
                    onChange={(e) => setAlertId(e.target.value)}
                    disabled={submissionState === 'submitting'}
                    className="w-full px-4 py-3.5 bg-transparent border border-[var(--color-border)] text-sm rounded-sm focus:outline-none focus:border-[var(--color-alert-clay)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[48px] sm:min-h-[44px] cursor-pointer"
                  >
                    <option value="">-- General / Unidentified Companion --</option>
                    {activeAlerts.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.petName} ({a.breed}) — Last seen {a.lastSeenAddress ? 'in area' : 'recently'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Observer Name */}
              <div className="space-y-2">
                <label htmlFor="reporter-name" className="block text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Your Name / Field Identifier <span className="text-[var(--color-alert-clay)]">*</span>
                </label>
                <input
                  type="text"
                  id="reporter-name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g., Jordan Miller or Field Scout 12"
                  required
                  disabled={submissionState === 'submitting'}
                  className="w-full px-4 py-3.5 bg-transparent border border-[var(--color-border)] text-sm rounded-sm focus:outline-none focus:border-[var(--color-alert-clay)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[48px] sm:min-h-[44px]"
                />
              </div>

              {/* Sighting Location & GPS Assistant */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label htmlFor="sighting-location" className="block text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-ink)]">
                    Observation Vicinity / Cross Streets <span className="text-[var(--color-alert-clay)]">*</span>
                  </label>
                  
                  {/* GPS Helper Button */}
                  <button
                    type="button"
                    onClick={handleCaptureCoordinates}
                    disabled={submissionState === 'submitting' || gpsStatus === 'locating'}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent-text)] hover:underline min-h-[44px] px-2 self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <Navigation size={13} className={gpsStatus === 'locating' ? 'animate-spin' : ''} />
                    <span>{gpsStatus === 'locating' ? 'Capturing GPS...' : '📍 Use Current Device Coordinates'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="sighting-location"
                    value={sightingLocation}
                    onChange={(e) => setSightingLocation(e.target.value)}
                    placeholder="e.g., Corner of 4th Ave & Elm St, near community center park"
                    required
                    disabled={submissionState === 'submitting'}
                    className="w-full pl-10 pr-4 py-3.5 bg-transparent border border-[var(--color-border)] text-sm rounded-sm focus:outline-none focus:border-[var(--color-alert-clay)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[48px] sm:min-h-[44px]"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-alert-clay)]" />
                </div>
                
                {gpsMessage && (
                  <p className={`text-xs font-mono mt-1 ${gpsStatus === 'error' ? 'text-[var(--color-alert-clay)]' : 'text-emerald-700'}`}>
                    {gpsMessage}
                  </p>
                )}
              </div>

              {/* Observation Details */}
              <div className="space-y-2">
                <label htmlFor="observation-notes" className="block text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Observation Narrative & Appearance <span className="text-[var(--color-alert-clay)]">*</span>
                </label>
                <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                  Include direction of movement, color of collar, visible tags, physical condition, and animal behavior (e.g., wandering calmly, resting, frightened).
                </p>
                <textarea
                  id="observation-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Companion was seen heading northbound towards the reservoir. Wearing a dark red collar, appears uninjured but timid..."
                  required
                  disabled={submissionState === 'submitting'}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--color-border)] text-sm rounded-sm focus:outline-none focus:border-[var(--color-alert-clay)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[100px] resize-y font-sans leading-relaxed"
                />
              </div>

              {/* Photo Deferral Notice (Contract C3) */}
              <div className="p-4 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-ink-soft)] space-y-1">
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[var(--color-ink)] block">
                  NOTE ON PHOTOGRAPHIC ATTACHMENTS (CONTRACT C3)
                </span>
                <p>
                  Sighting photo persistence is deferred on the municipal backend. Please describe physical markings, coat patterns, and collar traits thoroughly in the narrative above.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--color-ink-soft)]">
                  <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
                  <span>Authenticated civic log. Immediate server receipt returned.</span>
                </div>

                <button
                  type="submit"
                  disabled={submissionState === 'submitting'}
                  className="min-h-[48px] sm:min-h-[44px] px-8 py-3.5 bg-[var(--color-alert-clay)] text-white hover:bg-[var(--color-alert-clay)]/90 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submissionState === 'submitting' ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Transmitting Sighting...</span>
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      <span>Transmit Field Sighting</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
