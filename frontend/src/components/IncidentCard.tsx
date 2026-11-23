import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Check
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface IncidentCardProps {
  alert: NeighborhoodAlert;
  onEmergencyContact?: (alert: NeighborhoodAlert) => void;
  onReportSighting?: (alert: NeighborhoodAlert) => void;
  className?: string;
  distanceKm?: number;
  bearing?: string;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  alert,
  onEmergencyContact,
  onReportSighting,
  className = '',
  distanceKm,
  bearing,
}) => {
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Heuristic species detection
  const isCat = 
    alert.breed.toLowerCase().includes('cat') || 
    alert.breed.toLowerCase().includes('feline');
  const speciesLabel = isCat ? 'FELINE COMPANION' : 'CANINE COMPANION';

  // Computed or deterministic distance vector based on alert broadcast radius
  const formattedDistance = distanceKm 
    ? `${distanceKm.toFixed(1)} KM`
    : `${(alert.broadcastRadiusKm * 0.4).toFixed(1)} KM`;
  const formattedBearing = bearing || 'NE 42°';

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

  return (
    <>
      <article
        className={`group bg-white border border-[var(--color-border)] hover:border-[var(--color-alert-clay)] rounded-[var(--radius-24)] overflow-hidden transition-all duration-300 shadow-[var(--shadow-card)] hover:shadow-xl flex flex-col justify-between ${className}`}
        aria-label={`Incident alert for ${alert.petName}, ${alert.breed}`}
      >
        {/* Top Photographic Surface & Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface)]">
          {alert.photoUrl ? (
            <img
              src={alert.photoUrl}
              alt={`Photograph of missing pet ${alert.petName}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink-soft)]/50 gap-2">
              <Heart className="w-12 h-12 stroke-1" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider">No Photo Available</span>
            </div>
          )}

          {/* Top Edge Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            {/* Status Pulse */}
            <Badge variant="alert" pulse className="px-3 py-1 font-mono uppercase tracking-wider text-[11px] shadow-md pointer-events-auto">
              ACTIVE SEARCH
            </Badge>

            {/* Species Tag */}
            <Badge
              variant={isCat ? 'neutral' : 'scout'}
              className="px-2.5 py-1 text-[10px] font-mono tracking-wider shadow-sm pointer-events-auto"
            >
              {speciesLabel}
            </Badge>
          </div>

          {/* Bottom Photo Gradient Vignette for Distance Vector */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-6 flex items-center justify-between text-white font-mono text-[11px]">
            {/* Distance Vector Pin */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <Compass className="w-3.5 h-3.5 text-[var(--color-marigold)]" aria-hidden="true" />
              <span>{formattedDistance} • VECTOR {formattedBearing}</span>
            </div>

            {/* Quick Share Trigger */}
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share alert for ${alert.petName}`}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer pointer-events-auto"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden="true" />
              ) : (
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Content Dossier Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Heading & Breed */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2">
                <Link
                  to={`/alerts/${alert.id}`}
                  className="font-serif text-2xl font-bold text-[var(--color-ink)] hover:text-[var(--color-alert-clay)] transition-colors line-clamp-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  {alert.petName}
                </Link>
                <span className="font-mono text-[11px] text-[var(--color-ink-soft)] bg-[var(--color-bone)] px-2 py-0.5 rounded border border-[var(--color-border)] shrink-0">
                  #{alert.id.slice(0, 6).toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--color-ink-soft)] mt-0.5">
                {alert.breed || 'Companion'}
              </p>
            </div>

            {/* Micro Telemetry Rows */}
            <div className="space-y-2.5 pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-ink-soft)]">
              {/* Last Seen Vector */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-alert-clay)] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-soft)] block">Last Seen Vector</span>
                  <span className="text-[var(--color-ink)] font-medium line-clamp-1">
                    {alert.lastSeenAddress || 'Local Neighborhood'}
                  </span>
                </div>
              </div>

              {/* Reported Timestamp */}
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--color-alert-clay)] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-soft)] block">Elapsed Time</span>
                  <span className="text-[var(--color-ink)] font-medium">{alert.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Description Snippet */}
            {alert.description && (
              <p className="mt-3 text-xs text-[var(--color-ink-soft)] line-clamp-2 leading-relaxed">
                {alert.description}
              </p>
            )}
          </div>

          {/* Immediate Emergency Action Bar */}
          <div className="pt-5 mt-5 border-t border-[var(--color-border)] space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              {/* Action 1: Immediate Emergency Contact */}
              <Button
                variant="alert"
                size="sm"
                onClick={handleOpenContact}
                leftIcon={<Phone className="w-3.5 h-3.5" aria-hidden="true" />}
                className="w-full text-xs font-bold uppercase tracking-wider min-h-[44px]"
              >
                CALL RELAY
              </Button>

              {/* Action 2: Report Sighting */}
              {onReportSighting ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onReportSighting(alert)}
                  leftIcon={<Eye className="w-3.5 h-3.5" aria-hidden="true" />}
                  className="w-full text-xs font-bold uppercase tracking-wider min-h-[44px]"
                >
                  SIGHTING
                </Button>
              ) : (
                <Link
                  to="/community"
                  className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-16)] font-semibold border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bone)] text-[var(--color-ink)] text-xs uppercase tracking-wider min-h-[44px] px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>SIGHTING</span>
                </Link>
              )}
            </div>

            {/* Action 3: Incident Room Navigation */}
            <Link
              to={`/alerts/${alert.id}`}
              className="w-full flex items-center justify-between text-xs font-semibold text-[var(--color-accent-text)] hover:text-[var(--color-accent-text-hover)] p-2 rounded-xl hover:bg-[var(--color-bone)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>View Full Incident Dossier</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>

      {/* Immediate Emergency Voice Relay Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`emergency-relay-title-${alert.id}`}
        >
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-24)] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 id={`emergency-relay-title-${alert.id}`} className="font-serif text-xl font-bold text-[var(--color-ink)]">
                    Direct Emergency Relay
                  </h3>
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    Immediate contact for {alert.petName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                aria-label="Close emergency contact modal"
                className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-bone)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Privacy Safeguard Notice */}
            <div className="bg-[var(--color-bone)] border border-[var(--color-border)] rounded-[var(--radius-16)] p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[var(--color-success)] uppercase">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                <span>Zero-Leak Voice Proxy Active</span>
              </div>
              <p className="text-[var(--color-ink-soft)] leading-relaxed">
                To protect owner privacy and community safety, this call connects through the SafePaws encrypted relay. Your phone number remains completely anonymous.
              </p>
            </div>

            {/* Relay Action */}
            <div className="space-y-3 pt-2">
              <a
                href="tel:18005557297"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-bold text-xs uppercase tracking-wider rounded-[var(--radius-16)] shadow-md transition-all active:scale-[0.98] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Call Guardian Now (1-800-555-PAWS)</span>
              </a>

              <Button
                variant="secondary"
                size="default"
                fullWidth
                onClick={() => setShowContactModal(false)}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
