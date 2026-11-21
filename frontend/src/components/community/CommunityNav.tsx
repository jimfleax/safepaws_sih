import React from 'react';
import { 
  AlertTriangle, 
  Eye, 
  MessageCircle, 
  Heart, 
  Search,
  Lightbulb, 
  Stethoscope, 
  Home 
} from 'lucide-react';

export const CHANNELS = [
  { id: 'urgent', label: 'Urgent Alerts', icon: <AlertTriangle size={16} />, color: 'text-[var(--color-alert-clay)]' },
  { id: 'lost-found', label: 'Lost & Found', icon: <Search size={16} />, color: 'text-[var(--color-marigold)]' },
  { id: 'sightings', label: 'Field Sightings', icon: <Eye size={16} />, color: 'text-emerald-600' },
  { id: 'general', label: 'General Network', icon: <MessageCircle size={16} />, color: 'text-[var(--color-ink)]' },
  { id: 'pet-care', label: 'Pet Health & Care', icon: <Stethoscope size={16} />, color: 'text-rose-600' },
  { id: 'rescue', label: 'Rescue & Shelters', icon: <Home size={16} />, color: 'text-indigo-600' },
  { id: 'adoption', label: 'Adoption Desk', icon: <Heart size={16} />, color: 'text-pink-600' },
  { id: 'tips', label: 'Field Tips', icon: <Lightbulb size={16} />, color: 'text-amber-600' },
];

export function CommunityNav({ 
  activeChannelId, 
  onChannelSelect, 
  isMobile, 
  onClose 
}: { 
  activeChannelId: string; 
  onChannelSelect: (id: string) => void; 
  isMobile?: boolean; 
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white py-5 w-64 flex-shrink-0 select-none">
      <div className="px-5 mb-5">
        <h2 className="text-base font-serif font-bold text-[var(--color-ink)] mb-0.5">Community Network</h2>
        <p className="text-xs text-[var(--color-ink-soft)] font-light">Local Neighborhood Channels</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {CHANNELS.map(c => {
          const isActive = activeChannelId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                onChannelSelect(c.id);
                if (isMobile && onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[44px] ${
                isActive 
                  ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs border border-[var(--color-border)]' 
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className={isActive ? c.color : 'opacity-60'}>
                {c.icon}
              </div>
              <span className="truncate">{c.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-marigold)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}