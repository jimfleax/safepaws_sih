import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawIcon } from './Header';
import { Camera, Radio, MapPin, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenGuidelines?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenGuidelines,
  onOpenContact,
}) => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-16 pb-12 text-[var(--color-ink)]"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-[var(--color-border)]">
          {/* Brand & Mission Column (Col 1-2) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <div
              onClick={scrollToTop}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              title="SafePaws Home"
            >
              <div className="w-9 h-9 rounded-[var(--radius-12)] bg-[var(--color-bone)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink)] group-hover:bg-[var(--color-marigold)] transition-colors">
                <PawIcon className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[var(--color-ink)]">
                SafePaws
              </span>
            </div>

            <p className="text-sm text-[var(--color-ink-soft)] max-w-sm leading-relaxed mt-2">
              The world’s first non-invasive biometric identity and community recovery platform for dogs. Designed to turn any smartphone photo into an immutable reunion record.
            </p>

            <div className="flex items-center gap-2 text-xs text-[var(--color-ink-soft)] mt-4">
              <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" />
              <span>WCAG 2.1 Level AA Accessible</span>
            </div>
          </div>

          {/* Column 3: Recovery Tools */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif font-bold text-base text-[var(--color-ink)] tracking-tight mb-2">
              Recovery Tools
            </h4>
            <ul className="space-y-1 text-sm text-[var(--color-ink-soft)]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/scan')}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Biometric Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/lost/new')}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Report Lost Pet
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/sightings/new')}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Submit a Sighting
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/lost')}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Active Lost Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Network */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif font-bold text-base text-[var(--color-ink)] tracking-tight mb-2">
              Community Watch
            </h4>
            <ul className="space-y-1 text-sm text-[var(--color-ink-soft)]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/community')}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Local Scout Feed
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Pet Dossier Management
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuidelines}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Community Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Governance & Ethics */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif font-bold text-base text-[var(--color-ink)] tracking-tight mb-2">
              Governance & Safety
            </h4>
            <ul className="space-y-1 text-sm text-[var(--color-ink-soft)]">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Privacy Architecture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-[var(--color-accent-text)] transition-colors text-left min-h-[44px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
                >
                  Emergency Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-ink-soft)]">
          <p>© {new Date().getFullYear()} SafePaws Biometrics. Built for safety, powered by community.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors font-medium p-2 rounded-lg hover:bg-[var(--color-bone)] min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
