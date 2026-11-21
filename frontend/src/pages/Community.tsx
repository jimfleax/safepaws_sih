import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';
import { CommunityNav } from '../components/community/CommunityNav';
import { CommunityHeader } from '../components/community/CommunityHeader';
import { RecoverySidebar } from '../components/community/RecoverySidebar';
import { PostCard, Post } from '../components/community/PostCard';
import { ComposeModal } from '../components/community/ComposeModal';

export default function Community() {
  const { alerts } = usePetStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChannelId = searchParams.get('channel') || 'general';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiState, setApiState] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
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
      setApiState('success');
    }
  }, [activeChannelId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

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
        }
      } catch (e) {
        // Fallback to client-side filtering if search endpoint fails
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchPosts]);

  const handlePostSubmit = async (data: any) => {
    if (!isAuthenticated) { navigate('/'); return; }
    
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
    <div className="flex flex-col h-screen bg-[var(--color-background)]">
      <DashboardNav />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Navigation Drawer Overlay */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64 shadow-xl transform transition-transform duration-300">
              <CommunityNav 
                activeChannelId={activeChannelId} 
                onChannelSelect={id => setSearchParams({ channel: id })} 
                isMobile 
                onClose={() => setIsMobileNavOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:block h-full">
          <CommunityNav 
            activeChannelId={activeChannelId} 
            onChannelSelect={id => setSearchParams({ channel: id })} 
          />
        </div>

        {/* Center Feed */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-background)]">
          <CommunityHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onComposeClick={() => setIsComposeOpen(true)}
            onMenuClick={() => setIsMobileNavOpen(true)}
            isMobile
          />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4">
              {apiState === 'loading' ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                  <p className="text-[var(--color-ink-soft)] font-medium mb-4">No posts in this channel yet.</p>
                  <button 
                    onClick={() => setIsComposeOpen(true)}
                    className="px-6 py-2.5 bg-[var(--color-accent)] text-white font-bold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-sm"
                  >
                    Start a conversation
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

        {/* Right Sidebar */}
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
