import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import {
  Search, Plus, MapPin, Clock, AlertTriangle, Heart, Users,
  MessageSquare, Eye, Bell, ChevronRight, ArrowRight, Flag, X, Hash, Send, Image as ImageIcon, Smile
} from 'lucide-react';

const CHANNELS = [
  { id: 'lost-found', label: 'lost-and-found', desc: 'Emergency coordination for lost pets' },
  { id: 'sightings', label: 'sightings', desc: 'Report any wandering pets you spot' },
  { id: 'general', label: 'general', desc: 'Community chat & general discussion' },
  { id: 'pet-care', label: 'pet-care', desc: 'Advice and help with pet care' },
  { id: 'rescue', label: 'rescue-shelters', desc: 'Local shelters and rescue operations' },
  { id: 'adoption', label: 'adoption', desc: 'Pets looking for their forever home' },
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
};

export default function Community() {
  const { alerts } = usePetStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChannelId = searchParams.get('channel') || 'general';
  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[2];
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiState, setApiState] = useState<'loading' | 'success' | 'error'>('loading');
  const [messageContent, setMessageContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const fetchPosts = useCallback(async () => {
    setApiState('loading');
    try {
      const res = await fetch(`/api/v1/community/posts?channel=${encodeURIComponent(activeChannelId)}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setPosts(data.reverse()); // Discord displays oldest top, newest bottom (we append to bottom)
      setApiState('success');
    } catch {
      setPosts([]);
      setApiState('success');
    }
  }, [activeChannelId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Scroll to bottom when messages load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/'); return; }
    if (!messageContent.trim()) return;
    
    setSubmitting(true);
    // Create a title from first 5 words
    const words = messageContent.trim().split(/\s+/);
    const title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');

    const newPost = { title, content: messageContent, channel: activeChannelId };
    
    try {
      const res = await fetch('/api/v1/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setPosts(prev => [...prev, created]);
      setMessageContent('');
    } catch {
      // Optimistic
      const optimistic: Post = {
        id: Math.random().toString(36).slice(2),
        ...newPost,
        author_name: user?.name || 'You',
        created_at: new Date().toISOString(),
      };
      setPosts(prev => [...prev, optimistic]);
      setMessageContent('');
    } finally {
      setSubmitting(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <div className="h-screen bg-[var(--color-surface)] flex overflow-hidden text-[var(--color-ink)] font-sans">
      {/* 1. Left Sidebar (Dashboard Nav) */}
      <DashboardNav />

      {/* 2. Channels Sidebar (Discord-style) */}
      <div className="w-60 bg-[var(--color-surface-raised)] border-r border-[var(--color-border)] flex flex-col flex-shrink-0 z-10 hidden md:flex">
        <div className="h-16 px-4 flex items-center border-b border-[var(--color-border)] shadow-sm">
          <h2 className="font-bold text-[var(--color-ink)] text-lg">SafePaws Hub</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          <div>
            <h3 className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1">Text Channels</h3>
            <div className="space-y-0.5">
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setSearchParams({ channel: ch.id })}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left ${
                    activeChannelId === ch.id 
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold' 
                      : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)]'
                  }`}
                >
                  <Hash size={18} className="opacity-70" />
                  <span className="truncate text-[0.95rem]">{ch.label}</span>
                  {ch.id === 'lost-found' && activeAlerts.length > 0 && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full">
                      {activeAlerts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* User Mini Profile */}
        <div className="p-3 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <img src={user?.picture || 'https://via.placeholder.com/40'} alt="avatar" className="w-8 h-8 rounded-full border border-[var(--color-border)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-xs text-[var(--color-ink-soft)] truncate">Online</p>
              </div>
            </>
          ) : (
            <div className="w-full">
              <p className="text-xs text-[var(--color-ink-soft)] mb-2">Join community to chat</p>
              <button onClick={() => navigate('/')} className="w-full py-1.5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-md hover:bg-[var(--color-accent-hover)] transition-colors">Sign In</button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-background)] relative">
        {/* Chat Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Hash size={24} className="text-[var(--color-ink-soft)]" />
            <h2 className="font-bold text-lg">{activeChannel.label}</h2>
            <div className="hidden sm:block w-px h-6 bg-[var(--color-border)] mx-2" />
            <p className="hidden sm:block text-sm text-[var(--color-ink-soft)] truncate max-w-md">{activeChannel.desc}</p>
          </div>
          
          <div className="flex items-center gap-3 lg:hidden">
            <button className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
              <Users size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="mb-8 mt-12 pb-4 border-b border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-surface-raised)] rounded-full flex items-center justify-center mb-4">
              <Hash size={36} className="text-[var(--color-ink-soft)]" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to #{activeChannel.label}!</h1>
            <p className="text-[var(--color-ink-soft)]">{activeChannel.desc}. This is the start of the channel.</p>
          </div>

          {apiState === 'loading' ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
             <div className="py-4 text-[var(--color-ink-soft)] text-sm">No messages here yet. Break the ice!</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="flex gap-4 group hover:bg-[var(--color-ink)]/5 p-2 -mx-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#f9a826] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm mt-0.5">
                  {getInitials(post.author_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-[15px] hover:underline cursor-pointer">{post.author_name}</span>
                    <span className="text-xs text-[var(--color-ink-soft)] font-medium">
                      {new Date(post.created_at).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="text-[15px] leading-relaxed text-[var(--color-ink)]/90 break-words whitespace-pre-wrap">
                    {post.content}
                  </div>
                  {post.associated_alert_id && (
                    <Link to={`/alerts/${post.associated_alert_id}`} className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-xs font-bold rounded-md hover:bg-[var(--color-danger)]/20 transition-colors">
                      <AlertTriangle size={14} /> Related Alert Attached
                    </Link>
                  )}
                </div>
                {/* Message Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm absolute right-4 -translate-y-4 px-1 py-1 transition-opacity">
                  <button className="p-1.5 text-[var(--color-ink-soft)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded" title="Report message">
                    <Flag size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-[var(--color-background)] shrink-0">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="absolute left-3 top-3 text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] cursor-pointer p-1 rounded-full hover:bg-[var(--color-ink)]/5 transition-colors">
              <ImageIcon size={20} />
            </div>
            <textarea
              value={messageContent}
              onChange={e => setMessageContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={submitting || !isAuthenticated}
              placeholder={isAuthenticated ? `Message #${activeChannel.label}` : 'You must be signed in to chat.'}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl pl-12 pr-24 py-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] resize-none text-[15px]"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '50vh' }}
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-1">
              <div className="p-1.5 text-[var(--color-ink-soft)] hover:text-[#fbbf24] cursor-pointer rounded-full hover:bg-[var(--color-ink)]/5 transition-colors hidden sm:block">
                <Smile size={20} />
              </div>
              <button
                type="submit"
                disabled={submitting || !messageContent.trim() || !isAuthenticated}
                className="p-1.5 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:hover:bg-[var(--color-accent)] transition-colors shadow-sm ml-1 flex items-center justify-center w-8 h-8"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-2 text-[11px] text-[var(--color-ink-soft)]">
            <strong>ProTip:</strong> Shift + Enter to add a new line. Please follow our community guidelines.
          </div>
        </div>
      </div>

      {/* 4. Right Sidebar (Members & Info) */}
      <div className="w-72 bg-[var(--color-surface-raised)] border-l border-[var(--color-border)] flex-col flex-shrink-0 hidden xl:flex">
        <div className="h-16 px-4 flex items-center border-b border-[var(--color-border)] shadow-sm">
          <h2 className="font-bold text-[var(--color-ink)]">Community Actions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/lost/new" className="flex items-center gap-3 p-3 bg-[var(--color-danger)] text-white rounded-lg hover:bg-[var(--color-danger)]/90 transition-colors shadow-sm">
                <AlertTriangle size={18} />
                <span className="text-sm font-semibold">Report Lost Pet</span>
              </Link>
              <Link to="/sightings/new" className="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-background)] transition-colors shadow-sm">
                <Eye size={18} className="text-[var(--color-accent)]" />
                <span className="text-sm font-medium">Log a Sighting</span>
              </Link>
            </div>
          </div>

          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">
                Active Alerts — {activeAlerts.length}
              </h3>
              <div className="space-y-2">
                {activeAlerts.slice(0, 4).map(a => (
                  <Link key={a.id} to={`/alerts/${a.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--color-ink)]/5 transition-colors group">
                    <div className="w-8 h-8 rounded bg-[var(--color-surface)] overflow-hidden border border-[var(--color-border)] flex-shrink-0 relative">
                      {a.photoUrl ? (
                        <img src={a.photoUrl} alt={a.petName} className="w-full h-full object-cover" />
                      ) : (
                        <Heart size={14} className="m-auto mt-2 text-[var(--color-ink-soft)]" />
                      )}
                      <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-danger)] rounded-bl-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--color-ink)] truncate group-hover:text-[var(--color-accent)] transition-colors">{a.petName}</p>
                      <p className="text-[11px] text-[var(--color-ink-soft)] truncate flex items-center gap-1">
                        <MapPin size={10} /> {a.lastSeenAddress}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
