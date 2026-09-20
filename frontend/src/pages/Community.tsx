import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { ApiClient } from '../utils/apiClient';
import {
  Search, Plus, MapPin, Clock, AlertTriangle, Heart, Users,
  MessageSquare, Eye, Bell, ChevronRight, ArrowRight, Flag, X, Menu, SlidersHorizontal
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

const SEARCH_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'lost', label: 'Lost' },
  { id: 'sightings', label: 'Sightings' },
  { id: 'discussions', label: 'Discussions' },
  { id: 'urgent', label: 'Urgent' }
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
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', channel: 'general' });
  const [submitting, setSubmitting] = useState(false);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'active');

  const fetchPosts = useCallback(async () => {
    setApiState('loading');
    try {
      const channel = activeChannel !== 'all' ? activeChannel : undefined;
      const query = searchQuery.trim();
      let data = await ApiClient.getCommunityPosts(channel, query);
      
      // Client-side mapping for requested mock filters (if no native backend support yet)
      if (activeFilter === 'urgent') data = data.filter((p: Post) => p.channel === 'urgent' || p.channel === 'lost-found');
      if (activeFilter === 'sightings') data = data.filter((p: Post) => p.channel === 'sightings');
      
      setPosts(data);
      setApiState('success');
    } catch {
      setPosts([]);
      setApiState('success');
    }
  }, [activeChannel, searchQuery, activeFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/'); return; }
    setSubmitting(true);
    try {
      const created = await ApiClient.createCommunityPost(newPost);
      setPosts(prev => [created, ...prev]);
      setShowNewPostForm(false);
      setNewPost({ title: '', content: '', channel: 'general' });
    } catch {
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
      {/* Global Dashboard Navigation */}
      <div className="md:w-64 lg:w-72 flex-shrink-0 border-r border-[var(--color-ink)]/15">
        <DashboardNav />
      </div>

      {/* Community Operating System Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* ── Mobile OS Header ── */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-[var(--color-ink)]/15 bg-[var(--color-bone)] z-30">
          <button 
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 -ml-2 text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif font-bold text-lg">Community</span>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 -mr-2 text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-alert-clay)] rounded-full border border-[var(--color-bone)]"></span>
          </button>
        </header>

        {/* ── OS Three-Pane Layout ── */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* 1. Left Navigation (Desktop) */}
          <aside className="hidden md:flex w-56 lg:w-64 border-r border-[var(--color-ink)]/15 bg-white/40 flex-col flex-shrink-0 h-full overflow-y-auto">
            <div className="px-6 pt-10 pb-4 border-b border-[var(--color-ink)]/15 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Channels</h2>
            </div>
            <nav className="py-2 flex-1">
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
                  <span className="truncate">{ch.label}</span>
                  {ch.id === 'urgent' && activeAlerts.length > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 ml-2 ${activeChannel === ch.id ? 'bg-[var(--color-bone)]/20 text-[var(--color-bone)]' : 'bg-[var(--color-alert-clay)] text-white'}`}>
                      {activeAlerts.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="p-6 border-t border-[var(--color-ink)]/15">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="flex items-center justify-between w-full p-3 border border-[var(--color-ink)]/15 hover:bg-[var(--color-ink)]/5 transition-colors group"
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Bell size={16} className="text-[var(--color-ink-soft)] group-hover:text-[var(--color-ink)]" />
                  <span>Notifications</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)]" />
              </button>
            </div>
          </aside>

          {/* 2. Center Feed */}
          <main className="flex-1 flex flex-col min-w-0 h-full bg-[var(--color-bone)] overflow-y-auto relative">
            <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12 flex-1">
              
              {/* Header & New Post Action */}
              <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-ink)]">
                    {CHANNELS.find(c => c.id === activeChannel)?.label || 'Community'}
                  </h1>
                  <p className="text-[var(--color-ink-soft)] mt-2 text-sm font-medium tracking-wide">
                    Neighborhood recovery network
                  </p>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowNewPostForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-ink)]/90 transition-colors shrink-0"
                  >
                    <Plus size={14} /> New Post
                  </button>
                )}
              </div>

              {/* Advanced Search & Filtering */}
              <div className="mb-10 space-y-4">
                <form onSubmit={e => { e.preventDefault(); fetchPosts(); }} className="flex gap-2 h-12">
                  <div className="flex-1 relative h-full">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                    <input
                      type="text"
                      placeholder="Search community activity..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full h-full bg-white/70 border border-[var(--color-ink)]/15 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--color-ink)]/40 transition-colors"
                    />
                  </div>
                  <button type="submit" className="h-full px-6 bg-[var(--color-ink)] text-[var(--color-bone)] text-xs font-bold uppercase tracking-widest hidden sm:block">
                    Search
                  </button>
                </form>
                
                {/* Segmented Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <SlidersHorizontal size={14} className="text-[var(--color-ink-soft)] shrink-0 mr-2" />
                  {SEARCH_FILTERS.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-colors ${
                        activeFilter === filter.id 
                          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bone)]'
                          : 'border-[var(--color-ink)]/15 text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Post Interface */}
              {showNewPostForm && (
                <div className="mb-12 bg-white border border-[var(--color-ink)]/20 shadow-sm relative overflow-hidden">
                  <div className="h-1 w-full bg-[var(--color-ink)] absolute top-0 left-0" />
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-2xl font-bold">Create Post</h3>
                      <button onClick={() => setShowNewPostForm(false)} className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 rounded-full transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleSubmitPost} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Channel</label>
                        <select
                          value={newPost.channel}
                          onChange={e => setNewPost(p => ({ ...p, channel: e.target.value }))}
                          className="w-full bg-transparent border border-[var(--color-ink)]/15 px-4 py-3 focus:outline-none focus:border-[var(--color-ink)] text-sm"
                        >
                          {CHANNELS.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Title</label>
                        <input
                          type="text"
                          placeholder="What do you need to share?"
                          value={newPost.title}
                          onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                          required
                          className="w-full bg-transparent border border-[var(--color-ink)]/15 focus:border-[var(--color-ink)] outline-none px-4 py-3 font-serif text-xl placeholder-[var(--color-ink-soft)] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Details</label>
                        <textarea
                          placeholder="Provide descriptive details, cross streets, or helpful context."
                          value={newPost.content}
                          onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                          required
                          rows={4}
                          className="w-full bg-transparent border border-[var(--color-ink)]/15 focus:border-[var(--color-ink)] outline-none px-4 py-3 resize-none placeholder-[var(--color-ink-soft)] text-sm leading-relaxed transition-colors"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={submitting || !newPost.title.trim() || !newPost.content.trim()}
                          className="px-8 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-sm font-bold uppercase tracking-widest disabled:opacity-50 transition-opacity"
                        >
                          {submitting ? 'Posting…' : 'Publish'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Feed Content */}
              <div className="space-y-6">
                {apiState === 'loading' && (
                  <div className="py-24 flex flex-col items-center justify-center border border-[var(--color-ink)]/10 bg-white/20">
                    <div className="w-6 h-6 border-2 border-[var(--color-ink)] border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Syncing network</span>
                  </div>
                )}

                {apiState === 'error' && (
                  <div className="py-24 border border-[var(--color-ink)]/10 bg-white/20 text-center px-4">
                    <p className="text-[var(--color-alert-clay)] font-serif text-xl font-bold mb-4">Connection Lost</p>
                    <button onClick={fetchPosts} className="px-6 py-2.5 border border-[var(--color-ink)] text-sm font-bold uppercase tracking-widest hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] transition-colors">
                      Retry Connection
                    </button>
                  </div>
                )}

                {apiState === 'success' && posts.length === 0 && (
                  <div className="py-24 border border-[var(--color-ink)]/15 bg-white/40 text-center px-6 flex flex-col items-center justify-center">
                    <Users size={32} className="text-[var(--color-ink-soft)] mb-6" />
                    <h3 className="font-serif text-2xl font-bold mb-3">Your neighborhood recovery network starts here.</h3>
                    <p className="text-[var(--color-ink-soft)] text-sm max-w-md mx-auto mb-8 leading-relaxed">
                      {searchQuery || activeFilter !== 'all'
                        ? "No activity matches these filters right now."
                        : "There are no active posts in this channel yet. Be the first to share local information or request help."}
                    </p>
                    {isAuthenticated && !showNewPostForm && !searchQuery && (
                      <button
                        onClick={() => setShowNewPostForm(true)}
                        className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Start a Discussion
                      </button>
                    )}
                  </div>
                )}

                {apiState === 'success' && posts.map(post => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
              
              {/* Bottom padding for mobile scrolling */}
              <div className="h-24 md:h-12" />
            </div>
          </main>

          {/* 3. Right Context Panel (Desktop) */}
          <aside className="hidden lg:flex w-80 xl:w-96 border-l border-[var(--color-ink)]/15 bg-white/40 flex-col h-full overflow-y-auto">
            <div className="p-8 space-y-10">
              
              {/* Quick Launch */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-4">Coordination Actions</h3>
                <div className="space-y-2">
                  <Link to="/sightings/new" className="flex items-center gap-3 p-4 bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/30 hover:border-[var(--color-alert-clay)] transition-colors group">
                    <Eye size={18} className="text-[var(--color-alert-clay)]" />
                    <span className="text-sm font-bold text-[var(--color-ink)]">Report a Sighting</span>
                  </Link>
                  <Link to="/lost/new" className="flex items-center gap-3 p-4 bg-white border border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/50 transition-colors">
                    <AlertTriangle size={18} className="text-[var(--color-ink-soft)]" />
                    <span className="text-sm font-bold text-[var(--color-ink)]">Declare Lost Pet</span>
                  </Link>
                  <Link to="/community/onboarding" className="flex items-center gap-3 p-4 bg-white border border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/50 transition-colors">
                    <Users size={18} className="text-[var(--color-ink-soft)]" />
                    <span className="text-sm font-bold text-[var(--color-ink)]">Configure Member Identity</span>
                  </Link>
                </div>
              </section>

              {/* Local Active Alerts */}
              {activeAlerts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-alert-clay)]">
                      Active Local Alerts
                    </h3>
                    <span className="text-[10px] font-bold bg-[var(--color-alert-clay)] text-white px-2 py-0.5">{activeAlerts.length}</span>
                  </div>
                  <div className="space-y-3">
                    {activeAlerts.slice(0, 4).map(a => (
                      <Link key={a.id} to={`/alerts/${a.id}`} className="block p-4 bg-white border border-[var(--color-ink)]/15 hover:border-[var(--color-alert-clay)] transition-colors group">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-[var(--color-ink)]/5 flex-shrink-0 border border-[var(--color-ink)]/10">
                            {a.photoUrl
                              ? <img src={a.photoUrl} alt={a.petName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                              : <div className="w-full h-full flex items-center justify-center"><Heart size={16} className="text-[var(--color-ink-soft)]" /></div>
                            }
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-sm font-bold text-[var(--color-ink)] truncate group-hover:text-[var(--color-alert-clay)] transition-colors">{a.petName}</p>
                            <p className="text-[11px] text-[var(--color-ink-soft)] truncate mt-0.5">{a.breed} · {a.lastSeenAddress}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {activeAlerts.length > 4 && (
                      <Link to="/lost" className="block text-center pt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                        View all tracking boards →
                      </Link>
                    )}
                  </div>
                </section>
              )}

              {/* Operational Guidelines */}
              <section className="bg-[var(--color-ink)]/5 p-5 border border-[var(--color-ink)]/15">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] mb-3">System Guidelines</h3>
                <ul className="space-y-3 text-xs text-[var(--color-ink-soft)] leading-relaxed">
                  <li className="flex gap-2"><span className="text-[var(--color-ink)] font-bold">1.</span> Verify information before coordinating search parties.</li>
                  <li className="flex gap-2"><span className="text-[var(--color-ink)] font-bold">2.</span> Protect private contact data; use SafePaws relays.</li>
                  <li className="flex gap-2"><span className="text-[var(--color-ink)] font-bold">3.</span> Report bad actors immediately via the flag interface.</li>
                </ul>
              </section>
              
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile OS Drawer ── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-[var(--color-ink)]/50 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[var(--color-bone)] h-full flex flex-col border-r border-[var(--color-ink)]/20 shadow-2xl">
            <div className="p-4 border-b border-[var(--color-ink)]/15 flex items-center justify-between">
              <span className="font-serif font-bold text-lg">Menu</span>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 text-[var(--color-ink)]"><X size={20}/></button>
            </div>
            <nav className="py-2 flex-1 overflow-y-auto">
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSearchParams(ch.id === 'all' ? {} : { channel: ch.id });
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-6 py-4 text-sm font-medium transition-colors flex items-center justify-between border-b border-[var(--color-ink)]/5 ${
                    activeChannel === ch.id
                      ? 'bg-[var(--color-ink)] text-[var(--color-bone)]'
                      : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5'
                  }`}
                >
                  <span>{ch.label}</span>
                  {ch.id === 'urgent' && activeAlerts.length > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 ${activeChannel === ch.id ? 'bg-[var(--color-bone)]/20 text-[var(--color-bone)]' : 'bg-[var(--color-alert-clay)] text-white'}`}>
                      {activeAlerts.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-[var(--color-ink)]/15 bg-white">
              <Link to="/sightings/new" onClick={() => setIsMobileDrawerOpen(false)} className="flex items-center justify-center w-full py-3 bg-[var(--color-alert-clay)] text-white text-xs font-bold uppercase tracking-widest">
                Report Sighting
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Notification Center Sheet ── */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-transparent" onClick={() => setIsNotificationsOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full border-l border-[var(--color-ink)]/20 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-6 border-b border-[var(--color-ink)]/15 flex items-center justify-between bg-[var(--color-bone)]">
              <h2 className="font-serif text-2xl font-bold">Inbox</h2>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-2 -mr-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white">
              <NotificationList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Notification List Component ─────────────────────────────────────────────
const NotificationList = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await ApiClient.getCommunityNotifications();
        setNotifications(data);
      } catch (e) {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await ApiClient.markNotificationRead(id);
    } catch (e) {}
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-[var(--color-ink-soft)]">Syncing inbox...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-full">
        <Bell size={32} className="text-[var(--color-ink)]/20 mb-4" />
        <p className="text-sm font-bold text-[var(--color-ink)] mb-2">No new alerts</p>
        <p className="text-xs text-[var(--color-ink-soft)] max-w-[200px] leading-relaxed">
          When a neighbor replies to your post or updates a recovery task, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--color-ink)]/10">
      {notifications.map(n => (
        <div key={n.id} onClick={() => markRead(n.id)} className={`p-4 cursor-pointer transition-colors ${n.read ? 'bg-white opacity-60' : 'bg-[var(--color-bone)]/30 hover:bg-[var(--color-bone)]'}`}>
          <div className="flex items-start gap-3">
            {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--color-alert-clay)] mt-1.5 shrink-0" />}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1">{n.title}</p>
              <p className="text-sm text-[var(--color-ink)]/90">{n.content}</p>
              <p className="text-[10px] font-mono text-[var(--color-ink-soft)] mt-2">
                {new Date(n.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Post Row Component ──────────────────────────────────────────────────────
const PostRow: React.FC<{ post: Post }> = ({ post }) => {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  const channelLabel = CHANNELS.find(c => c.id === post.channel)?.label || post.channel;
  const isUrgent = post.channel === 'urgent' || post.channel === 'lost-found';

  const handleReport = async (reason: string) => {
    try {
      await ApiClient.reportContent(reason, post.id);
    } finally {
      setReported(true);
      setShowReport(false);
    }
  };

  return (
    <article className="bg-white border border-[var(--color-ink)]/15 p-6 sm:p-8 hover:border-[var(--color-ink)]/40 transition-colors group relative">
      {isUrgent && (
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-alert-clay)]" />
      )}
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 min-w-0">
          
          {/* Metadata */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${
              isUrgent
                ? 'bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border-[var(--color-alert-clay)]/20'
                : 'bg-[var(--color-bone)] text-[var(--color-ink-soft)] border-[var(--color-ink)]/15'
            }`}>
              {channelLabel}
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)]">
              <div className="w-5 h-5 bg-[var(--color-ink)]/10 rounded-full flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden">
                {post.author_name.charAt(0)}
              </div>
              <span>{post.author_name}</span>
            </div>
            <span className="text-[var(--color-ink)]/20">·</span>
            <span className="text-[11px] text-[var(--color-ink-soft)] font-mono flex items-center gap-1.5">
              <Clock size={12} />
              {new Date(post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Core Content */}
          <Link to={`/community/post/${post.id}`} className="block mb-4">
            <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] group-hover:text-[var(--color-alert-clay)] transition-colors leading-tight mb-3">
              {post.title}
            </h3>
            <p className="text-sm text-[var(--color-ink)]/80 leading-relaxed line-clamp-3">
              {post.content}
            </p>
          </Link>

          {/* Integrated Alert Box */}
          {post.associated_alert_id && (
            <div className="mb-5 inline-block">
              <Link
                to={`/alerts/${post.associated_alert_id}`}
                className="flex items-center gap-3 p-3 bg-[var(--color-alert-clay)]/5 border border-[var(--color-alert-clay)]/30 hover:bg-[var(--color-alert-clay)]/10 transition-colors"
              >
                <AlertTriangle size={16} className="text-[var(--color-alert-clay)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Attached Recovery Alert
                </span>
                <ChevronRight size={14} className="text-[var(--color-ink-soft)]" />
              </Link>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center gap-6 mt-2 pt-4 border-t border-[var(--color-ink)]/10">
            <Link to={`/community/post/${post.id}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
              <MessageSquare size={14} />
              <span>{post.reply_count ?? 0} Responses</span>
            </Link>
            
            <div className="ml-auto relative">
              {reported ? (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Moderation notified</span>
              ) : (
                <>
                  <button
                    onClick={() => setShowReport(r => !r)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] transition-colors"
                  >
                    <Flag size={14} /> Report
                  </button>
                  {showReport && (
                    <div className="absolute right-0 bottom-full mb-2 bg-white border border-[var(--color-ink)]/20 shadow-xl z-20 min-w-[200px]">
                      <div className="p-3 border-b border-[var(--color-ink)]/10 bg-[var(--color-bone)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                        Flag Content
                      </div>
                      {['spam', 'harassment', 'scam', 'inappropriate', 'misinformation'].map(r => (
                        <button
                          key={r}
                          onClick={() => handleReport(r)}
                          className="block w-full text-left px-4 py-3 text-sm capitalize hover:bg-[var(--color-ink)]/5 transition-colors border-b border-[var(--color-ink)]/5 last:border-0"
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
};
