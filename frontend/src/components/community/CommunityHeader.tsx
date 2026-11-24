import React from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';

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
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--color-border)] bg-white sticky top-0 z-20 select-none">
      <div className="flex items-center gap-3 flex-1">
        {isMobile && (
          <button 
            onClick={onMenuClick} 
            className="p-2.5 -ml-1 text-[var(--color-ink)] hover:bg-[var(--color-bone)] rounded-sm md:hidden min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            aria-label="Toggle channel navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="community-search-input" className="sr-only">
            Search community field records and sightings
          </label>
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input 
            id="community-search-input"
            type="text" 
            placeholder="Search field records, sightings, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-bone)] border border-[var(--color-border)] rounded-sm pl-10 pr-10 py-2.5 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-all min-h-[48px] sm:min-h-[44px] font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <button 
          onClick={onComposeClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-marigold)] text-[#1C1A17] text-xs font-mono font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--color-accent-hover)] active:translate-y-[1px] transition-all shadow-xs min-h-[48px] sm:min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          <Plus className="w-4 h-4" /> 
          <span className="hidden sm:inline">New Dispatch</span>
          <span className="sm:hidden">Post</span>
        </button>
      </div>
    </header>
  );
}
