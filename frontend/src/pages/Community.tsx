import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { CommunityNav, CANONICAL_CHANNELS, CommunityChannel } from '../components/community/CommunityNav';
import { CommunityHeader } from '../components/community/CommunityHeader';
import { CommunityChannelFilterBar } from '../components/community/CommunityChannelFilterBar';
import { RecoverySidebar } from '../components/community/RecoverySidebar';
import { PostCard, Post } from '../components/community/PostCard';
import { ComposeModal } from '../components/community/ComposeModal';
import { AuthPromptModal } from '../components/modals/AuthPromptModal';
import { LedgerStatusStamp } from '../components/ui/LedgerStatusStamp';
import { CheckCircle2, X, MessageSquare, AlertCircle, RefreshCw, Plus, ShieldCheck } from 'lucide-react';

export default function Community() {
  const { alerts } = usePetStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Validate activeChannel against canonical 4
  const rawChannel = searchParams.get('channel') || 'general';
  const activeChannel: CommunityChannel = (
    CANONICAL_CHANNELS.some(c => c.id === rawChannel) ? rawChannel : 'general'
  ) as CommunityChannel;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiState, setApiState] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const [sightingConfirmed, setSightingConfirmed] = useState(false);
  const [confirmedPetName, setConfirmedPetName] = useState('');

  // Handle preserved anonymous sighting confirmation from ReportSighting.tsx
  useEffect(() => {
    if (location.state?.sightingSubmitted) {
      setSightingConfirmed(true);
      setConfirmedPetName(location.state?.petName || 'companion');
      // Clean up route state to prevent banner re-appearing after page navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const fetchPosts = useCallback(async () => {
    setApiState('loading');
    try {
      const res = await fetch(`/api/v1/community/posts?channel=${encodeURIComponent(activeChannel)}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      // Most recent first for feed view
      setPosts(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setApiState('success');
    } catch {
      setPosts([]);
      setApiState('error');
    }
  }, [activeChannel]);

  useEffect(() => { 
    fetchPosts(); 
  }, [fetchPosts]);

  // Debounced search
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

  const handleChannelChange = (channelId: CommunityChannel) => {
    setSearchParams({ channel: channelId });
    setSearchQuery('');
  };

  const handleComposeTrigger = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
    } else {
      setIsComposeOpen(true);
    }
  };

  const handlePostSubmit = async (data: any) => {
    if (!isAuthenticated) { 
      setIsAuthPromptOpen(true);
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
      throw new Error(errJson.detail || 'Failed to publish dispatch');
    }
    const created = await res.json();
    setPosts(prev => [created, ...prev]);
  };

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.author_name && p.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentChannelConfig = CANONICAL_CHANNELS.find(c => c.id === activeChannel);

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
                activeChannelId={activeChannel}
                onChannelSelect={handleChannelChange}
                isMobile
                onClose={() => setIsMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Desktop Left Channel Ledger Column */}
        <div className="hidden md:flex">
          <CommunityNav 
            activeChannelId={activeChannel}
            onChannelSelect={handleChannelChange}
          />
        </div>

        {/* Center Dispatch Workspace */}
        <main 
          id="main-content" 
          tabIndex={-1} 
          className="flex-1 flex flex-col h-full bg-[var(--color-bone)] overflow-hidden outline-none"
        >
          {/* Header Bar */}
          <CommunityHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onComposeClick={handleComposeTrigger}
            onMenuClick={() => setIsMobileNavOpen(true)}
            isMobile
          />

          {/* Mobile / Tablet Horizontal Channel Tabs */}
          <div className="md:hidden px-4 pt-3 pb-1 border-b border-[var(--color-border)] bg-white">
            <CommunityChannelFilterBar
              activeChannel={activeChannel}
              onChange={handleChannelChange}
            />
          </div>

          {/* Scrollable Feed Container */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-4">

              {/* Active Channel Sector Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-ink-soft)] uppercase block">
                    SECTOR LEDGER // {activeChannel}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-ink)] mt-0.5">
                    {currentChannelConfig?.label}
                  </h1>
                </div>
                <LedgerStatusStamp 
                  state={activeChannel === 'lost-found' ? 'ACTIVE_SEARCH' : activeChannel === 'sightings' ? 'UNVERIFIED_SIGHTING' : 'COMMUNITY_NOTE'} 
                  size="sm" 
                  jitter={1.0}
                />
              </div>

              {/* Sighting Confirmed Archival Docket Alert */}
              {sightingConfirmed && (
                <div 
                  role="status" 
                  aria-live="polite"
                  className="p-4 sm:p-5 bg-white border border-[var(--color-trail)] border-l-4 border-l-[var(--color-trail)] rounded-sm flex items-start justify-between gap-4 text-[var(--color-ink)] shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-trail)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[var(--color-trail)] uppercase block font-bold">
                        DOCKET RECORDED // VERIFIED LOG ENTRY
                      </span>
                      <p className="font-bold text-sm text-[var(--color-ink)] mt-0.5">
                        Field Observation Submitted for {confirmedPetName}
                      </p>
                      <p className="text-xs text-[var(--color-ink-soft)] mt-1 leading-relaxed">
                        Your timestamped coordinates and notes have been registered into the recovery timeline. Citizen scouts and guardians have been synchronized.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSightingConfirmed(false)}
                    aria-label="Dismiss confirmation receipt"
                    className="p-1 hover:bg-[var(--color-bone)] rounded-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors cursor-pointer min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] inline-flex items-center justify-center -mr-2 -mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Feed State Routing */}
              {apiState === 'loading' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
                  <div className="w-8 h-8 border-2 border-[var(--color-marigold)] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-soft)]">
                    Accessing Sector Records...
                  </p>
                </div>
              ) : apiState === 'error' ? (
                <div className="text-center py-12 bg-white border border-[var(--color-border)] rounded-sm p-8 shadow-xs">
                  <AlertCircle className="w-10 h-10 text-[var(--color-alert-clay)] mx-auto mb-3 opacity-90" />
                  <h2 className="font-serif text-xl font-bold text-[var(--color-ink)] mb-1">
                    Sector Ledger Unavailable
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] max-w-sm mx-auto mb-6 leading-relaxed">
                    Unable to retrieve messages for this channel. Please verify your connection and retry.
                  </p>
                  <button 
                    onClick={fetchPosts}
                    className="min-h-[48px] sm:min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--color-ink)] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#2A2723] active:translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Ledger</span>
                  </button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white border border-[var(--color-border)] rounded-sm p-8 shadow-xs">
                  <MessageSquare className="w-10 h-10 text-[var(--color-ink-soft)] mx-auto mb-3 opacity-40" />
                  <h2 className="font-serif text-xl font-bold text-[var(--color-ink)] mb-1">
                    {searchQuery ? 'No Matching Dispatches' : 'No Dispatches in This Channel Yet'}
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] max-w-sm mx-auto mb-6 leading-relaxed">
                    {searchQuery 
                      ? `Zero records match query "${searchQuery}". Reset filters to see all channel posts.`
                      : 'Be the first in your local safety network to log observations, advice, or recovery coordination.'}
                  </p>
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="min-h-[48px] sm:min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[var(--color-bone)] active:translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear Search</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleComposeTrigger}
                      className="min-h-[48px] sm:min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[var(--color-marigold)] text-[#1C1A17] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[var(--color-accent-hover)] active:translate-y-[1px] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>File First Dispatch</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4" role="feed" aria-label={`${currentChannelConfig?.label} feed`}>
                  {filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}

            </div>
          </div>
        </main>

        {/* Right Recovery Sidebar: Real Alerts & Tactical Guidance */}
        <RecoverySidebar activeAlerts={activeAlerts} />
      </div>

      {/* Compose Dispatch Modal */}
      <ComposeModal 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
        onSubmit={handlePostSubmit} 
        defaultChannel={activeChannel}
        activeAlerts={activeAlerts}
      />

      {/* Unauthenticated User Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        actionMessage="To publish community dispatches or alert field searchers, please sign in to your SafePaws guardian account."
      />
    </div>
  );
}
