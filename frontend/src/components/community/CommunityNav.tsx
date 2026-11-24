import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Eye, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { CANONICAL_CHANNELS, CommunityChannel } from './CommunityChannelFilterBar';

export { CANONICAL_CHANNELS };
export type { CommunityChannel };

export function CommunityNav({ 
  activeChannelId, 
  onChannelSelect, 
  isMobile, 
  onClose,
  channelCounts = {},
}: { 
  activeChannelId: string; 
  onChannelSelect: (id: CommunityChannel) => void; 
  isMobile?: boolean; 
  onClose?: () => void;
  channelCounts?: Partial<Record<CommunityChannel, number>>;
}) {
  return (
    <nav 
      aria-label="Community Channels Navigation"
      className="flex flex-col h-full bg-white py-6 w-64 flex-shrink-0 select-none border-r border-[var(--color-border)]"
    >
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-trail)]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-ink-soft)] uppercase">
            SECTOR DISPATCH
          </span>
        </div>
        <h2 className="text-lg font-serif font-bold text-[var(--color-ink)] leading-snug">
          Field Channels
        </h2>
        <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
          Municipal search & recovery ledger
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1.5" role="list">
        {CANONICAL_CHANNELS.map(c => {
          const isActive = activeChannelId === c.id;
          const count = channelCounts[c.id];

          return (
            <button
              key={c.id}
              role="listitem"
              aria-pressed={isActive}
              onClick={() => {
                onChannelSelect(c.id);
                if (isMobile && onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-left transition-all min-h-[48px] sm:min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isActive 
                  ? 'bg-[var(--color-bone)] border-l-4 border-l-[var(--color-marigold)] text-[#1C1A17] font-bold shadow-xs' 
                  : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)]/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className={`shrink-0 ${isActive ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-ink-soft)]'}`}>
                  {c.icon}
                </span>
                <span className="text-xs font-mono tracking-wider uppercase truncate">
                  {c.label}
                </span>
              </div>

              {count !== undefined && count > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                  isActive 
                    ? 'bg-white text-[var(--color-ink)] border border-[var(--color-border)]' 
                    : 'bg-[var(--color-bone)] text-[var(--color-ink-soft)]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 mx-3 mt-4 border-t border-[var(--color-border)] bg-[var(--color-bone)]/60 rounded-sm">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-alert-clay)]" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--color-ink)]">
            Incident Ground Truth
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-ink-soft)] leading-normal">
          Field reports are citizen-logged. Coordinate in public daylight corridors.
        </p>
      </div>
    </nav>
  );
}
