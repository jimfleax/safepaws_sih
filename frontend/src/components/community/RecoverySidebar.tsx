import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Eye, 
  MapPin, 
  Heart, 
  AlertCircle, 
  Clock, 
  Info, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function RecoverySidebar({ activeAlerts }: { activeAlerts: any[] }) {
  return (
    <div className="flex-col h-full bg-white border-l border-[var(--color-border)] w-80 flex-shrink-0 hidden lg:flex py-5 shadow-xs">
      
      {/* Sidebar Header */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-[var(--color-alert-clay)]" />
          <h2 className="text-base font-serif font-bold text-[var(--color-ink)]">Recovery Hub</h2>
        </div>
        <p className="text-xs text-[var(--color-ink-soft)] font-light">Community missing-pet network</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6">
        
        {/* Quick Recovery Actions */}
        <div>
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2.5">
            Quick Actions
          </h3>
          <div className="grid gap-2">
            <Link 
              to="/lost/new" 
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--color-alert-clay)] text-white hover:bg-[#9A3926] transition-all shadow-xs group min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Report Lost Pet</span>
            </Link>
            <Link 
              to="/sightings/new" 
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] transition-all shadow-xs group min-h-[44px]"
            >
              <Eye className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold">Log Pet Sighting</span>
            </Link>
          </div>
        </div>

        {/* Active Emergency Broadcasts */}
        <div>
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3 flex items-center justify-between">
            <span>Active Alerts</span>
            <span className="bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {activeAlerts.length}
            </span>
          </h3>

          {activeAlerts.length === 0 ? (
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1.5 opacity-80" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">No Active Alerts</p>
              <p className="text-[11px] text-[var(--color-ink-soft)] font-light mt-0.5 leading-relaxed">
                Your community network has no reported missing companions.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeAlerts.slice(0, 4).map(a => (
                <Link 
                  key={a.id} 
                  to={`/alerts/${a.id}`} 
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-alert-clay)]/50 hover:bg-[var(--color-surface)] transition-all group bg-white shadow-xs"
                >
                  <div className="w-11 h-11 rounded-lg bg-[var(--color-surface)] overflow-hidden border border-[var(--color-border)] shrink-0 flex items-center justify-center">
                    {a.photoUrl ? (
                      <img src={a.photoUrl} alt={a.petName} className="w-full h-full object-cover" />
                    ) : (
                      <Heart className="w-4 h-4 text-[var(--color-ink-soft)] opacity-40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--color-ink)] truncate group-hover:text-[var(--color-alert-clay)] transition-colors">
                      {a.petName}
                    </p>
                    <p className="text-[11px] text-[var(--color-ink-soft)] truncate flex items-center gap-1 mt-0.5 font-light">
                      <MapPin className="w-3 h-3 text-[var(--color-alert-clay)] shrink-0" />
                      <span>{a.lastSeenAddress || 'Local area'}</span>
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-ink-soft)] opacity-40 group-hover:opacity-100 group-hover:text-[var(--color-alert-clay)] transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Authentic Community Field Guidance */}
        <div className="pt-4 border-t border-[var(--color-border)]">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2.5 flex items-center gap-1">
            <Info className="w-3 h-3 text-[var(--color-marigold)]" />
            <span>Field Response Protocol</span>
          </h3>
          <ul className="text-[11px] text-[var(--color-ink-soft)] space-y-2 font-light leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-marigold)] mt-1 shrink-0" />
              <span>Scan collar QR tag for instant verified profile and location ping.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-marigold)] mt-1 shrink-0" />
              <span>Use the Biometric Scanner if collar tag is absent or damaged.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-marigold)] mt-1 shrink-0" />
              <span>Do not pursue frightened animals; note last known vector and report.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}