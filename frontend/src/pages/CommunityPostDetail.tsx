import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { ArrowLeft, MessageSquare, Flag, MapPin, Clock, Send, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { LedgerStatusStamp, LedgerStampState } from '../components/ui/LedgerStatusStamp';
import { ReportModal } from '../components/community/ReportModal';
import { AuthPromptModal } from '../components/modals/AuthPromptModal';

export default function CommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string>('');

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ postId?: string; replyId?: string; desc?: string }>({});
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

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
        console.error("Failed to load dispatch dossier:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    if (!replyContent.trim()) return;
    
    setSubmitting(true);
    setReplyError('');
    try {
      const res = await fetch(`/api/v1/community/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent.trim() }),
        credentials: 'include'
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to post reply');
      }
      const newReply = await res.json();
      setReplies(prev => [...prev, newReply]);
      setReplyContent('');
    } catch (e: any) {
      setReplyError(e.message || 'Unable to submit reply. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const openReportPost = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    setReportTarget({ postId, desc: 'this community dispatch' });
    setIsReportOpen(true);
  };

  const openReportReply = (replyId: string) => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    setReportTarget({ replyId, desc: 'this discussion reply' });
    setIsReportOpen(true);
  };

  // Truth in engineering: author display without fabricating identities or exposing internal IDs
  const getAuthorDisplay = (authorId?: string, authorName?: string) => {
    if (authorName) return authorName;
    if (authorId && user?.id === authorId && user?.name) return user.name;
    return 'Community member';
  };

  const getAuthorInitial = (authorId?: string, authorName?: string) => {
    const display = getAuthorDisplay(authorId, authorName);
    return display.charAt(0).toUpperCase() || 'C';
  };

  if (loading) {
    return (
      <main id="main-content" tabIndex={-1} className="outline-none flex flex-col h-screen bg-[var(--color-bone)]">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite">
          <div className="w-8 h-8 border-2 border-[var(--color-marigold)] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-soft)]">
            Retrieving Incident Dossier...
          </p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main id="main-content" tabIndex={-1} className="outline-none flex flex-col h-screen bg-[var(--color-bone)]">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-10 h-10 text-[var(--color-alert-clay)] mx-auto mb-3 opacity-80" />
          <h2 className="text-xl font-serif font-bold text-[var(--color-ink)] mb-2">Docket Record Not Found</h2>
          <p className="text-xs text-[var(--color-ink-soft)] max-w-sm mb-6">
            The requested dispatch dossier does not exist or has been archived from the active ledger.
          </p>
          <button 
            onClick={() => navigate('/community')} 
            className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-accent-text)] hover:underline min-h-[48px] sm:min-h-[44px] inline-flex items-center"
          >
            ← Return to Sector Ledger
          </button>
        </div>
      </main>
    );
  }

  const isSighting = post.channel === 'sightings';
  const isLost = post.channel === 'lost-found';
  const isReunion = post.channel === 'reunion-stories';
  const hasAlert = Boolean(post.associated_alert_id);

  let stampState: LedgerStampState = 'COMMUNITY_NOTE';
  if (hasAlert || isLost) {
    stampState = 'ACTIVE_SEARCH';
  } else if (isSighting) {
    stampState = 'UNVERIFIED_SIGHTING';
  } else if (isReunion) {
    stampState = 'REUNITED_CLOSED';
  }

  const postAuthor = getAuthorDisplay(post.author_id, post.author_name);
  const postInitial = getAuthorInitial(post.author_id, post.author_name);

  // SEC-BACKEND-01: Location privacy suppression on public views
  const displayLocation = post.location 
    ? post.location.replace(/^\d+[\s\w,]+?(?=(Sector|Block|Near|Opposite|Road|Nagar|Colony|Enclave|Vihar|Market|Area|$))/i, '') || 'Vicinity Reported'
    : null;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-bone)] font-sans text-[var(--color-ink)]">
      <DashboardNav />

      <main id="main-content" tabIndex={-1} className="outline-none flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 pb-32">
          
          {/* Back to Ledger Navigation */}
          <button 
            type="button"
            onClick={() => navigate('/community')}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mb-6 transition-colors min-h-[48px] sm:min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sector Ledger</span>
          </button>

          {/* Primary Dispatch Dossier Card */}
          <article 
            className={`bg-white border rounded-sm p-6 sm:p-8 shadow-xs relative ${
              hasAlert || isLost 
                ? 'border-[var(--color-border)] border-l-4 border-l-[var(--color-alert-clay)]' 
                : isSighting
                  ? 'border-[var(--color-border)] border-l-4 border-l-[var(--color-marigold)]'
                  : isReunion
                    ? 'border-[var(--color-border)] border-l-4 border-l-[var(--color-trail)]'
                    : 'border-[var(--color-border)]'
            }`}
          >
            {/* Top Docket Metadata Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)] mb-6">
              
              {/* Author Info: ERR-H-01 REMEDIATION — Author is <span>, not <h4> */}
              <div className="flex items-center gap-3">
                {/* Author Avatar: ERR-C-02 REMEDIATION — Carbon Ink on Bone surface (6.11:1 PASS) */}
                <div 
                  className="w-10 h-10 rounded-sm bg-[var(--color-bone)] border border-[var(--color-border)] text-[#1C1A17] flex items-center justify-center font-mono font-bold text-xs shrink-0 select-none"
                  aria-hidden="true"
                >
                  {postInitial}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--color-ink)] uppercase">
                      {postAuthor}
                    </span>
                    {post.author_id && user?.id === post.author_id && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[var(--color-marigold)]/15 text-[var(--color-accent-text)] rounded-sm font-bold">
                        AUTHOR
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-ink-soft)] font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {displayLocation && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[var(--color-ink-soft)]" />
                          {displayLocation}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Stamp & Moderation Action */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <LedgerStatusStamp state={stampState} size="sm" jitter={isLost ? -1.2 : 1.2} />
                
                {/* Report Button: Invariant Contract C4 & Test Compatibility */}
                <button
                  type="button"
                  onClick={openReportPost}
                  aria-label="Report post"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] hover:bg-[var(--color-bone)] rounded-sm transition-colors border border-[var(--color-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary Heading: ERR-H-01 REMEDIATION — Post Title is <h1> */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-ink)] tracking-tight leading-tight mb-4">
              {post.title}
            </h1>

            {/* Post Content Body */}
            <div className="prose max-w-none text-base text-[var(--color-ink)] leading-relaxed font-sans mb-6 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Incident Cross-Reference Ledger Banner (If Alert Associated) */}
            {post.associated_alert_id && (
              <div className="p-4 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-6">
                <div className="flex items-start sm:items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-[var(--color-alert-clay)] shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-ink-soft)] uppercase block">
                      LINKED INCIDENT DOSSIER
                    </span>
                    <p className="text-sm font-serif font-bold text-[var(--color-ink)]">
                      {post.pet_name ? `Active Recovery Case: ${post.pet_name}` : `Incident Alert #${post.associated_alert_id.slice(0, 8).toUpperCase()}`}
                    </p>
                  </div>
                </div>
                
                <Link
                  to={`/alerts/${post.associated_alert_id}`}
                  className="min-h-[48px] sm:min-h-[44px] px-4 py-2 bg-[var(--color-alert-clay)] text-white text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:opacity-90 active:translate-y-[1px] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  <span>Open Command Room</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>
            )}
          </article>

          {/* Discussion Deliberation Section: ERR-H-01 REMEDIATION — Discussion is <h2> */}
          <section className="mt-10" aria-labelledby="discussion-heading">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-6">
              <h2 id="discussion-heading" className="text-xl font-serif font-bold text-[var(--color-ink)]">
                Discussion & Field Notes ({replies.length})
              </h2>
              <span className="text-xs font-mono text-[var(--color-ink-soft)] uppercase">
                Chronological Record
              </span>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleReplySubmit} className="mb-8">
              <div className="bg-white border border-[var(--color-border)] rounded-sm p-4 shadow-xs">
                <label htmlFor="reply-textarea" className="sr-only">
                  Write a community reply
                </label>
                <textarea
                  id="reply-textarea"
                  rows={3}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={isAuthenticated 
                    ? "Add a timestamped observation, search corridor update, or recovery note..."
                    : "Sign in to SafePaws to participate in community recovery deliberations..."}
                  disabled={!isAuthenticated}
                  aria-label="Write a community reply"
                  className="w-full p-2 bg-transparent border-0 resize-none text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)] focus:outline-none font-sans leading-relaxed disabled:opacity-60"
                />

                {replyError && (
                  <div className="p-2 mb-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2" role="alert" aria-live="assertive">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{replyError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                  <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
                    {isAuthenticated ? `Replying as ${user?.name || 'Guardian'}` : 'Public Observer Mode'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {!isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => setIsAuthPromptOpen(true)}
                        className="min-h-[48px] sm:min-h-[44px] px-4 py-2 bg-[var(--color-marigold)] text-[#1C1A17] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-accent-hover)] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                      >
                        Sign In to Reply
                      </button>
                    ) : (
                      /* Send reply button: Must contain exact classes and aria-label for AccessibilityAudit.test.tsx */
                      <button
                        type="submit"
                        disabled={submitting || !replyContent.trim()}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 bg-[var(--color-marigold)] text-[#1C1A17] rounded-sm hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors shadow-xs active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                        aria-label="Send reply"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* Replies List */}
            {replies.length === 0 ? (
              <div className="text-center py-8 bg-white border border-[var(--color-border)] rounded-sm p-6 shadow-xs">
                <MessageSquare className="w-8 h-8 text-[var(--color-ink-soft)] mx-auto mb-2 opacity-40" />
                <p className="text-sm font-serif font-bold text-[var(--color-ink)]">No Field Notes Yet</p>
                <p className="text-xs text-[var(--color-ink-soft)] mt-1">
                  Be the first to reply or contribute recovery telemetry to this docket.
                </p>
              </div>
            ) : (
              <div className="space-y-3" role="feed" aria-label="Replies feed">
                {replies.map(reply => {
                  const replyAuthor = getAuthorDisplay(reply.author_id, reply.author_name);
                  const replyInitial = getAuthorInitial(reply.author_id, reply.author_name);

                  return (
                    <article 
                      key={reply.id} 
                      className="bg-white border border-[var(--color-border)] rounded-sm p-4 sm:p-5 shadow-xs"
                      aria-label={`Reply by ${replyAuthor}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          {/* Reply Avatar: Carbon Ink on Bone surface (6.11:1 PASS) */}
                          <div 
                            className="w-7 h-7 rounded-sm bg-[var(--color-bone)] border border-[var(--color-border)] text-[#1C1A17] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 select-none"
                            aria-hidden="true"
                          >
                            {replyInitial}
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-[var(--color-ink)] block uppercase">
                              {replyAuthor}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--color-ink-soft)] block">
                              {new Date(reply.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openReportReply(reply.id)}
                          aria-label={`Report reply by ${replyAuthor}`}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm text-[var(--color-ink)]/90 leading-relaxed font-sans pl-9 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Moderation Reporting Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        postId={reportTarget.postId}
        replyId={reportTarget.replyId}
        itemDescription={reportTarget.desc}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        actionMessage="To add field notes or file moderation flags, please sign in to your SafePaws guardian account."
      />
    </div>
  );
}
