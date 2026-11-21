import React from 'react';
import { Search, Plus, Menu } from 'lucide-react';

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
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--color-border)] bg-white sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1">
        {isMobile && (
          <button 
            onClick={onMenuClick} 
            className="p-2.5 -ml-1 text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-xl md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search community posts & sightings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--color-ink)] placeholder:[var(--color-ink-soft)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] transition-all min-h-[44px]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <button 
          onClick={onComposeClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-ink)] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#2A2723] transition-all shadow-xs min-h-[44px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          <Plus size={16} /> 
          <span className="hidden sm:inline">New Post</span>
        </button>
      </div>
    </div>
  );
}