import React, { useState } from 'react';
import { X, Send, MapPin, Tag } from 'lucide-react';
import { CHANNELS } from './CommunityNav';

export function ComposeModal({ isOpen, onClose, onSubmit, defaultChannel = 'general' }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => Promise<void>, defaultChannel?: string }) {
  const [channel, setChannel] = useState(defaultChannel);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title, content, channel, location });
      setTitle('');
      setContent('');
      setLocation('');
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const isSightingOrLost = channel === 'sightings' || channel === 'lost-found';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)]">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Create Post</h2>
          <button onClick={onClose} className="p-1.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)]/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1.5">Channel</label>
            <div className="relative">
              <select 
                value={channel} 
                onChange={e => setChannel(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[var(--color-accent)] appearance-none"
              >
                {CHANNELS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-[var(--color-ink-soft)]">
                <Tag size={16} />
              </div>
            </div>
          </div>

          <div>
            <input 
              type="text" 
              placeholder="Give your post a clear title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-transparent border-none text-xl font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-soft)]/50 focus:ring-0 p-0"
              autoFocus
              required
            />
          </div>
          
          <div className="flex-1 min-h-[120px]">
            <textarea 
              placeholder="What do you want to share with the local community?"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full h-full bg-transparent border-none text-base text-[var(--color-ink)] placeholder-[var(--color-ink-soft)]/50 focus:ring-0 p-0 resize-none"
            />
          </div>

          {isSightingOrLost && (
             <div className="bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-border)]">
               <label className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-2">
                 <MapPin size={14} /> Location / Context
               </label>
               <input 
                 type="text"
                 placeholder="e.g., Connaught Place, Block A"
                 value={location}
                 onChange={e => setLocation(e.target.value)}
                 className="w-full bg-transparent border-none text-sm p-0 focus:ring-0"
               />
             </div>
          )}
        </form>

        <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-background)] flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-white font-bold rounded-lg hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Posting...' : 'Post'} <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
