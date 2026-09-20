import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ApiClient } from '../utils/apiClient';
import { MapPin, ArrowLeft, AlertCircle, CheckCircle, Eye } from 'lucide-react';

export default function ReportSighting() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultAlertId = searchParams.get('alertId') || '';

  // Also support navigate('/sightings/new', { state: { petId } }) from PublicTagProfile
  const stateData = location.state as { petId?: string } | null;
  const statePetId = stateData?.petId || '';

  const { alerts } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  // Resolve alertId from petId state (find active alert for that pet)
  const alertFromPetId = statePetId
    ? activeAlerts.find(a => a.petId === statePetId)?.id || ''
    : '';

  const resolvedDefaultAlertId = defaultAlertId || alertFromPetId;

  // Pre-fill from linked alert
  const linkedAlert = resolvedDefaultAlertId ? alerts.find(a => a.id === resolvedDefaultAlertId) : null;

  const [alertId, setAlertId] = useState(resolvedDefaultAlertId);
  const [reporterName, setReporterName] = useState('');
  const [sightingLocation, setSightingLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const serverSighting = await ApiClient.reportSighting({
        reporterName,
        location: sightingLocation,
        notes,
        alertId: alertId || undefined
      });

      await usePetStore.getState().hydrate();
      setSubmitted(true);

      // After 1.5s navigate to the alert or community
      setTimeout(() => {
        if (serverSighting.alert_id) {
          navigate(`/alerts/${serverSighting.alert_id}`);
        } else {
          navigate('/community');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit sighting');
      setIsSubmitting(false);
    }
  };

  const backHref = resolvedDefaultAlertId ? `/alerts/${resolvedDefaultAlertId}` : '/lost';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-10 md:py-14 md:pb-12 pb-28">

        {/* Back */}
        <Link
          to={backHref}
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-8"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          {linkedAlert ? linkedAlert.petName : 'Recovery Board'}
        </Link>

        {/* Header */}
        <header className="mb-8 border-b border-[var(--color-ink)]/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2 text-[var(--color-ink)]">
            Report a Sighting
          </h1>
          {linkedAlert ? (
            <p className="text-sm text-[var(--color-ink-soft)]">
              For: <span className="font-semibold text-[var(--color-ink)]">{linkedAlert.petName}</span> — {linkedAlert.breed}
            </p>
          ) : (
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed">
              Your observation matters. Provide as much location detail as you can.
            </p>
          )}
        </header>

        {/* Success state */}
        {submitted && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-trail)]/10 flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-[var(--color-trail)]" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--color-ink)] mb-2">Sighting Recorded</h2>
            <p className="text-[var(--color-ink-soft)] text-sm">Redirecting you now…</p>
          </div>
        )}

        {!submitted && (
          <>
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-alert-clay)] flex gap-3 items-start">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Location — primary field, elevated */}
              <div className="space-y-2">
                <label htmlFor="sightingLocation" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Where did you see the pet?
                  <span className="text-[var(--color-alert-clay)] ml-1">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-alert-clay)]" size={18} />
                  <input
                    type="text"
                    id="sightingLocation"
                    value={sightingLocation}
                    onChange={(e) => setSightingLocation(e.target.value)}
                    placeholder="Street name, landmark, intersection…"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30 disabled:opacity-50"
                    required
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-[var(--color-ink-soft)]">Be specific — approximate is fine, but street-level is best</p>
              </div>

              {/* Alert selector (if not pre-filled) */}
              {!defaultAlertId && (
                <div className="space-y-2">
                  <label htmlFor="alertId" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                    Which pet? (Optional)
                  </label>
                  <select
                    id="alertId"
                    value={alertId}
                    onChange={(e) => setAlertId(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="">Unknown / General Sighting</option>
                    {activeAlerts.map(a => (
                      <option key={a.id} value={a.id}>{a.petName} — {a.breed}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reporter name */}
              <div className="space-y-2">
                <label htmlFor="reporterName" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Your Name
                  <span className="text-[var(--color-alert-clay)] ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="reporterName"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="How should the owner reach you?"
                  className="w-full px-4 py-3.5 bg-white border border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30 disabled:opacity-50"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  What did you observe?
                  <span className="text-[var(--color-alert-clay)] ml-1">*</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Direction it was heading, behavior, collar, time of day, any photos taken…"
                  rows={4}
                  className="w-full px-4 py-3.5 bg-white border border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30 resize-none disabled:opacity-50"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--color-ink)] text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-[var(--color-ink)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye size={18} />
                  {isSubmitting ? 'Submitting…' : 'Submit Sighting'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
