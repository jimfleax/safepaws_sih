import React, { useState, useMemo } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Search, ArrowRight, ScanLine, Clock } from 'lucide-react';

type SortKey = 'recent' | 'sightings';

export default function LostDogs() {
  const { alerts, sightings } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const [sort, setSort] = useState<SortKey>('recent');

  const sortedAlerts = useMemo(() => {
    if (sort === 'sightings') {
      return [...activeAlerts].sort((a, b) => {
        const aCount = sightings.filter(s => s.alertId === a.id).length;
        const bCount = sightings.filter(s => s.alertId === b.id).length;
        return bCount - aCount;
      });
    }
    return activeAlerts;
  }, [activeAlerts, sightings, sort]);

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 md:py-16 md:pb-12 pb-28">

        {/* Page header */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert-clay)] animate-pulse inline-block" />
                Live · Recovery Board
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight text-[var(--color-ink)]">
                Active Alerts
                {activeAlerts.length > 0 && (
                  <span className="ml-4 text-2xl font-serif font-normal text-[var(--color-ink-soft)]">
                    {activeAlerts.length}
                  </span>
                )}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2 px-4 py-3 border border-[var(--color-ink)]/20 text-[var(--color-ink)] font-semibold text-sm hover:border-[var(--color-ink)]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-2"
              >
                <ScanLine size={16} />
                Identify a Pet
              </Link>
              <Link
                to="/lost/new"
                className="inline-flex items-center gap-2 px-4 py-3 bg-[var(--color-alert-clay)] text-white font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-alert-clay)] focus:ring-offset-2 shrink-0"
              >
                <ShieldAlert size={16} />
                Report Missing
              </Link>
            </div>
          </div>

          {/* Filter / Sort bar */}
          {activeAlerts.length > 1 && (
            <div className="flex items-center gap-1 border-b border-[var(--color-ink)]/10 pb-0">
              {(['recent', 'sightings'] as SortKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px focus:outline-none ${
                    sort === key
                      ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {key === 'recent' ? 'Most Recent' : 'Most Sightings'}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Empty state */}
        {activeAlerts.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="w-16 h-16 mb-6 border border-[var(--color-ink)]/15 rounded-full flex items-center justify-center">
              <Search className="text-[var(--color-ink-soft)]" size={28} />
            </div>
            <h2 className="text-2xl font-serif text-[var(--color-ink)] mb-3">No Active Alerts</h2>
            <p className="text-[var(--color-ink-soft)] max-w-sm mx-auto leading-relaxed">
              There are currently no reported lost pets. SafePaws remains active and monitoring.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-ink)]/8">
            {sortedAlerts.map(alert => {
              const alertSightingCount = sightings.filter(s => s.alertId === alert.id).length;
              return (
                <Link
                  key={alert.id}
                  to={`/alerts/${alert.id}`}
                  className="group flex gap-5 md:gap-8 py-6 items-start hover:bg-[var(--color-ink)]/[0.025] transition-colors -mx-4 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-alert-clay)] focus:ring-inset"
                >
                  {/* Photo */}
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden bg-[var(--color-ink)]/10 relative">
                    <img
                      src={alert.photoUrl}
                      alt={alert.petName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--color-alert-clay)]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-ink)] leading-tight">
                          {alert.petName}
                        </h3>
                        <p className="text-sm text-[var(--color-ink-soft)] font-medium mt-0.5">{alert.breed}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-alert-clay)] bg-[var(--color-alert-clay)]/8 px-2.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert-clay)] animate-pulse" />
                          Missing
                        </span>
                      </div>
                    </div>

                    {/* Key facts row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-3 mb-3">
                      <span className="flex items-center gap-1.5 text-sm text-[var(--color-ink)]">
                        <MapPin size={13} className="text-[var(--color-alert-clay)] shrink-0" />
                        <span className="truncate max-w-[180px] md:max-w-none">{alert.lastSeenAddress}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)]">
                        <Clock size={13} className="shrink-0" />
                        {alert.timeAgo}
                      </span>
                      {alertSightingCount > 0 && (
                        <span className="text-sm font-semibold text-[var(--color-trail)]">
                          {alertSightingCount} sighting{alertSightingCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[var(--color-ink-soft)] line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center self-center shrink-0 text-[var(--color-ink-soft)] group-hover:text-[var(--color-alert-clay)] transition-colors">
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
