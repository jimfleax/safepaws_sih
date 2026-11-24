import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NeighborhoodAlert } from '../types';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Eye, 
  ArrowRight, 
  Compass, 
  ShieldAlert, 
  Heart, 
  X,
  Share2,
  Check,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { getExplicitSpecies } from '../utils/species';
import { LedgerStatusStamp } from './ui/LedgerStatusStamp';

export interface IncidentCardProps {
  alert: NeighborhoodAlert;
  onEmergencyContact?: (alert: NeighborhoodAlert) => void;
  onReportSighting?: (alert: NeighborhoodAlert) => void;
  className?: string;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  alert,
  onEmergencyContact,
  onReportSighting,
  className = '',
}) => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Contract C2: Explicit species classification (NO breed guessing)
  const species = getExplicitSpecies(alert);
  const speciesLabel = 
    species === 'cat' 
      ? 'FELINE COMPANION' 
      : species === 'dog' 
      ? 'CANINE COMPANION' 
      : species === 'other'
      ? 'OTHER COMPANION'
      : 'SPECIES UNCONFIRMED';

  // Contract C3: Grounded telemetry (strictly no invented fallback radius or synthetic bearings)
  const telemetryDisplay = alert.lastSeenAddress ? 'LOCATION REPORTED' : 'LOCATION DETAILS UNAVAILABLE';

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/alerts/${alert.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEmergencyContact) {
      onEmergencyContact(alert);
    } else {
      setShowContactModal(true);
    }
  };

  const isResolved = alert.status === 'resolved';

  return (
    <>
      <article
        className={`group bg-white border border-[var(--color-border)] hover:border-[var(--color-alert-clay)] rounded-[var(--radius-16)] overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between ${
          isResolved ? 'border-l-4 border-l-[var(--color-trail)]' : 'border-l-4 border-l-[var(--color-alert-clay)]'
        } ${className}`}
        aria-label={`Incident alert for ${alert.petName}, ${alert.breed}`}
      >
        {/* Top Photographic Surface & Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bone)]/50 border-b border-[var(--color-border)]">
          {alert.photoUrl ? (
            <img
              src={alert.photoUrl}
              alt={`Photograph of missing pet ${alert.petName}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink-soft)]/50 gap-2 p-4 text-center">
              <Heart className="w-10 h-10 stroke-1 text-[var(--color-ink-soft)]" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-soft)] font-medium">No Photo Available</span>
            </div>
          )}

          {/* Top Edge Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            {/* Status Pulse */}
            <Badge 
              variant={isResolved ? 'scout' : 'alert'} 
              pulse={!isResolved} 
              className="px-3 py-1 font-mono uppercase tracking-wider text-[11px] shadow-sm pointer-events-auto"
            >
              {isResolved ? 'REUNITED & CLOSED' : 'ACTIVE SEARCH'}
            </Badge>

            {/* Species Tag */}
            <Badge
              variant={species === 'cat' ? 'neutral' : species === 'dog' ? 'scout' : 'neutral'}
              className="px-2.5 py-1 text-[10px] font-mono tracking-wider shadow-xs pointer-events-auto bg-white/95 text-[var(--color-ink)] border border-[var(--color-border)]"
            >
              {speciesLabel}
            </Badge>
          </div>

          {/* Bottom Photo Gradient Vignette for Telemetry Vector */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-white font-mono text-[11px]">
            {/* Grounded Location Indicator */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-white/20">
              <Compass className="w-3.5 h-3.5 text-[var(--color-marigold)]" aria-hidden="true" />
              <span className="font-bold tracking-wider">{telemetryDisplay}</span>
            </div>

            {/* Contract C4: Quick Share Trigger with Accessible >= 44x44px Touch Target */}
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share alert for ${alert.petName}`}
              className="p-2.5 rounded-sm bg-black/50 backdrop-blur-xs hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <Share2 className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Content Dossier Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Heading, Docket Tag & Stamp */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-2">
                <Link
                  to={`/alerts/${alert.id}`}
                  className="font-serif text-2xl font-bold text-[var(--color-ink)] hover:text-[var(--color-alert-clay)] transition-colors line-clamp-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  {alert.petName}
                </Link>
                <span className="font-mono text-[11px] font-bold text-[var(--color-ink-soft)] bg-[var(--color-bone)] px-2 py-0.5 rounded-sm border border-[var(--color-border)] shrink-0">
                  #{alert.id.slice(0, 6).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                  {alert.breed || 'Companion Animal'}
                </p>
                <LedgerStatusStamp 
                  state={isResolved ? 'REUNITED_CLOSED' : 'ACTIVE_SEARCH'} 
                  size="sm" 
                  jitter={-0.8} 
                />
              </div>
            </div>

            {/* Micro Telemetry Rows */}
            <div className="space-y-2.5 pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-ink-soft)]">
              {/* Contract C6: Last Seen Vicinity (suppresses raw street addresses) */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-alert-clay)] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-ink-soft)] block tracking-wider">Last Seen Vicinity</span>
                  <span className="text-[var(--color-ink)] font-medium line-clamp-1" title="Area details restricted for owner privacy">
                    Area details restricted for owner privacy
                  </span>
                </div>
              </div>

              {/* Reported Timestamp */}
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--color-alert-clay)] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-ink-soft)] block tracking-wider">Elapsed Time</span>
                  <span className="text-[var(--color-ink)] font-medium">{alert.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Description Snippet */}
            {alert.description && (
              <p className="mt-3 text-xs text-[var(--color-ink)]/85 line-clamp-2 leading-relaxed font-sans bg-[var(--color-bone)]/40 p-2.5 rounded-sm border border-[var(--color-border)]">
                {alert.description}
              </p>
            )}
          </div>

          {/* Immediate Emergency Action Bar */}
          <div className="pt-5 mt-5 border-t border-[var(--color-border)] space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              {/* Action 1: Incident Contact Protocol */}
              <Button
                variant="alert"
                size="sm"
                onClick={handleOpenContact}
                leftIcon={<Phone className="w-3.5 h-3.5" aria-hidden="true" />}
                className="w-full text-xs font-bold uppercase tracking-wider min-h-[44px] rounded-sm"
              >
                RECOVERY NOTICE
              </Button>

              {/* Action 2: Report Sighting */}
              {onReportSighting ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onReportSighting(alert)}
                  leftIcon={<Eye className="w-3.5 h-3.5 text-[var(--color-alert-clay)]" aria-hidden="true" />}
                  className="w-full text-xs font-bold uppercase tracking-wider min-h-[44px] rounded-sm"
                >
                  SIGHTING
                </Button>
              ) : (
                <Link
                  to={`/sightings/new?alertId=${alert.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm font-semibold border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bone)] text-[var(--color-ink)] text-xs uppercase tracking-wider min-h-[44px] px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--color-alert-clay)]" aria-hidden="true" />
                  <span>SIGHTING</span>
                </Link>
              )}
            </div>

            {/* Action 3: Incident Room Navigation */}
            <Link
              to={`/alerts/${alert.id}`}
              className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-accent-text)] hover:text-[#5C3100] p-2 rounded-sm hover:bg-[var(--color-bone)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>View Full Incident Dossier</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>

      {/* Contract C3: Grounded Guardian Contact & Safety Protocol Modal (Eliminates Fictional Relay & 1-800 Dialers) */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`recovery-protocol-title-${alert.id}`}
        >
          <div className="bg-white border border-[var(--color-border)] rounded-sm max-w-md w-full p-6 sm:p-8 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id={`recovery-protocol-title-${alert.id}`} className="font-serif text-xl font-bold text-[var(--color-ink)]">
                    Guardian Recovery Protocol
                  </h3>
                  <p className="text-xs text-[var(--color-ink-soft)] font-mono">
                    Incident #{alert.id.slice(0, 6).toUpperCase()} • {alert.petName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                aria-label="Close emergency contact modal"
                className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] rounded-sm hover:bg-[var(--color-bone)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Anti-Scam Guidance */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-sm p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-900 uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Anti-Extortion & Safety Invariant</span>
              </div>
              <p className="text-[var(--color-ink-soft)] leading-relaxed">
                Never wire money, send courier fees, or reveal verification codes to strangers claiming to hold a pet. SafePaws never requires payment for pet reunification. Meet only in daylight at a busy public municipal location.
              </p>
              <p className="text-[var(--color-ink-soft)]/90 text-[11px] border-t border-amber-200/70 pt-2 leading-relaxed">
                Community-submitted observational sightings appear in the incident timeline. SafePaws does not currently provide a masked call relay or automated voice proxy.
              </p>
            </div>

            {/* Direct Observational Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowContactModal(false);
                  navigate(`/sightings/new?alertId=${alert.id}`);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm shadow-xs transition-all active:translate-y-[1px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                <span>Submit Observational Sighting</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowContactModal(false);
                  navigate(`/alerts/${alert.id}`);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[var(--color-border)] hover:bg-[var(--color-bone)] text-[var(--color-ink)] font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
              >
                <span>View Full Incident Dossier</span>
              </button>

              <Button
                variant="secondary"
                size="default"
                fullWidth
                onClick={() => setShowContactModal(false)}
                className="min-h-[44px] rounded-sm font-mono text-xs uppercase tracking-wider"
              >
                Close Protocol
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
