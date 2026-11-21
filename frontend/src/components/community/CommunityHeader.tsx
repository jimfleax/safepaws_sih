import React from 'react';
import { Search, Plus, Filter, Menu, Bell } from 'lucide-react';

export function CommunityHeader({ 
  searchQuery, 
  setSearchQuery, 
  onComposeClick,
  onMenuClick,
  isMobile
}: { 
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onComposeClick: () => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1">
        {isMobile && (
          <button onClick={onMenuClick} className="p-2 -ml-2 text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 rounded-lg">
            <Menu size={20} />
          </button>
        )}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search community posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <button className="relative p-2 text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)]/5 rounded-full transition-colors">
          <Bell size={20} />
          {/* Subtle unread indicator */}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--color-accent)] border-2 border-[var(--color-surface)] rounded-full"></span>
        </button>

        <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[var(--color-ink)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-ink)]/5 transition-colors">
          <Filter size={16} /> Filters
        </button>
        <button 
          onClick={onComposeClick}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-sm"
        >
          <Plus size={16} /> <span className="hidden sm:inline">New Post</span>
        </button>
      </div>
    </div>
  );
}
