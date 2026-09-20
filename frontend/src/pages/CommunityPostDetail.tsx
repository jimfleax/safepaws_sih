import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { ArrowLeft, MessageSquare, Flag } from 'lucide-react';

export default function CommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    // In a fully integrated environment, this would call apiClient.getCommunityPost(postId)
    // For now, we simulate fetching state for functional completeness
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Simulate network
        await new Promise(r => setTimeout(r, 600));
        setPost({
          id: postId,
          title: "Has anyone seen a Golden Retriever near Main St?",
          content: "I lost my dog yesterday around 5 PM. He has a red collar.",
          author_id: "user_123",
          author_name: "John Doe",
          channel: "Lost & Found",
          created_at: new Date().toISOString()
        });
        setReplies([
          { id: "1", content: "I'll keep an eye out!", author_name: "Jane S.", created_at: new Date().toISOString() }
        ]);
        setError(null);
      } catch (err) {
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    // Simulate optimistic UI update
    setReplies([...replies, {
      id: Math.random().toString(),
      content: replyContent,
      author_name: "You",
      created_at: new Date().toISOString()
    }]);
    setReplyContent("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
        <DashboardNav />
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-ink)] border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
        <DashboardNav />
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
          <h2 className="font-serif text-3xl mb-4 text-[var(--color-alert-clay)]">Post Not Found</h2>
          <p className="text-[var(--color-ink-soft)] mb-8">{error || "The post you're looking for doesn't exist or was removed."}</p>
          <button onClick={() => navigate('/community')} className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest text-sm">
            Return to Community
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 pb-32">
        
        <Link to="/community" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-12">
          <ArrowLeft size={16} /> Back to Community
        </Link>

        {/* Post Content */}
        <article className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-alert-clay)] bg-[var(--color-alert-clay)]/10 px-3 py-1">
              {post.channel}
            </span>
            <button className="text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] transition-colors" title="Report Post">
              <Flag size={18} />
            </button>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex items-center gap-4 mb-8 text-sm font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
            <span>{post.author_name}</span>
            <span className="w-1 h-1 bg-[var(--color-ink)]/20 rounded-full"></span>
            <span>Just now</span>
          </div>

          <div className="text-lg leading-relaxed text-[var(--color-ink)] bg-white/50 p-8 border border-[var(--color-ink)]/10">
            {post.content}
          </div>
        </article>

        {/* Replies Section */}
        <section className="border-t border-[var(--color-ink)]/20 pt-12">
          <h2 className="font-serif text-2xl mb-8 flex items-center gap-3">
            <MessageSquare size={24} /> {replies.length} Replies
          </h2>

          <div className="space-y-8 mb-12">
            {replies.length === 0 ? (
              <p className="text-[var(--color-ink-soft)] italic">No replies yet. Be the first to help!</p>
            ) : (
              replies.map(reply => (
                <div key={reply.id} className="bg-white/30 p-6 border-l-2 border-[var(--color-ink)]/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">{reply.author_name}</span>
                    <button className="text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] transition-colors" title="Report Reply">
                      <Flag size={14} />
                    </button>
                  </div>
                  <p className="text-[var(--color-ink)] leading-relaxed">{reply.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleReply} className="bg-white/50 p-6 border border-[var(--color-ink)]/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] mb-4">Leave a Reply</h3>
            <textarea 
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-transparent border-b border-[var(--color-ink)]/20 focus:border-[var(--color-ink)] outline-none py-3 resize-none transition-colors mb-6"
              rows={3}
              required
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={!replyContent.trim()}
                className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest text-sm disabled:opacity-50 transition-opacity"
              >
                Post Reply
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
}
