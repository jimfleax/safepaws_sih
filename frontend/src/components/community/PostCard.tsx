import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, Clock, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { LedgerStatusStamp, LedgerStampState } from '../ui/LedgerStatusStamp';

export type Post = {
  id: string;
  title: string;
  content: string;
  channel: string;
  author_id?: string;
  author_name?: string;
  created_at: string;
  reply_count?: number;
  associated_alert_id?: string | null;
  location?: string | null;
  pet_name?: string | null;
};

export function PostCard({ post }: { post: Post; key?: React.Key }) {
  const { user } = useAuthStore();
  const isLostFound = post.channel === 'lost-found';
  const isSighting = post.channel === 'sightings';
  const isReunion = post.channel === 'reunion-stories';
  const hasAlert = Boolean(post.associated_alert_id);

  // Author identity: Truth-in-engineering without fabricating names or exposing internal IDs
  const isCurrentUser = Boolean(post.author_id && user?.id === post.author_id);
  const authorDisplay = post.author_name 
    ? post.author_name 
    : (isCurrentUser && user?.name) 
      ? user.name 
      : 'Community member';

  const authorInitial = authorDisplay.charAt(0).toUpperCase() || 'C';

  // Determine appropriate rubber stamp state
  let stampState: LedgerStampState = 'COMMUNITY_NOTE';
  if (hasAlert || isLostFound) {
    stampState = 'ACTIVE_SEARCH';
  } else if (isSighting) {
    stampState = 'UNVERIFIED_SIGHTING';
  } else if (isReunion) {
    stampState = 'REUNITED_CLOSED';
  }

  // Location privacy (SEC-BACKEND-01): suppress raw residential addresses on public cards
  const displayLocation = post.location 
    ? post.location.replace(/^\d+[\s\w,]+?(?=(Sector|Block|Near|Opposite|Road|Nagar|Colony|Enclave|Vihar|Market|Area|$))/i, '') || 'Vicinity Reported'
    : null;

  return (
    <article 
      className={`bg-white border rounded-sm p-5 sm:p-6 transition-all shadow-xs hover:shadow-sm relative ${
        hasAlert || isLostFound 
          ? 'border-[var(--color-border)] border-l-4 border-l-[var(--color-alert-clay)]' 
          : isSighting 
            ? 'border-[var(--color-border)] border-l-4 border-l-[var(--color-marigold)]'
            : isReunion
              ? 'border-[var(--color-border)] border-l-4 border-l-[var(--color-trail)]'
              : 'border-[var(--color-border)]'
      }`}
      aria-labelledby={`post-title-${post.id}`}
    >
      {/* Top Ledger Header: Channel & Author Metadata */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Author Initial Monogram */}
          <div 
            className="w-9 h-9 rounded-sm bg-[var(--color-bone)] border border-[var(--color-border)] text-[#1C1A17] flex items-center justify-center font-mono font-bold text-xs shrink-0 select-none"
            aria-hidden="true"
          >
            {authorInitial}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--color-ink)] truncate uppercase">
                {authorDisplay}
              </span>
              {isCurrentUser && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[var(--color-marigold)]/15 text-[var(--color-accent-text)] rounded-sm font-bold">
                  AUTHOR
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-[var(--color-ink-soft)] font-mono mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(post.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {displayLocation && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3 h-3 text-[var(--color-ink-soft)]" />
                    {displayLocation}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tactile Indelible Rubber Stamp */}
        <div className="shrink-0">
          <LedgerStatusStamp state={stampState} size="sm" jitter={isLostFound ? -1.5 : 1.2} />
        </div>
      </div>

      {/* Post Title & Content */}
      <div className="mb-4">
        <h3 
          id={`post-title-${post.id}`}
          className="text-lg sm:text-xl font-serif font-bold text-[var(--color-ink)] tracking-tight hover:text-[var(--color-accent-text)] transition-colors leading-snug"
        >
          <Link to={`/community/post/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-[var(--color-ink)]/85 leading-relaxed mt-2 line-clamp-3 font-sans">
          {post.content}
        </p>
      </div>

      {/* Incident Cross-Reference Banner (If Connected to an Alert) */}
      {post.associated_alert_id && (
        <div className="mb-4 p-3 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldAlert className="w-4 h-4 text-[var(--color-alert-clay)] shrink-0" />
            <div className="text-xs truncate font-mono">
              <span className="text-[var(--color-ink-soft)] uppercase">Linked Incident: </span>
              <span className="font-bold text-[var(--color-ink)]">
                {post.pet_name ? `Case: ${post.pet_name}` : `Dossier #${post.associated_alert_id.slice(0, 8).toUpperCase()}`}
              </span>
            </div>
          </div>
          <Link
            to={`/alerts/${post.associated_alert_id}`}
            className="min-h-[48px] sm:min-h-[44px] px-3 inline-flex items-center gap-1 text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-alert-clay)] hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            <span>Incident Command</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Bottom Ledger Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs font-mono text-[var(--color-ink-soft)]">
        <Link 
          to={`/community/post/${post.id}`}
          className="min-h-[48px] sm:min-h-[44px] inline-flex items-center gap-1.5 text-[var(--color-ink)] hover:text-[var(--color-accent-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="font-bold tracking-wider uppercase">
            {post.reply_count !== undefined && post.reply_count > 0 
              ? `${post.reply_count} Replies` 
              : 'Join Discussion'}
          </span>
        </Link>

        <Link
          to={`/community/post/${post.id}`}
          className="min-h-[48px] sm:min-h-[44px] inline-flex items-center gap-1 font-bold tracking-wider uppercase text-[var(--color-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
        >
          <span>View Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
