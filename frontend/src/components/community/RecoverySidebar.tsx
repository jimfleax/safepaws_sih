import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Eye, 
  MapPin, 
  Clock, 
  ArrowRight,
  Radio,
  FileText
} from 'lucide-react';
import { LedgerStatusStamp } from '../ui/LedgerStatusStamp';

export function RecoverySidebar({ activeAlerts }: { activeAlerts: any[] }) {
  return (
    <aside 
      aria-label="Recovery Hub & Active Search Corridor"
      className="flex-col h-full bg-white border-l border-[var(--color-border)] w-80 flex-shrink-0 hidden lg:flex py-6 shadow-xs select-none"
    >
      {/* Sidebar Header */}
      <div className="px-6 mb-6 border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-alert-clay)] uppercase">
            ACTIVE RECOVERY CORRIDOR
          </span>
        </div>
        <h2 className="text-lg font-serif font-bold text-[var(--color-ink)] leading-snug">
          Incident Command
        </h2>
        <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
          Civic search & recovery operations
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6">
        
        {/* Quick Recovery Actions */}
        <div>
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-2.5">
            Emergency Dispatch Actions
          </h3>
          <div className="grid gap-2.5">
            <Link 
              to="/lost/new" 
              className="flex items-center gap-2.5 p-3 rounded-sm bg-[var(--color-alert-clay)] text-white hover:opacity-90 active:translate-y-[1px] transition-all shadow-xs group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase">Declare Missing Companion</span>
            </Link>
            <Link 
              to="/sightings/new" 
              className="flex items-center gap-2.5 p-3 rounded-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] active:translate-y-[1px] transition-all shadow-xs group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <Eye className="w-4 h-4 text-[var(--color-trail)] shrink-0" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase">Log Field Sighting</span>
            </Link>
          </div>
        </div>

        {/* Active Emergency Broadcasts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
              Active Missing Incidents
            </h3>
            <span className="bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border border-[var(--color-alert-clay)]/20 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold">
              {activeAlerts.length}
            </span>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="p-4 bg-[var(--color-bone)]/50 border border-[var(--color-border)] rounded-sm text-center">
              <span className="text-xs font-mono text-[var(--color-ink-soft)] block uppercase">
                Sector Quiet
              </span>
              <span className="text-[11px] text-[var(--color-ink-soft)] block mt-1">
                Zero active missing companion declarations on record.
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeAlerts.slice(0, 5).map(alert => (
                <Link
                  key={alert.id}
                  to={`/alerts/${alert.id}`}
                  className="block p-3 bg-[var(--color-bone)]/40 border border-[var(--color-border)] rounded-sm hover:border-[var(--color-alert-clay)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-serif font-bold text-sm text-[var(--color-ink)] group-hover:text-[var(--color-alert-clay)] transition-colors">
                      {alert.petName || 'Companion Animal'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[var(--color-alert-clay)] text-white rounded-sm font-bold uppercase">
                      ACTIVE
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[var(--color-ink-soft)] flex items-center gap-1.5 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-[var(--color-alert-clay)] shrink-0" />
                    <span className="truncate">
                      {alert.lastSeenAddress ? 'Vicinity Reported' : 'Sector Unspecified'}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[var(--color-ink-soft)] flex items-center justify-between mt-2 pt-1.5 border-t border-[var(--color-border)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                    <span className="font-bold text-[var(--color-accent-text)] group-hover:underline flex items-center gap-0.5">
                      Command <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}

              {activeAlerts.length > 5 && (
                <Link
                  to="/lost"
                  className="block text-center py-2 text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent-text)] hover:underline"
                >
                  View All ({activeAlerts.length}) Incidents →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Naturalist & Civic Guidelines */}
        <div className="p-4 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-sm font-mono text-[11px]">
          <span className="font-bold uppercase text-[var(--color-ink)] block mb-1">
            Guardian Protocol
          </span>
          <p className="text-[var(--color-ink-soft)] leading-relaxed">
            Reported sightings update the incident command log. Never wire money to unverified callers. Coordinate recovery in public daylight corridors.
          </p>
        </div>

      </div>
    </aside>
  );
}
