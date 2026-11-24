import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, X, LogIn, UserPlus } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionMessage?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  actionMessage = 'To publish community alerts or participate in recovery deliberations, please sign in to your SafePaws account.',
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus modal container
      modalRef.current?.focus();

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      aria-describedby="auth-prompt-desc"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white border border-[var(--color-border)] w-full max-w-md rounded-sm p-6 sm:p-8 shadow-xl outline-none relative"
      >
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-[var(--color-bone)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-text)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--color-ink-soft)] uppercase block">
              CIVIC SAFETY PROTOCOL
            </span>
            <h2 id="auth-prompt-title" className="text-xl font-serif font-bold text-[var(--color-ink)]">
              Neighborhood Sign-In
            </h2>
          </div>
        </div>

        <p id="auth-prompt-desc" className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
          {actionMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="flex-1 min-h-[48px] sm:min-h-[44px] px-4 py-2.5 bg-[var(--color-marigold)] text-[#1C1A17] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-accent-hover)] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/login?mode=register');
            }}
            className="flex-1 min-h-[48px] sm:min-h-[44px] px-4 py-2.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-bone)] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};
