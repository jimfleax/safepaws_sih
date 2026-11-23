import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { ArrowLeft, MessageSquare, Flag, MapPin, Clock, Send, AlertTriangle, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function CommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, repliesRes] = await Promise.all([
          fetch(`/api/v1/community/posts/${postId}`),
          fetch(`/api/v1/community/posts/${postId}/replies`)
        ]);
        
        if (postRes.ok) {
          setPost(await postRes.json());
        }
        if (repliesRes.ok) {
          setReplies(await repliesRes.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const [reportState, setReportState] = useState<'idle' | 'submitting' | 'reported' | 'error'>('idle');
  const [replyError, setReplyError] = useState<string>('');

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !isAuthenticated) return;
    
    setSubmitting(true);
    setReplyError('');
    try {
      const res = await fetch(`/api/v1/community/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent }),
        credentials: 'include'
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to post reply');
      }
      const newReply = await res.json();
      setReplies(prev => [...prev, newReply]);
      setReplyContent("");
    } catch (e: any) {
      setReplyError(e.message || 'Unable to submit reply. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportPost = async () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (reportState === 'reported' || reportState === 'submitting') return;

    setReportState('submitting');
    try {
      const res = await fetch('/api/v1/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          reason: 'Inappropriate content'
        }),
        credentials: 'include'
      });
      if (res.ok) {
        setReportState('reported');
      } else {
        setReportState('error');
      }
    } catch {
      setReportState('error');
    }
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  if (loading) {
    return (
      <main id="main-content" tabIndex={-1} className="outline-none flex flex-col h-screen bg-[var(--color-background)]">
        <DashboardNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main id="main-content" tabIndex={-1} className="outline-none flex flex-col h-screen bg-[var(--color-background)]">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold mb-4">Post not found</h2>
          <button onClick={() => navigate('/community')} className="text-[var(--color-accent-text)] hover:underline min-h-[44px] inline-flex items-center">
            Back to Community
          </button>
        </div>
      </main>
    );
  }

  const isSighting = post.channel === 'sightings';
  const isLost = post.channel === 'lost-found';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-bone)]">
      <DashboardNav />

      <main id="main-content" tabIndex={-1} className="outline-none flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 py-6 md:py-8 pb-32">
          
          <button 
            onClick={() => navigate('/community')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-6 min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-lg"
          >
            <ArrowLeft size={16} /> Back to Community
          </button>

          {/* MAIN POST */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#f9a826] text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(post.author_name)}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-ink)] leading-tight">{post.author_name}</h4>
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium flex items-center gap-1 mt-0.5">
                    <Clock size={12} />
                    {new Date(post.created_at).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' })}
                    <span className="mx-1">•</span>
                    <span className="uppercase tracking-wider text-[10px] bg-[var(--color-background)] px-1.5 py-0.5 rounded text-[var(--color-ink)]">
                      {post.channel.replace('-', ' ')}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {reportState === 'reported' && (
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-full">
                    Reported
                  </span>
                )}
                {reportState === 'error' && (
                  <span className="text-xs text-red-600 font-semibold bg-red-50 px-2.5 py-1 rounded-full">
                    Failed to report
                  </span>
                )}
                <button 
                  onClick={handleReportPost}
                  disabled={reportState === 'reported' || reportState === 'submitting'}
                  title={reportState === 'reported' ? 'Post reported' : 'Report inappropriate post'}
                  className={`p-2 rounded-full transition-colors ${
                    reportState === 'reported'
                      ? 'text-amber-600 bg-amber-50 cursor-default'
                      : 'text-[var(--color-ink-soft)] hover:text-red-500 hover:bg-red-50'
                  }`}
                  aria-label="Report post"
                >
                  <Flag size={16} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-black text-[var(--color-ink)] mb-4 leading-tight">{post.title}</h1>
            
            {(isSighting && post.location) && (
              <div className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg mb-4 border border-blue-100">
                <MapPin size={16} /> Location: {post.location}
              </div>
            )}
            
            {(isLost && post.pet_name) && (
              <div className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mb-4 border border-amber-100">
                <AlertTriangle size={16} /> Pet: {post.pet_name}
              </div>
            )}

            <div className="text-base leading-relaxed text-[var(--color-ink)]/90 whitespace-pre-wrap">
              {post.content}
            </div>
            
            {post.associated_alert_id && (
              <Link to={`/alerts/${post.associated_alert_id}`} className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-red-50 text-red-700 font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                <AlertTriangle size={16} /> View Connected Alert
              </Link>
            )}
          </div>

          {/* REPLIES SECTION */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[var(--color-ink)] flex items-center gap-2">
              <MessageSquare size={20} /> Discussion ({replies.length})
            </h3>

            {/* Compose Reply */}
            <form onSubmit={handleReplySubmit} className="flex flex-col gap-2 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
              {replyError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
                  {replyError}
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 mt-1">
                  <User size={16} />
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    disabled={submitting || !isAuthenticated}
                    placeholder={isAuthenticated ? "Add to the discussion..." : "Sign in to reply"}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none resize-none min-h-[80px]"
                  />
                  <div className="absolute right-2 bottom-2">
                    <button 
                      type="submit"
                      disabled={submitting || !isAuthenticated || !replyContent.trim()}
                      className="p-2 bg-[var(--color-accent)] text-[var(--color-ink)] rounded-md hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                      aria-label="Send reply"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* RELATED ACTIONS */}
            {(isLost || isSighting) && (
              <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
                <h4 className="text-sm font-bold text-[var(--color-ink)] uppercase tracking-wider mb-3">Recovery Actions</h4>
                <div className="flex flex-col gap-2">
                  {post.associated_alert_id ? (
                    <Link
                      to={`/alerts/${post.associated_alert_id}`}
                      className="flex items-center justify-between p-3 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                          <AlertTriangle size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--color-ink)]">View Active Alert Case Room</p>
                          <p className="text-xs text-[var(--color-ink-soft)]">Manage sightings and resolve incident</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-accent)]">Open →</span>
                    </Link>
                  ) : (
                    <Link
                      to={isSighting ? "/sightings/new" : "/lost/new"}
                      className="flex items-center justify-between p-3 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--color-ink)]">
                            {isSighting ? "Submit Formal Sighting Report" : "Declare Missing Identity"}
                          </p>
                          <p className="text-xs text-[var(--color-ink-soft)]">
                            {isSighting ? "Push verified observation to network" : "Broadcast Level-1 recovery alert"}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-accent)]">Report →</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Replies List */}
            <div className="space-y-4 pt-4">
              {replies.map(reply => (
                <div key={reply.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
                    {getInitials(reply.author_name)}
                  </div>
                  <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 rounded-tl-sm">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-bold text-sm text-[var(--color-ink)]">{reply.author_name}</span>
                      <span className="text-[11px] text-[var(--color-ink-soft)] font-medium">
                        {new Date(reply.created_at).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-ink)]/90 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
