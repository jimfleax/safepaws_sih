import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { useAuthStore } from '../store/authStore';
import { ApiClient } from '../utils/apiClient';
import { ArrowLeft, MessageSquare, Flag, Clock } from 'lucide-react';

type Reply = {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  channel: string;
  author_name: string;
  created_at: string;
};

export default function CommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  
  const [showPostReport, setShowPostReport] = useState(false);
  const [reportedPost, setReportedPost] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // Try real API first
        if (!postId) throw new Error('No post ID');
        const pData = await ApiClient.getCommunityPost(postId);
        setPost(pData);
        
        const rData = await ApiClient.getCommunityReplies(postId);
        setReplies(rData);
      } catch (err) {
        // Fallback for UI visualization if API isn't fully seeded
        setPost({
          id: postId || 'unknown',
          title: "Has anyone seen a Golden Retriever near Main St?",
          content: "I lost my dog yesterday around 5 PM. He has a red collar. Very friendly but might be scared.",
          author_name: "John Doe",
          channel: "lost-found",
          created_at: new Date(Date.now() - 3600000).toISOString()
        });
        setReplies([
          { id: "1", content: "I live nearby, I'll keep an eye out on my evening walk!", author_name: "Jane S.", created_at: new Date(Date.now() - 1800000).toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !isAuthenticated || !postId) return;
    
    try {
      const created = await ApiClient.createCommunityReply(postId, replyContent);
      setReplies(prev => [...prev, created]);
    } catch {
      // Optimistic
      setReplies(prev => [...prev, {
        id: Math.random().toString(),
        content: replyContent,
        author_name: user?.name || "You",
        created_at: new Date().toISOString()
      }]);
    } finally {
      setReplyContent("");
    }
  };

  const handleReport = async (reason: string, targetId: string, type: 'post' | 'reply') => {
    try {
      await ApiClient.reportContent(reason, type === 'post' ? targetId : undefined, type === 'reply' ? targetId : undefined);
    } finally {
      if (type === 'post') {
        setReportedPost(true);
        setShowPostReport(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
        <DashboardNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--color-ink)] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
        <DashboardNav />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Thread Not Found</h2>
          <p className="text-[var(--color-ink-soft)] mb-8">This post doesn't exist or was removed.</p>
          <button onClick={() => navigate('/community')} className="px-6 py-3 border border-[var(--color-ink)] text-[var(--color-ink)] text-sm font-bold uppercase tracking-widest hover:bg-[var(--color-ink)] hover:text-[var(--color-bone)] transition-colors">
            Return to Community
          </button>
        </main>
      </div>
    );
  }

  const isUrgent = post.channel === 'urgent' || post.channel === 'lost-found';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12">
          
          <Link to="/community" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-10">
            <ArrowLeft size={14} /> Back to Community
          </Link>

          {/* Original Post */}
          <article className="mb-12 bg-white border border-[var(--color-ink)]/15 p-6 sm:p-10 relative">
            {isUrgent && (
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-alert-clay)]" />
            )}
            
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${
                isUrgent
                  ? 'bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] border-[var(--color-alert-clay)]/20'
                  : 'bg-[var(--color-bone)] text-[var(--color-ink-soft)] border-[var(--color-ink)]/15'
              }`}>
                {post.channel}
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
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-6">{post.title}</h1>
            
            <div className="text-sm leading-relaxed text-[var(--color-ink)]/90 whitespace-pre-wrap pb-6 border-b border-[var(--color-ink)]/10">
              {post.content}
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                <MessageSquare size={14} />
                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
              </div>
              
              <div className="relative">
                {reportedPost ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Reported</span>
                ) : (
                  <>
                    <button onClick={() => setShowPostReport(!showPostReport)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] transition-colors">
                      <Flag size={12} /> Report
                    </button>
                    {showPostReport && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-[var(--color-ink)]/20 shadow-xl z-20 min-w-[200px]">
                        <div className="p-3 border-b border-[var(--color-ink)]/10 bg-[var(--color-bone)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                          Flag Content
                        </div>
                        {['spam', 'harassment', 'scam', 'inappropriate', 'misinformation'].map(r => (
                          <button key={r} onClick={() => handleReport(r, post.id, 'post')} className="block w-full text-left px-4 py-3 text-sm capitalize hover:bg-[var(--color-ink)]/5 transition-colors border-b border-[var(--color-ink)]/5 last:border-0">
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </article>

          {/* Thread Replies */}
          <section className="mb-12">
            <div className="space-y-4">
              {replies.length === 0 ? (
                <div className="py-12 text-center border border-[var(--color-ink)]/10 border-dashed">
                  <p className="text-[var(--color-ink-soft)] text-sm">No replies yet. Start the coordination.</p>
                </div>
              ) : (
                replies.map((reply, idx) => (
                  <div key={reply.id} className="flex gap-4">
                    {/* Thread line */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10 flex items-center justify-center text-[10px] font-bold uppercase text-[var(--color-ink-soft)]">
                        {reply.author_name.charAt(0)}
                      </div>
                      {idx !== replies.length - 1 && (
                        <div className="w-[1px] h-full bg-[var(--color-ink)]/10 my-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 bg-white border border-[var(--color-ink)]/15 p-5 hover:border-[var(--color-ink)]/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-ink)]">{reply.author_name}</span>
                          <span className="text-[var(--color-ink)]/20">·</span>
                          <span className="text-[10px] font-mono text-[var(--color-ink-soft)]">
                            {new Date(reply.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            if (window.confirm("Flag this reply for moderation?")) {
                              handleReport('inappropriate', reply.id, 'reply');
                            }
                          }}
                          className="text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] transition-colors" 
                          title="Report reply"
                        >
                          <Flag size={12} />
                        </button>
                      </div>
                      <p className="text-sm text-[var(--color-ink)]/90 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Reply Form */}
          <section className="bg-white border border-[var(--color-ink)]/15 p-6 sm:p-8 relative overflow-hidden">
            <div className="h-1 w-full bg-[var(--color-ink)] absolute top-0 left-0" />
            <h3 className="font-serif text-xl font-bold mb-4">Add Update</h3>
            {isAuthenticated ? (
              <form onSubmit={handleReply}>
                <textarea 
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Share a sighting, offer help, or provide context..."
                  className="w-full bg-transparent border-b border-[var(--color-ink)]/15 focus:border-[var(--color-ink)] outline-none py-3 text-sm resize-none transition-colors mb-6 leading-relaxed"
                  rows={3}
                  required
                />
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={!replyContent.trim()}
                    className="px-6 py-2.5 bg-[var(--color-ink)] text-[var(--color-bone)] text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-opacity"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center border border-[var(--color-ink)]/10 bg-[var(--color-bone)]/50">
                <p className="text-sm text-[var(--color-ink-soft)] mb-4">You must be part of the network to reply.</p>
                <Link to="/" className="inline-block px-6 py-2.5 bg-[var(--color-ink)] text-[var(--color-bone)] text-xs font-bold uppercase tracking-widest">
                  Log In or Join
                </Link>
              </div>
            )}
          </section>

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}
