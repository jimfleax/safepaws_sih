import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hash, AlertTriangle, Eye, MessageCircle, Heart, Shield, HelpCircle, Lightbulb, Stethoscope, Home } from 'lucide-react';

export const CHANNELS = [
  { id: 'urgent', label: 'Urgent', icon: <AlertTriangle size={18} />, color: 'text-red-500' },
  { id: 'lost-found', label: 'Lost & Found', icon: <SearchIcon size={18} />, color: 'text-amber-500' },
  { id: 'sightings', label: 'Sightings', icon: <Eye size={18} />, color: 'text-blue-500' },
  { id: 'general', label: 'General', icon: <MessageCircle size={18} />, color: 'text-emerald-500' },
  { id: 'pet-care', label: 'Pet Care', icon: <Stethoscope size={18} />, color: 'text-rose-500' },
  { id: 'rescue', label: 'Rescue & Shelters', icon: <Home size={18} />, color: 'text-indigo-500' },
  { id: 'adoption', label: 'Adoption', icon: <Heart size={18} />, color: 'text-pink-500' },
  { id: 'tips', label: 'Tips', icon: <Lightbulb size={18} />, color: 'text-yellow-500' },
];

function SearchIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
}

export function CommunityNav({ activeChannelId, onChannelSelect, isMobile, onClose }: { activeChannelId: string, onChannelSelect: (id: string) => void, isMobile?: boolean, onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] border-r border-[var(--color-border)] py-4 w-64 flex-shrink-0">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-black text-[var(--color-ink)] mb-1">Local Network</h2>
        <p className="text-xs text-[var(--color-ink-soft)]">Connaught Place & Surrounds</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {CHANNELS.map(c => {
          const isActive = activeChannelId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                onChannelSelect(c.id);
                if (isMobile && onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-[var(--color-background)] text-[var(--color-ink)] shadow-sm' 
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)]/5'
              }`}
            >
              <div className={`${isActive ? c.color : 'opacity-70'}`}>
                {c.icon}
              </div>
              {c.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
