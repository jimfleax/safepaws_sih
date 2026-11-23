import React from 'react';
import { NeighborhoodAlert } from '../../types';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';
import { Badge } from './Badge';

export interface AlertCardProps {
  alert: NeighborhoodAlert;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, className = '' }) => {
  return (
    <div
      className={`group bg-[var(--color-surface)] rounded-[var(--radius-24)] p-4 border border-[var(--color-border)] shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-alert-clay)] hover:shadow-xl flex flex-col gap-4 ${className}`}
    >
      <div className="relative h-56 w-full rounded-[var(--radius-16)] overflow-hidden bg-[var(--color-bone)]">
        {alert.photoUrl ? (
          <img
            src={alert.photoUrl}
            alt={alert.petName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-soft)]/50">
            No Photo Available
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant="alert" pulse className="px-3 py-1 font-mono uppercase tracking-wider text-[11px] shadow-sm">
            Missing
          </Badge>
        </div>
      </div>

      <div className="px-2">
        <h3 className="font-serif text-[24px] text-[var(--color-ink)] leading-tight mb-1 font-bold">
          {alert.petName}
        </h3>
        <p className="text-[14px] text-[var(--color-ink-soft)] truncate font-mono uppercase tracking-wider">
          {alert.breed}
        </p>

        <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-3 text-[13px] text-[var(--color-ink)]">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[var(--color-accent-text)] shrink-0" aria-hidden="true" />
            <span className="truncate">{alert.lastSeenAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[var(--color-ink-soft)] shrink-0" aria-hidden="true" />
            <span>{alert.timeAgo}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[var(--color-success)] shrink-0" aria-hidden="true" />
            <span>{alert.notifiedNeighborsCount} neighbors notified</span>
          </div>
        </div>
      </div>

      <Link
        to={`/alerts/${alert.id}`}
        className="w-full py-3 mt-1 font-semibold rounded-[var(--radius-16)] transition-colors text-center text-[14px] bg-[var(--color-bone)] text-[var(--color-alert-clay)] hover:bg-[var(--color-alert-clay)] hover:text-white border border-[var(--color-border)] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
      >
        View Alert Details
      </Link>
    </div>
  );
};
