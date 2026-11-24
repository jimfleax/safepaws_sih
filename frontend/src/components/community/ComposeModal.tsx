import React, { useState, useEffect, useRef } from 'react';
import { X, Send, AlertCircle, ShieldAlert, Sparkles, Eye, MessageSquare, Search } from 'lucide-react';
import { CANONICAL_CHANNELS, CommunityChannel } from './CommunityChannelFilterBar';

export function ComposeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultChannel = 'general',
  activeAlerts = [],
}: { 
  isOpen: boolean;
  onClose: () => void; 
  onSubmit: (data: { title: string; content: string; channel: string; associated_alert_id?: string | null }) => Promise<void>; 
  defaultChannel?: CommunityChannel;
  activeAlerts?: any[];
}) {
  const [channel, setChannel] = useState<CommunityChannel>(defaultChannel);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [associatedAlertId, setAssociatedAlertId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Sync defaultChannel when opened
  useEffect(() => {
    if (isOpen) {
      setChannel(defaultChannel);
      setTitle('');
      setContent('');
      setAssociatedAlertId('');
      setErrorMessage('');
      previousFocusRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, defaultChannel, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Please provide both an incident title and dispatch content.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      await onSubmit({ 
        title: title.trim(), 
        content: content.trim(), 
        channel, 
        associated_alert_id: associatedAlertId || null 
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to publish dispatch. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white border border-[var(--color-border)] w-full max-w-lg rounded-sm shadow-2xl flex flex-col max-h-[90vh] outline-none relative overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bone)]">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-ink-soft)] uppercase block">
              MUNICIPAL DISPATCH DOCKET
            </span>
            <h2 id="compose-modal-title" className="text-lg font-serif font-bold text-[var(--color-ink)] mt-0.5">
              Publish Field Dispatch
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close dispatch composer"
            className="min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Channel Selector — Canonical 4 Only */}
          <div>
            <label htmlFor="compose-channel-select" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider block mb-1.5">
              Dispatch Channel
            </label>
            <select
              id="compose-channel-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value as CommunityChannel)}
              className="w-full min-h-[48px] sm:min-h-[44px] px-3.5 bg-white border border-[var(--color-border)] rounded-sm text-xs font-mono font-bold text-[var(--color-ink)] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              {CANONICAL_CHANNELS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.id})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[var(--color-ink-soft)] mt-1 font-sans">
              {CANONICAL_CHANNELS.find(c => c.id === channel)?.description}
            </p>
          </div>

          {/* Optional Linked Alert Cross-Reference */}
          {activeAlerts.length > 0 && (
            <div>
              <label htmlFor="compose-alert-select" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider block mb-1.5">
                Link Active Missing Incident (Optional)
              </label>
              <select
                id="compose-alert-select"
                value={associatedAlertId}
                onChange={(e) => setAssociatedAlertId(e.target.value)}
                className="w-full min-h-[48px] sm:min-h-[44px] px-3.5 bg-white border border-[var(--color-border)] rounded-sm text-xs font-mono text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <option value="">-- No Incident Link --</option>
                {activeAlerts.map(a => (
                  <option key={a.id} value={a.id}>
                    Case: {a.petName || 'Companion'} (#{a.id.slice(0, 6).toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dispatch Title */}
          <div>
            <label htmlFor="compose-title" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider block mb-1.5">
              Docket Headline / Subject
            </label>
            <input
              id="compose-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sighting near Central Park South Gate / Golden Retriever observed"
              className="w-full min-h-[48px] sm:min-h-[44px] px-3.5 bg-white border border-[var(--color-border)] rounded-sm text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>

          {/* Dispatch Body */}
          <div>
            <label htmlFor="compose-content" className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider block mb-1.5">
              Field Telemetry & Observations
            </label>
            <textarea
              id="compose-content"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide exact cross-streets, animal markings, collar details, direction of movement, and whether safe shelter has been offered..."
              className="w-full p-3.5 bg-white border border-[var(--color-border)] rounded-sm text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] font-sans leading-relaxed"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-5 py-2.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-bone)] active:translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-6 py-2.5 bg-[var(--color-marigold)] text-[#1C1A17] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-accent-hover)] active:translate-y-[1px] transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Recording...' : 'Publish Dispatch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
