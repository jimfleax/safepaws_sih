import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldAlert, ScanLine, List, LogOut, User } from 'lucide-react';

export const DashboardNav = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Rail */}
      <nav className="hidden md:flex flex-col w-64 bg-[var(--color-background)] border-r border-[var(--color-border)] h-screen sticky top-0 px-6 py-8">
        <Link to="/dashboard" className="text-[length:var(--text-section-heading)] font-serif font-bold text-[var(--color-accent)] mb-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] rounded-[var(--radius-12)]">SafePaws</Link>
        <div className="flex flex-col gap-2 flex-1">
          <Link 
            to="/scan" 
            className="flex items-center gap-3 px-4 py-3 bg-[var(--color-accent)] text-white rounded-[var(--radius-16)] font-medium hover:bg-[var(--color-accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-focus)] min-h-[44px]"
            aria-label="Scan a dog"
          >
            <ScanLine size={20} />
            Scan a dog
          </Link>
          <div className="h-4"></div>
          
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] min-h-[44px] ${
              isCurrent('/dashboard') ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-soft)] hover:bg-black/5 hover:text-[var(--color-ink)]'
            }`}
          >
            <List size={20} />
            My pets
          </Link>

          <Link 
            to="/lost"
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] min-h-[44px] ${
              isCurrent('/lost') ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-soft)] hover:bg-black/5 hover:text-[var(--color-ink)]'
            }`}
          >
            <ShieldAlert size={20} />
            Alerts
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
          <div className="flex items-center gap-3 px-4 py-3">
            {user?.picture ? (
              <img src={user.picture} alt={user?.name || 'User'} className="w-10 h-10 rounded-full border-2 border-[var(--color-accent)]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-ink)] font-bold shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <span className="text-[length:var(--text-label-button)] text-[var(--color-ink)] truncate">{user?.name || 'Account'}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium text-[var(--color-danger)] hover:bg-black/5 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] min-h-[44px]"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-background)] border-t border-[var(--color-border)] px-6 py-3 flex items-center justify-between z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px] ${isCurrent('/dashboard') ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'}`}
        >
          <List size={24} />
          <span className="text-[length:var(--text-metadata)]">My pets</span>
        </Link>
        <Link 
          to="/scan" 
          className="flex flex-col items-center gap-1 -mt-8 focus:outline-none"
          aria-label="Scan a dog"
        >
          <div className="w-14 h-14 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[var(--color-background)] transition-transform hover:scale-105 focus:ring-4 focus:ring-[var(--color-focus)]">
            <ScanLine size={28} />
          </div>
          <span className="text-[length:var(--text-metadata)] text-[var(--color-accent)] mt-1 font-medium">Scan</span>
        </Link>
        <button 
          onClick={handleLogout} 
          className="flex flex-col items-center justify-center gap-1 text-[var(--color-ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px]"
        >
          <User size={24} />
          <span className="text-[length:var(--text-metadata)]">Logout</span>
        </button>
      </nav>
    </>
  );
};
