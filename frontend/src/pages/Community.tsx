import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { CommunityNav } from '../components/community/CommunityNav';
import { CommunityHeader } from '../components/community/CommunityHeader';
import { RecoverySidebar } from '../components/community/RecoverySidebar';
import { PostCard, Post } from '../components/community/PostCard';
import { ComposeModal } from '../components/community/ComposeModal';
import { CheckCircle2, X, MessageSquare, AlertCircle, RefreshCw, Plus } from 'lucide-react';

export default function Community() {
  const { alerts } = usePetStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChannelId = searchParams.get('channel') || 'general';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiState, setApiState] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const [sightingConfirmed, setSightingConfirmed] = useState(false);
  const [confirmedPetName, setConfirmedPetName] = useState('');

  // Handle preserved anonymous sighting confirmation from ReportSighting.tsx
  useEffect(() => {
    if (location.state?.sightingSubmitted) {
      setSightingConfirmed(true);
      setConfirmedPetName(location.state?.petName || 'companion');
      // Clean up route state to prevent banner re-appearing after unrelated page navigation/refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const fetchPosts = useCallback(async () => {
    setApiState('loading');
    try {
      const res = await fetch(`/api/v1/community/posts?channel=${encodeURIComponent(activeChannelId)}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      // Most recent first for feed view
      setPosts(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setApiState('success');
    } catch {
      setPosts([]);
      setApiState('error');
    }
  }, [activeChannelId]);

  useEffect(() => { 
    fetchPosts(); 
  }, [fetchPosts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/community/search?query=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const results = await res.json();
          setPosts(results);
          setApiState('success');
        }
      } catch (e) {
        // Fallback to client-side filtering if search endpoint fails
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchPosts]);

  const handlePostSubmit = async (data: any) => {
    if (!isAuthenticated) { 
      navigate('/'); 
      return; 
    }
    
    const res = await fetch('/api/v1/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || 'Failed to publish post');
    }
    const created = await res.json();
    setPosts(prev => [created, ...prev]);
  };

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-bone)] font-sans text-[var(--color-ink)]">
      <DashboardNav />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Navigation Drawer Overlay */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-xs" 
              onClick={() => setIsMobileNavOpen(false)} 
            />
            <div className="absolute inset-y-0 left-0 w-64 shadow-2xl transform transition-transform duration-300">
              <CommunityNav 
                activeChannelId={activeChannelId} 
                onChannelSelect={id => setSearchParams({ channel: id })} 
                isMobile 
                onClose={() => setIsMobileNavOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Desktop Navigation Channel Sidebar */}
        <div className="hidden md:block h-full border-r border-[var(--color-border)]">
          <CommunityNav 
            activeChannelId={activeChannelId} 
            onChannelSelect={id => setSearchParams({ channel: id })} 
          />
        </div>

        {/* Center Main Feed Viewport */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-bone)]">
          <CommunityHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onComposeClick={() => setIsComposeOpen(true)}
            onMenuClick={() => setIsMobileNavOpen(true)}
            isMobile
          />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              
              {/* Preserved Anonymous Sighting Confirmation Banner */}
              {sightingConfirmed && (
                <div 
                  role="status" 
                  aria-live="polite" 
                  className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-4 text-[var(--color-ink)] shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-[var(--color-ink)]">
                        Sighting Report Successfully Submitted
                      </p>
                      <p className="text-xs text-[var(--color-ink-soft)] mt-0.5 leading-relaxed">
                        Thank you for your timely observation regarding <strong>{confirmedPetName}</strong>. The SafePaws community network and guardian have been notified to coordinate recovery.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSightingConfirmed(false)}
                    aria-label="Dismiss confirmation"
                    className="p-1 hover:bg-black/5 rounded-full text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center -mr-2 -mt-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Feed State Routing */}
              {apiState === 'loading' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-10 h-10 border-3 border-[var(--color-marigold)] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-soft)]">
                    Syncing Community Feed...
                  </p>
                </div>
              ) : apiState === 'error' ? (
                <div className="text-center py-16 bg-white border border-[var(--color-border)] rounded-3xl p-8 shadow-xs">
                  <AlertCircle className="w-10 h-10 text-[var(--color-alert-clay)] mx-auto mb-3 opacity-80" />
                  <h3 className="font-serif text-xl font-bold text-[var(--color-ink)] mb-1">
                    Feed Temporarily Unavailable
                  </h3>
                  <p className="text-xs text-[var(--color-ink-soft)] font-light max-w-sm mx-auto mb-6 leading-relaxed">
                    Unable to retrieve messages for this channel. Please verify your connection or try again.
                  </p>
                  <button 
                    onClick={fetchPosts}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-ink)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2723] transition-colors min-h-[44px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Feed</span>
                  </button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[var(--color-border)] rounded-3xl p-8 shadow-xs">
                  <MessageSquare className="w-10 h-10 text-[var(--color-ink-soft)] mx-auto mb-3 opacity-40" />
                  <h3 className="font-serif text-xl font-bold text-[var(--color-ink)] mb-1">
                    No Posts in This Channel Yet
                  </h3>
                  <p className="text-xs text-[var(--color-ink-soft)] font-light max-w-sm mx-auto mb-6 leading-relaxed">
                    Be the first in your local neighborhood network to share observations, safety tips, or recovery coordination.
                  </p>
                  <button 
                    onClick={() => setIsComposeOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-marigold)] text-[var(--color-ink)] text-xs font-bold uppercase tracking-wider hover:bg-[#D97706] transition-colors shadow-xs min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start a Conversation</span>
                  </button>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}

            </div>
          </div>
        </div>

        {/* Right Sidebar: Real Alerts & Field Guidance */}
        <RecoverySidebar activeAlerts={activeAlerts} />
      </div>

      <ComposeModal 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
        onSubmit={handlePostSubmit} 
        defaultChannel={activeChannelId} 
      />
    </div>
  );
}