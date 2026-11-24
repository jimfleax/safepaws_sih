import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Search, Eye, Sparkles } from 'lucide-react';

export type CommunityChannel = 'general' | 'lost-found' | 'sightings' | 'reunion-stories';

export interface ChannelConfig {
  id: CommunityChannel;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}

export const CANONICAL_CHANNELS: ChannelConfig[] = [
  { 
    id: 'general', 
    label: 'General Network', 
    shortLabel: 'General', 
    icon: <MessageSquare className="w-4 h-4 shrink-0" />,
    description: 'Local advice, vet recommendations & neighborhood chat' 
  },
  { 
    id: 'lost-found', 
    label: 'Lost & Found', 
    shortLabel: 'Lost & Found', 
    icon: <Search className="w-4 h-4 shrink-0" />,
    description: 'Active missing companion search beacons & alerts' 
  },
  { 
    id: 'sightings', 
    label: 'Field Sightings', 
    shortLabel: 'Sightings', 
    icon: <Eye className="w-4 h-4 shrink-0" />,
    description: 'Timestamped citizen observations of roaming animals' 
  },
  { 
    id: 'reunion-stories', 
    label: 'Reunion Stories', 
    shortLabel: 'Reunions', 
    icon: <Sparkles className="w-4 h-4 shrink-0" />,
    description: 'Confirmed recovery milestones & civic gratitude' 
  },
];

interface CommunityChannelFilterBarProps {
  activeChannel: CommunityChannel;
  onChange: (channel: CommunityChannel) => void;
  className?: string;
  counts?: Partial<Record<CommunityChannel, number>>;
}

export const CommunityChannelFilterBar: React.FC<CommunityChannelFilterBarProps> = ({
  activeChannel,
  onChange,
  className = '',
  counts = {},
}) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % CANONICAL_CHANNELS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + CANONICAL_CHANNELS.length) % CANONICAL_CHANNELS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = CANONICAL_CHANNELS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextChannel = CANONICAL_CHANNELS[nextIndex].id;
    onChange(nextChannel);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Community Channels"
      className={`flex items-center gap-1.5 p-1.5 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-sm overflow-x-auto no-scrollbar ${className}`}
    >
      {CANONICAL_CHANNELS.map((ch, idx) => {
        const isActive = activeChannel === ch.id;
        const count = counts[ch.id];

        return (
          <button
            key={ch.id}
            ref={(el) => { tabsRef.current[idx] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${ch.id}`}
            id={`tab-${ch.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(ch.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative min-h-[48px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-sm transition-colors z-10 whitespace-nowrap flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bone)] ${
              isActive 
                ? 'text-[#1C1A17]' 
                : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="channel-active-indicator"
                className="absolute inset-0 bg-white border border-[var(--color-border)] shadow-xs rounded-sm -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <span className={`${isActive ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-ink-soft)]'}`}>
              {ch.icon}
            </span>
            <span className="hidden sm:inline">{ch.label}</span>
            <span className="sm:hidden">{ch.shortLabel}</span>
            {count !== undefined && count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isActive 
                  ? 'bg-[var(--color-bone)] text-[var(--color-ink)]' 
                  : 'bg-white/80 text-[var(--color-ink-soft)]'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
