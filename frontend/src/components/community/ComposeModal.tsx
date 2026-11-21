import React, { useState } from 'react';
import { X, Send, MapPin, Tag } from 'lucide-react';
import { CHANNELS } from './CommunityNav';

export function ComposeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultChannel = 'general' 
}: { 
  isOpen: boolean;
  onClose: () => void; 
  onSubmit: (data: any) => Promise<void>; 
  defaultChannel?: string;
}) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]">
          <h2 className="text-base font-serif font-bold text-[var(--color-ink)]">Create Community Post</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-[var(--color-ink-soft)] hover:bg-black/5 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-2">
              Channel Topic
            </label>
            <div className="relative">
              <select 
                value={channel} 
                onChange={e => setChannel(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] appearance-none cursor-pointer min-h-[44px]"
              >
                {CHANNELS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-[var(--color-ink-soft)]">
                <Tag size={16} />
              </div>
            </div>
          </div>

          <div>
            <input 
              type="text" 
              placeholder="Give your message a clear title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--color-border)] pb-2 text-xl font-serif font-bold text-[var(--color-ink)] placeholder:[var(--color-ink-soft)]/50 focus:outline-none focus:border-[var(--color-ink)] min-h-[44px]"
              autoFocus
              required
            />
          </div>
          
          <div className="flex-1 min-h-[140px]">
            <textarea 
              placeholder="What observation, question, or recovery tip would you like to share?"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full h-full bg-transparent border-none text-sm text-[var(--color-ink)] placeholder:[var(--color-ink-soft)]/50 focus:outline-none resize-none leading-relaxed font-light"
            />
          </div>

          {isSightingOrLost && (
             <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
               <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-2">
                 <MapPin size={14} className="text-[var(--color-alert-clay)]" /> 
                 <span>Location / Area Context</span>
               </label>
               <input 
                 type="text" 
                 placeholder="e.g. Connaught Place, Block A"
                 value={location}
                 onChange={e => setLocation(e.target.value)}
                 className="w-full bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ink)] min-h-[40px]"
               />
             </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-ink)] hover:bg-[#2A2723] text-white font-bold text-xs uppercase tracking-wider rounded-xl disabled:opacity-50 transition-colors shadow-xs min-h-[44px]"
          >
            <span>{submitting ? 'Publishing...' : 'Publish Post'}</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}