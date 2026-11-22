import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldAlert, ScanLine, List, LogOut, User, MessageSquare, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from './ui/Dialog';
import { Button } from './ui/Button';

export const DashboardNav = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setShowLogoutConfirm(false);
      window.location.href = '/';
    }
  };

  const isCurrent = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/pets');
    }
    if (path === '/lost') {
      return location.pathname.startsWith('/lost') || location.pathname.startsWith('/alerts');
    }
    if (path === '/community') {
      return location.pathname.startsWith('/community');
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation Rail */}
      <nav 
        aria-label="Main sidebar navigation" 
        className="hidden md:flex flex-col w-64 bg-[var(--color-bone)] border-r border-[var(--color-border)] h-screen sticky top-0 px-6 py-8 select-none"
      >
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="text-[length:var(--text-section-heading)] font-serif font-bold text-[var(--color-accent-text)] mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-12)] inline-block transition-opacity hover:opacity-90"
        >
          SafePaws
        </Link>

        <div className="flex flex-col gap-2 flex-1">
          {/* Quick Scan Action */}
          <Link 
            to="/scan" 
            className="flex items-center gap-3 px-4 py-3 bg-[var(--color-marigold)] text-[var(--color-ink)] rounded-[var(--radius-16)] font-semibold hover:bg-[var(--color-accent-hover)] transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] min-h-[44px]"
            aria-label="Scan a dog"
          >
            <ScanLine size={20} className="shrink-0" />
            <span>Scan a dog</span>
          </Link>
          
          <div className="h-4" role="separator" />
          
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            aria-current={isCurrent('/dashboard') ? 'page' : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[44px] ${
              isCurrent('/dashboard') 
                ? 'bg-white text-[var(--color-ink)] shadow-sm font-semibold' 
                : 'text-[var(--color-ink-soft)] hover:bg-black/5 hover:text-[var(--color-ink)]'
            }`}
          >
            <List size={20} className="shrink-0" />
            <span>My pets</span>
          </Link>

          <Link 
            to="/lost"
            aria-current={isCurrent('/lost') ? 'page' : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[44px] ${
              isCurrent('/lost') 
                ? 'bg-white text-[var(--color-ink)] shadow-sm font-semibold' 
                : 'text-[var(--color-ink-soft)] hover:bg-black/5 hover:text-[var(--color-ink)]'
            }`}
          >
            <ShieldAlert size={20} className="shrink-0" />
            <span>Alerts</span>
          </Link>

          <Link 
            to="/community"
            aria-current={isCurrent('/community') ? 'page' : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] min-h-[44px] ${
              isCurrent('/community') 
                ? 'bg-white text-[var(--color-ink)] shadow-sm font-semibold' 
                : 'text-[var(--color-ink-soft)] hover:bg-black/5 hover:text-[var(--color-ink)]'
            }`}
          >
            <MessageSquare size={20} className="shrink-0" />
            <span>Community</span>
          </Link>
        </div>

        {/* User Card & Logout Trigger */}
        <div className="mt-auto flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user?.name || 'Owner Profile'} 
                    className="w-10 h-10 rounded-full border-2 border-[var(--color-accent-text)] object-cover" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-ink)] font-bold shadow-sm border border-[var(--color-border)]">
                    {user?.name?.charAt(0) || 'O'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="block text-[length:var(--text-label-button)] text-[var(--color-ink)] font-semibold truncate">
                    {user?.name || 'Account'}
                  </span>
                  <span className="block text-xs text-[var(--color-ink-soft)] truncate">
                    {user?.neighborhood || 'Guardian'}
                  </span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowLogoutConfirm(true)} 
                className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-16)] font-medium text-[var(--color-alert-clay)] hover:bg-[var(--color-alert-clay)]/10 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] min-h-[44px] cursor-pointer"
              >
                <LogOut size={20} className="shrink-0" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-[var(--radius-16)] font-semibold bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/90 transition-colors min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              aria-label="Sign In"
            >
              <User size={18} className="shrink-0" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav 
        aria-label="Mobile navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-bone)] border-t border-[var(--color-border)] px-4 py-2 flex items-center justify-between z-50 safe-area-pb shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      >
        <Link 
          to="/dashboard" 
          aria-current={isCurrent('/dashboard') ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px] px-2 ${
            isCurrent('/dashboard') ? 'text-[var(--color-ink)] font-bold' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          <List size={20} />
          <span className="text-[11px]">My pets</span>
        </Link>

        <Link 
          to="/lost" 
          aria-current={isCurrent('/lost') ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px] px-2 ${
            isCurrent('/lost') ? 'text-[var(--color-ink)] font-bold' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          <ShieldAlert size={20} />
          <span className="text-[11px]">Alerts</span>
        </Link>

        {/* Elevated Mobile Center Hub Scan */}
        <Link 
          to="/scan" 
          className="flex flex-col items-center gap-1 -mt-6 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] rounded-full"
          aria-label="Scan a dog"
        >
          <div className="w-13 h-13 bg-[var(--color-marigold)] rounded-full flex items-center justify-center text-[var(--color-ink)] shadow-lg border-2 border-[var(--color-bone)] transition-transform active:scale-95">
            <ScanLine size={24} />
          </div>
          <span className="text-[11px] text-[var(--color-accent-text)] font-bold tracking-tight">Scan</span>
        </Link>

        <Link 
          to="/community" 
          aria-current={isCurrent('/community') ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px] px-2 ${
            isCurrent('/community') ? 'text-[var(--color-ink)] font-bold' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          <MessageSquare size={20} />
          <span className="text-[11px]">Community</span>
        </Link>

        {isAuthenticated ? (
          <button 
            type="button"
            onClick={() => setShowLogoutConfirm(true)} 
            className="flex flex-col items-center justify-center gap-1 text-[var(--color-ink-soft)] hover:text-[var(--color-alert-clay)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px] px-2 cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="text-[11px]">Logout</span>
          </button>
        ) : (
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-1 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-12)] min-h-[44px] min-w-[44px] px-2 cursor-pointer"
            aria-label="Sign In"
          >
            <User size={20} />
            <span className="text-[11px]">Sign In</span>
          </Link>
        )}
      </nav>

      {/* Accessible Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-md p-6 sm:p-8 bg-[var(--color-bone)] border border-[var(--color-border)] rounded-[var(--radius-24)] shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            
            <DialogTitle className="font-serif text-2xl font-bold text-[var(--color-ink)] mb-2">
              Sign Out of SafePaws?
            </DialogTitle>
            
            <DialogDescription className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              You will need to sign in again to manage your pets and receive direct recovery updates.
            </DialogDescription>
            
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Stay Signed In
              </Button>
              <Button
                variant="danger"
                className="flex-1 min-h-[44px]"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
