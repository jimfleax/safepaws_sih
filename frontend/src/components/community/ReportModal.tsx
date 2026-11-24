import React, { useState, useEffect, useRef } from 'react';
import { Flag, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  replyId?: string;
  itemDescription?: string;
}

const VIOLATION_REASONS = [
  { id: 'misinformation', label: 'Inaccurate Sighting or False Telemetry', desc: 'Fabricated location or misleading recovery information' },
  { id: 'harassment', label: 'Harassment or Extortion Attempt', desc: 'Demands for courier payments, wire fees, or intimidation' },
  { id: 'spam', label: 'Spam or Commercial Solicitation', desc: 'Unrelated promotional links or bot messages' },
  { id: 'safety_concern', label: 'Immediate Safety or Animal Welfare Concern', desc: 'Dangerous recovery situation or animal in critical danger' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  postId,
  replyId,
  itemDescription = 'content',
}) => {
  const [reason, setReason] = useState('misinformation');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      setStatus('idle');
      setErrorMessage('');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const payload: { reason: string; post_id?: string; reply_id?: string } = { reason };
      if (postId) payload.post_id = postId;
      if (replyId) payload.reply_id = replyId;

      const res = await fetch('/api/v1/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to submit report');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Unable to submit report. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white border border-[var(--color-border)] w-full max-w-lg rounded-sm p-6 sm:p-8 shadow-xl outline-none relative"
      >
        <button
          onClick={onClose}
          aria-label="Close moderation report dialog"
          className="absolute top-4 right-4 min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/20 flex items-center justify-center text-[var(--color-alert-clay)]">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--color-ink-soft)] uppercase block">
              CIVIC MODERATION DESK
            </span>
            <h2 id="report-modal-title" className="text-xl font-serif font-bold text-[var(--color-ink)]">
              Report Community Item
            </h2>
          </div>
        </div>

        {status === 'success' ? (
          <div className="py-8 text-center" role="status" aria-live="polite">
            <CheckCircle2 className="w-12 h-12 text-[var(--color-trail)] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[var(--color-ink)]">Report Filed</h3>
            <p className="text-xs text-[var(--color-ink-soft)] font-mono mt-1">
              Thank you for safeguarding the community ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[var(--color-ink-soft)]">
              Flagging {itemDescription} for review by neighborhood guardians:
            </p>

            <fieldset className="space-y-2">
              <legend className="sr-only">Violation reason</legend>
              {VIOLATION_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 p-3 border rounded-sm cursor-pointer transition-all ${
                    reason === r.id
                      ? 'border-[var(--color-alert-clay)] bg-[var(--color-alert-clay)]/5'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-bone)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="violation_reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 accent-[var(--color-alert-clay)] min-w-[20px] min-h-[20px]"
                  />
                  <div>
                    <span className="text-xs font-bold font-mono text-[var(--color-ink)] block uppercase">
                      {r.label}
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-soft)] block mt-0.5">
                      {r.desc}
                    </span>
                  </div>
                </label>
              ))}
            </fieldset>

            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex-1 min-h-[48px] sm:min-h-[44px] px-4 py-2.5 bg-[var(--color-alert-clay)] text-white text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:opacity-90 active:translate-y-[1px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <Flag className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Submitting...' : 'Submit Report'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] sm:min-h-[44px] px-4 py-2.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-bone)] active:translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
