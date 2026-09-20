import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { AlertCircle, ShieldAlert, MapPin, Clock, ArrowLeft, CheckCircle, MessageSquare, Eye } from 'lucide-react';

export default function AlertDetail() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { alerts, sightings, pets } = usePetStore();

  const alert = alerts.find(a => a.id === alertId);
  const alertSightings = sightings.filter(s => s.alertId === alertId);
  const [actionError, setActionError] = useState('');
  const [resolving, setResolving] = useState(false);

  if (!alert) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
        <DashboardNav />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-sm text-center">
            <AlertCircle className="text-[var(--color-alert-clay)] mx-auto mb-4" size={40} />
            <h2 className="text-2xl font-serif font-bold mb-2">Alert Not Found</h2>
            <p className="text-[var(--color-ink-soft)] mb-6 leading-relaxed">
              This alert may have been resolved or removed.
            </p>
            <Link
              to="/lost"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Back to Recovery Board
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isOwner = pets.some(p => p.id === alert.petId);
  const isResolved = alert.status !== 'active';

  const handleResolve = async () => {
    setResolving(true);
    setActionError('');
    try {
      const { ApiClient } = await import('../utils/apiClient');
      await ApiClient.resolveAlert(alert.id);
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (err: any) {
      setActionError(err.message || 'Failed to resolve alert');
      setResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 md:py-14 md:pb-12 pb-28">

        {/* Back */}
        <Link
          to="/lost"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-8"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Recovery Board
        </Link>

        {/* Action error */}
        {actionError && (
          <div className="mb-6 p-4 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-alert-clay)] font-semibold flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Status bar */}
        {isResolved ? (
          <div className="mb-8 flex items-center gap-3 px-5 py-3 bg-[var(--color-trail)]/10 border border-[var(--color-trail)]/20 text-[var(--color-trail)]">
            <CheckCircle size={18} />
            <span className="font-semibold text-sm uppercase tracking-wider">Resolved — {alert.petName} has been found</span>
          </div>
        ) : (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-l-4 border-[var(--color-alert-clay)] bg-[var(--color-alert-clay)]/5">
            <div className="flex items-center gap-3">
              <ShieldAlert size={20} className="text-[var(--color-alert-clay)] shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)]">Active Crisis Alert</span>
                {alert.notifiedNeighborsCount && (
                  <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">
                    {alert.notifiedNeighborsCount} neighbors notified within {alert.broadcastRadiusKm}km
                  </p>
                )}
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleResolve}
                disabled={resolving}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[var(--color-trail)] text-white font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-trail)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={16} />
                {resolving ? 'Resolving…' : 'Mark as Found'}
              </button>
            )}
          </div>
        )}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* LEFT: Pet identity + details */}
          <div className="lg:col-span-7 space-y-8">

            {/* Pet identity hero */}
            <div className="flex gap-6 items-start">
              <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 overflow-hidden bg-[var(--color-ink)]/10 relative">
                <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover" />
                {!isResolved && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-alert-clay)]" />
                )}
              </div>
              <div className="pt-1">
                <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight text-[var(--color-ink)] mb-1">
                  {alert.petName}
                </h1>
                <p className="text-sm font-medium text-[var(--color-ink-soft)] uppercase tracking-wider mb-4">{alert.breed}</p>

                {/* Primary facts */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] block mb-0.5">Last Seen</span>
                      <span className="text-sm font-medium text-[var(--color-ink)]">{alert.lastSeenAddress}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={15} className="text-[var(--color-ink-soft)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] block mb-0.5">Reported</span>
                      <span className="text-sm font-medium text-[var(--color-ink)]">{alert.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full photo */}
            <div className="aspect-[4/3] relative overflow-hidden bg-[var(--color-ink)]/8">
              <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover" />
            </div>

            {/* Description */}
            {alert.description && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-3">Details &amp; Context</h2>
                <p className="text-base leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap">
                  {alert.description}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Actions + sightings */}
          <div className="lg:col-span-5 space-y-8">

            {/* Primary CTA */}
            {!isResolved && (
              <div className="bg-[var(--color-ink)] p-6 text-white">
                <h3 className="text-lg font-serif font-bold mb-2">Seen this pet?</h3>
                <p className="text-[var(--color-bone)]/70 text-sm leading-relaxed mb-5">
                  Even a vague sighting is useful. Report location, direction, and any details you observed.
                </p>
                <Link
                  to={`/sightings/new?alertId=${alert.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[var(--color-marigold)] text-[var(--color-ink)] font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:ring-offset-2 focus:ring-offset-[var(--color-ink)]"
                >
                  <Eye size={16} />
                  Report a Sighting
                </Link>
              </div>
            )}

            {/* Sightings timeline */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] flex items-center gap-2">
                  <MessageSquare size={13} />
                  Sightings
                  <span className="text-[var(--color-ink)]">({alertSightings.length})</span>
                </h2>
              </div>

              {alertSightings.length === 0 ? (
                <div className="border border-[var(--color-ink)]/10 px-5 py-6 text-center">
                  <p className="text-[var(--color-ink-soft)] text-sm">No sightings reported yet.</p>
                  {!isResolved && (
                    <Link
                      to={`/sightings/new?alertId=${alert.id}`}
                      className="mt-3 inline-block text-sm font-semibold text-[var(--color-marigold)] hover:underline"
                    >
                      Be the first to report →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-[var(--color-ink)]/8 border border-[var(--color-ink)]/10">
                  {alertSightings.map(sighting => (
                    <div key={sighting.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-semibold text-sm text-[var(--color-ink)]">{sighting.reporterName}</span>
                        <span className="text-xs text-[var(--color-ink-soft)] shrink-0 mt-0.5">{sighting.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-[var(--color-ink)] mb-1.5">
                        <MapPin size={12} className="text-[var(--color-alert-clay)] shrink-0" />
                        <span className="font-medium">{sighting.location}</span>
                      </div>
                      {sighting.notes && (
                        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed pl-4 border-l-2 border-[var(--color-ink)]/15">
                          {sighting.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Help context */}
            <div className="border border-[var(--color-ink)]/10 px-5 py-4 text-sm text-[var(--color-ink-soft)] leading-relaxed space-y-2">
              <p className="font-semibold text-[var(--color-ink)] text-xs uppercase tracking-wider">If you see this pet</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Note exact street or landmark</li>
                <li>Do not chase — stay calm and report</li>
                <li>Note the direction it was heading</li>
                <li>Take a photo if safe to do so</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
