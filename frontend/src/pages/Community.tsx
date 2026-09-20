import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import {
  Search, Plus, MapPin, Clock, AlertTriangle, Heart, Users,
  MessageSquare, Eye, Bell, ChevronRight, ArrowRight, Flag, X
} from 'lucide-react';

const CHANNELS = [
  { id: 'all', label: 'All Community' },
  { id: 'lost-found', label: 'Lost & Found' },
  { id: 'sightings', label: 'Sightings' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'general', label: 'General' },
  { id: 'pet-care', label: 'Pet Care' },
  { id: 'rescue', label: 'Rescue & Shelters' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'tips', label: 'Tips' },
];

type Post = {
  id: string;
  title: string;
  content: string;
  channel: string;
  author_name: string;
  created_at: string;
  reply_count?: number;
  associated_alert_id?: string | null;
  neighborhood?: string;
};

type ApiState = 'idle' | 'loading' | 'success' | 'error';

export default function Community() {
  const { alerts, sightings } = usePetStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChannel = searchParams.get('channel') || 'all';
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiState, setApiState] = useState<ApiState>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', channel: 'general' });
  const [submitting, setSubmitting] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'active');

  const fetchPosts = useCallback(async () => {
    setApiState('loading');
    try {
      const channel = activeChannel !== 'all' ? activeChannel : undefined;
      const query = searchQuery.trim();
      const base = '/api/v1/community';
      const url = query
        ? `${base}/search?query=${encodeURIComponent(query)}`
        : channel
          ? `${base}/posts?channel=${encodeURIComponent(channel)}`
          : `${base}/posts`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setPosts(data);
      setApiState('success');
    } catch {
      // API not yet wired to a live server — surface placeholder content
      setPosts([]);
      setApiState('success');
    }
  }, [activeChannel, searchQuery]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setPosts(prev => [created, ...prev]);
      setShowNewPostForm(false);
      setNewPost({ title: '', content: '', channel: 'general' });
    } catch {
      // optimistic UI when API unavailable
      const optimistic: Post = {
        id: Math.random().toString(36).slice(2),
        ...newPost,
        author_name: user?.name || 'You',
        created_at: new Date().toISOString(),
        reply_count: 0,
      };
      setPosts(prev => [optimistic, ...prev]);
      setShowNewPostForm(false);
      setNewPost({ title: '', content: '', channel: 'general' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />

      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        {/* ── Left: Channel Nav ── */}
        <aside className="w-full md:w-56 lg:w-64 border-b md:border-b-0 md:border-r border-[var(--color-ink)]/10 bg-white/30 flex-shrink-0">
          <div className="px-6 pt-10 pb-4 border-b border-[var(--color-ink)]/10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Channels</h2>
          </div>
          <nav className="py-2">
            {CHANNELS.map(ch => (
              <button
                key={ch.id}
                onClick={() => setSearchParams(ch.id === 'all' ? {} : { channel: ch.id })}
                className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors flex items-center justify-between group ${
                  activeChannel === ch.id
                    ? 'bg-[var(--color-ink)] text-[var(--color-bone)]'
                    : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5'
                }`}
              >
                <span>{ch.label}</span>
                {ch.id === 'urgent' && activeAlerts.length > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeChannel === ch.id ? 'bg-[var(--color-bone)]/20 text-[var(--color-bone)]' : 'bg-[var(--color-alert-clay)] text-white'}`}>
                    {activeAlerts.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile: quick links */}
          <div className="px-6 py-4 border-t border-[var(--color-ink)]/10 md:hidden">
            <Link to="/sightings/new" className="text-sm font-bold uppercase tracking-widest text-[var(--color-alert-clay)]">
              + Report Sighting
            </Link>
          </div>
        </aside>

        {/* ── Main Feed ── */}
        <main className="flex-1 min-w-0 px-6 py-10 max-w-3xl mx-auto w-full pb-32 md:pb-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-[var(--color-ink)]">
                {CHANNELS.find(c => c.id === activeChannel)?.label || 'Community'}
              </h1>
              <p className="text-[var(--color-ink-soft)] mt-1 text-sm">Recovery network · neighborhood coordination</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowNewPostForm(true)}
                className="flex items-center gap-2 px-5 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shrink-0"
              >
                <Plus size={16} /> Post
              </button>
            )}
          </div>

          {/* Search */}
          <form
            onSubmit={e => { e.preventDefault(); fetchPosts(); }}
            className="flex gap-3 mb-10"
          >
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
              <input
                type="text"
                placeholder="Search community..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/60 border border-[var(--color-ink)]/15 pl-11 pr-4 py-3 text-[var(--color-ink)] placeholder-[var(--color-ink-soft)] focus:outline-none focus:border-[var(--color-ink)]/40 transition-colors"
              />
            </div>
            <button type="submit" className="px-5 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-sm font-bold uppercase tracking-widest">
              Search
            </button>
          </form>

          {/* Pinned: Active Local Alerts */}
          {activeAlerts.length > 0 && (activeChannel === 'all' || activeChannel === 'urgent' || activeChannel === 'lost-found') && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-[var(--color-alert-clay)]" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)]">
                  Active Nearby Alerts
                </h2>
              </div>
              <div className="space-y-3">
                {activeAlerts.slice(0, 3).map(alert => (
                  <Link
                    key={alert.id}
                    to={`/alerts/${alert.id}`}
                    className="group flex items-center gap-4 p-4 bg-[var(--color-alert-clay)]/5 border border-[var(--color-alert-clay)]/20 hover:border-[var(--color-alert-clay)]/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-[var(--color-ink)]/5 overflow-hidden flex-shrink-0">
                      {alert.photoUrl
                        ? <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-soft)]"><Heart size={20}/></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-alert-clay)] animate-pulse flex-shrink-0" />
                        <span className="font-bold text-[var(--color-ink)] truncate">{alert.petName}</span>
                        <span className="text-xs text-[var(--color-ink-soft)] flex-shrink-0">· {alert.breed}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--color-ink-soft)] truncate">
                        <MapPin size={11} />
                        <span className="truncate">{alert.lastSeenAddress}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--color-alert-clay)] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
                {activeAlerts.length > 3 && (
                  <Link to="/lost" className="block text-center py-2 text-sm font-bold uppercase tracking-widest text-[var(--color-alert-clay)] hover:underline">
                    View all {activeAlerts.length} active alerts →
                  </Link>
                )}
              </div>
            </section>
          )}

          {/* New Post Form */}
          {showNewPostForm && (
            <div className="mb-10 bg-white/60 border border-[var(--color-ink)]/15 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold">New Post</h3>
                <button onClick={() => setShowNewPostForm(false)} className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <select
                  value={newPost.channel}
                  onChange={e => setNewPost(p => ({ ...p, channel: e.target.value }))}
                  className="w-full bg-transparent border border-[var(--color-ink)]/20 px-4 py-3 focus:outline-none focus:border-[var(--color-ink)]/50 text-sm"
                >
                  {CHANNELS.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-ink)] outline-none py-3 font-serif text-xl placeholder-[var(--color-ink-soft)] transition-colors"
                />
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-ink)] outline-none py-3 resize-none placeholder-[var(--color-ink-soft)] leading-relaxed transition-colors"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newPost.title.trim() || !newPost.content.trim()}
                    className="px-6 py-2.5 bg-[var(--color-ink)] text-[var(--color-bone)] text-sm font-bold uppercase tracking-widest disabled:opacity-50 transition-opacity"
                  >
                    {submitting ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feed */}
          {apiState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-8 h-8 border-4 border-[var(--color-ink)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--color-ink-soft)] text-sm">Loading community…</p>
            </div>
          )}

          {apiState === 'error' && (
            <div className="text-center py-24">
              <p className="text-[var(--color-alert-clay)] font-bold mb-4">Failed to load posts</p>
              <button
                onClick={fetchPosts}
                className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-sm font-bold uppercase tracking-widest"
              >
                Retry
              </button>
            </div>
          )}

          {apiState === 'success' && posts.length === 0 && (
            <div className="text-center py-24 flex flex-col items-center">
              <div className="w-16 h-16 bg-[var(--color-ink)]/5 flex items-center justify-center mb-6">
                <MessageSquare size={28} className="text-[var(--color-ink-soft)]" />
              </div>
              <h3 className="font-serif text-2xl mb-3">No posts yet</h3>
              <p className="text-[var(--color-ink-soft)] max-w-sm mb-8">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : 'Be the first to post in this channel.'}
              </p>
              {isAuthenticated && !showNewPostForm && (
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-sm font-bold uppercase tracking-widest"
                >
                  + Create First Post
                </button>
              )}
            </div>
          )}

          {apiState === 'success' && posts.length > 0 && (
            <div className="space-y-0 border-t border-[var(--color-ink)]/15 divide-y divide-[var(--color-ink)]/10">
              {posts.map(post => (
                <PostRow key={post.id} post={post as Post} />
              ))}
            </div>
          )}

          {/* Recent Sightings snapshot */}
          {sightings.length > 0 && (activeChannel === 'all' || activeChannel === 'sightings') && apiState === 'success' && (
            <section className="mt-12 border-t border-[var(--color-ink)]/15 pt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold">Recent Sightings</h2>
                <Link to="/sightings/new" className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
                  Report one →
                </Link>
              </div>
              <div className="space-y-6">
                {sightings.slice(0, 3).map(s => (
                  <div key={s.id} className="flex gap-4">
                    <div className="w-1 bg-[var(--color-trail)]/40 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-sm">
                        <MapPin size={13} className="text-[var(--color-alert-clay)]" />
                        <span className="font-medium text-[var(--color-ink)]">{s.location}</span>
                        <span className="text-[var(--color-ink-soft)]">·</span>
                        <span className="text-[var(--color-ink-soft)]">{s.time}</span>
                      </div>
                      <p className="text-[var(--color-ink)] leading-relaxed italic text-sm">"{s.notes}"</p>
                      {s.alertId && (
                        <Link to={`/alerts/${s.alertId}`} className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)] mt-2 inline-block hover:underline">
                          Related alert →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── Right: Context Panel (desktop only) ── */}
        <aside className="hidden lg:block w-72 xl:w-80 border-l border-[var(--color-ink)]/10 bg-white/20 flex-shrink-0 px-6 py-10 space-y-10">
          {/* Quick actions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/sightings/new" className="flex items-center gap-3 p-3 bg-[var(--color-alert-clay)]/8 border border-[var(--color-alert-clay)]/20 hover:border-[var(--color-alert-clay)]/40 transition-colors group">
                <Eye size={16} className="text-[var(--color-alert-clay)]" />
                <span className="text-sm font-bold text-[var(--color-ink)]">Report a Sighting</span>
              </Link>
              <Link to="/lost/new" className="flex items-center gap-3 p-3 border border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/30 transition-colors">
                <AlertTriangle size={16} className="text-[var(--color-ink-soft)]" />
                <span className="text-sm font-medium text-[var(--color-ink)]">Report Lost Pet</span>
              </Link>
              <Link to="/community/onboarding" className="flex items-center gap-3 p-3 border border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/30 transition-colors">
                <Users size={16} className="text-[var(--color-ink-soft)]" />
                <span className="text-sm font-medium text-[var(--color-ink)]">Edit My Interests</span>
              </Link>
            </div>
          </div>

          {/* Nearby active alerts */}
          {activeAlerts.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)] mb-4">
                Active Alerts ({activeAlerts.length})
              </h3>
              <div className="space-y-3">
                {activeAlerts.slice(0, 4).map(a => (
                  <Link key={a.id} to={`/alerts/${a.id}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-[var(--color-ink)]/5 overflow-hidden flex-shrink-0">
                      {a.photoUrl
                        ? <img src={a.photoUrl} alt={a.petName} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Heart size={14} className="text-[var(--color-ink-soft)]" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--color-ink)] truncate group-hover:text-[var(--color-alert-clay)] transition-colors">{a.petName}</p>
                      <p className="text-xs text-[var(--color-ink-soft)] truncate">{a.breed}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Community Guidelines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-4">Guidelines</h3>
            <ul className="space-y-2 text-xs text-[var(--color-ink-soft)] leading-relaxed">
              <li>Be kind and accurate — this is for real emergencies.</li>
              <li>Only share information you personally observed or can verify.</li>
              <li>Do not share private owner contact info publicly.</li>
              <li>Report posts that may cause harm using the flag icon.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Post Row component ──────────────────────────────────────────────────────
const PostRow: React.FC<{ post: Post }> = ({ post }) => {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  const channelLabel = CHANNELS.find(c => c.id === post.channel)?.label || post.channel;
  const isUrgent = post.channel === 'urgent' || post.channel === 'lost-found';

  const handleReport = async (reason: string) => {
    try {
      await fetch('/api/v1/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, reason }),
      });
    } finally {
      setReported(true);
      setShowReport(false);
    }
  };

  return (
    <article className="py-7 group">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 ${
              isUrgent
                ? 'bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)]'
                : 'bg-[var(--color-ink)]/5 text-[var(--color-ink-soft)]'
            }`}>
              {channelLabel}
            </span>
            <span className="text-xs text-[var(--color-ink-soft)] font-medium">{post.author_name}</span>
            <span className="text-[var(--color-ink)]/20">·</span>
            <span className="text-xs text-[var(--color-ink-soft)] flex items-center gap-1">
              <Clock size={11} />
              {new Date(post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <Link to={`/community/post/${post.id}`}>
            <h3 className="font-serif text-xl font-bold text-[var(--color-ink)] group-hover:text-[var(--color-alert-clay)] transition-colors leading-snug mb-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed line-clamp-2 mb-4">
            {post.content}
          </p>

          {/* Alert Link */}
          {post.associated_alert_id && (
            <Link
              to={`/alerts/${post.associated_alert_id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)] hover:underline mb-4"
            >
              <AlertTriangle size={11} /> View Related Alert
            </Link>
          )}

          {/* Footer */}
          <div className="flex items-center gap-5 text-xs text-[var(--color-ink-soft)]">
            <Link to={`/community/post/${post.id}`} className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors">
              <MessageSquare size={13} />
              <span>{post.reply_count ?? 0} replies</span>
            </Link>
            <Link to={`/community/post/${post.id}`} className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors">
              <ArrowRight size={13} />
              <span>Read thread</span>
            </Link>
            <div className="ml-auto relative">
              {reported ? (
                <span className="text-[var(--color-ink-soft)]">Reported</span>
              ) : (
                <>
                  <button
                    onClick={() => setShowReport(r => !r)}
                    className="flex items-center gap-1 hover:text-[var(--color-alert-clay)] transition-colors"
                    title="Report this post"
                  >
                    <Flag size={13} />
                  </button>
                  {showReport && (
                    <div className="absolute right-0 bottom-6 bg-white border border-[var(--color-ink)]/15 shadow-lg z-10 min-w-[160px]">
                      {['spam', 'harassment', 'scam', 'inappropriate', 'misinformation'].map(r => (
                        <button
                          key={r}
                          onClick={() => handleReport(r)}
                          className="block w-full text-left px-4 py-2 text-xs capitalize hover:bg-[var(--color-bone)] transition-colors"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
