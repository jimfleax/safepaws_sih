import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, AlertTriangle, Clock, Shield } from 'lucide-react';

export type Post = {
  id: string;
  title: string;
  content: string;
  channel: string;
  author_name: string;
  created_at: string;
  reply_count?: number;
  associated_alert_id?: string | null;
  location?: string | null;
  pet_name?: string | null;
};

export function PostCard({ post }: { post: Post; key?: React.Key }) {
  const isUrgent = post.channel === 'urgent';
  const isSighting = post.channel === 'sightings';
  const isLost = post.channel === 'lost-found';
  
  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xs hover:shadow-md bg-white ${
      isUrgent ? 'border-[var(--color-alert-clay)]/40 bg-[var(--color-alert-clay)]/[0.02]' : 
      isSighting ? 'border-emerald-500/30' : 
      isLost ? 'border-[var(--color-marigold)]/30' : 
      'border-[var(--color-border)]'
    }`}>
      {/* Header Context */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] flex items-center justify-center font-bold text-xs uppercase font-mono">
            {getInitials(post.author_name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--color-ink)]">{post.author_name}</span>
              {isUrgent && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] flex items-center gap-1">
                  <Shield size={10} /> Urgent
                </span>
              )}
            </div>
            <span className="text-[11px] text-[var(--color-ink-soft)] font-light flex items-center gap-1 mt-0.5">
              <Clock size={10} />
              {new Date(post.created_at).toLocaleString(undefined, { 
                hour: 'numeric', 
                minute: 'numeric', 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link to={`/community/post/${post.id}`} className="block mt-3 mb-3 group">
        {post.title && (
          <h3 className="text-base font-serif font-bold text-[var(--color-ink)] mb-1 group-hover:text-[var(--color-marigold)] transition-colors leading-snug">
            {post.title}
          </h3>
        )}
        
        {/* Prominent Context Badges */}
        {(isSighting && post.location) && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg mb-2 w-fit">
            <MapPin size={13} /> <span>Reported near: {post.location}</span>
          </div>
        )}
        
        {(isLost && post.pet_name) && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-alert-clay)] bg-[var(--color-alert-clay)]/10 px-3 py-1.5 rounded-lg mb-2 w-fit">
            <AlertTriangle size={13} /> <span>Searching for {post.pet_name}</span>
          </div>
        )}

        <p className="text-xs text-[var(--color-ink)]/80 line-clamp-3 leading-relaxed font-light">
          {post.content}
        </p>
      </Link>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-2">
        <Link 
          to={`/community/post/${post.id}`} 
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[36px] py-1"
        >
          <MessageSquare size={14} />
          <span>{post.reply_count || 0} Replies</span>
        </Link>
        
        {post.associated_alert_id && (
           <Link 
             to={`/alerts/${post.associated_alert_id}`} 
             className="flex items-center gap-1 text-[11px] font-mono font-bold text-[var(--color-alert-clay)] hover:underline uppercase tracking-wider min-h-[36px] py-1"
           >
             <AlertTriangle size={12} /> 
             <span>View Emergency Incident</span>
           </Link>
        )}
      </div>
    </div>
  );
}