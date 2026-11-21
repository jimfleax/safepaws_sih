import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, AlertTriangle, Eye, Clock, Shield } from 'lucide-react';

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
    <div className={`p-4 rounded-xl border transition-shadow shadow-sm hover:shadow-md bg-[var(--color-surface)] animate-in slide-in-from-bottom-4 fade-in duration-300 ${
      isUrgent ? 'border-red-500/30' : 
      isSighting ? 'border-blue-500/30' : 
      isLost ? 'border-amber-500/30' : 
      'border-[var(--color-border)]'
    }`}>
      {/* Header Context */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs">
            {getInitials(post.author_name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--color-ink)]">{post.author_name}</span>
              {isUrgent && <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-600 flex items-center gap-1"><Shield size={10} /> Urgent</span>}
            </div>
            <span className="text-[11px] text-[var(--color-ink-soft)] flex items-center gap-1">
              <Clock size={10} />
              {new Date(post.created_at).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link to={`/community/post/${post.id}`} className="block mt-3 mb-3 group">
        {post.title && <h3 className="text-base font-bold text-[var(--color-ink)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">{post.title}</h3>}
        
        {/* Prominent Contexts */}
        {(isSighting && post.location) && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1.5 rounded-md mb-2">
            <MapPin size={14} /> {post.location}
          </div>
        )}
        
        {(isLost && post.pet_name) && (
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-50 px-2 py-1.5 rounded-md mb-2">
            <AlertTriangle size={14} /> Looking for {post.pet_name}
          </div>
        )}

        <p className="text-sm text-[var(--color-ink)]/90 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </Link>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-2">
        <Link to={`/community/post/${post.id}`} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors">
          <MessageSquare size={14} />
          {post.reply_count || 0} Replies
        </Link>
        
        {post.associated_alert_id && (
           <Link to={`/alerts/${post.associated_alert_id}`} className="flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:underline">
             <AlertTriangle size={12} /> View Alert
           </Link>
        )}
      </div>
    </div>
  );
}
