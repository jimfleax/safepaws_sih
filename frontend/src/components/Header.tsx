import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

import { User, Bell, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenCommunity: () => void;
  onOpenFeatures: () => void;
  onOpenProfile: () => void;
  onOpenAlerts: () => void;
  onOpenIdentify: () => void;
  activeAlertCount?: number;
}

export const PawIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* 4 toe pads */}
    <ellipse cx="6.5" cy="8" rx="2" ry="2.8" />
    <ellipse cx="11" cy="5.5" rx="2.1" ry="3" />
    <ellipse cx="15.5" cy="6" rx="2" ry="2.9" />
    <ellipse cx="19" cy="9.5" rx="1.8" ry="2.5" />
    {/* main pad */}
    <path d="M12 11.5c-3.2 0-5.8 2.2-5.5 5.5.2 2.2 2.2 4 5.5 4s5.3-1.8 5.5-4c.3-3.3-2.3-5.5-5.5-5.5z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onOpenCommunity,
  onOpenFeatures,
  onOpenProfile,
  onOpenAlerts,
  onOpenIdentify,
  activeAlertCount = 1,
}) => {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setAuth({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture,
            profileCompleted: data.user.profileCompleted
          });
          
          if (!data.user.profileCompleted) {
            navigate('/setup-profile');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to authenticate with backend', err);
      }
    },
    onError: (error) => console.error('Login Failed', error),
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      logout();
      navigate('/');
    }
  };

  const navItems = [
    { id: 'how-it-works', label: 'How it works', action: onOpenHowItWorks },
    { id: 'community', label: 'Community', action: onOpenCommunity, hasBadge: true },
    { id: 'features', label: 'Features', action: onOpenFeatures },
    { id: 'identify', label: 'Identify', action: onOpenIdentify },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-4 pb-2 transition-all">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo - scrolls smoothly to the top of the page */}
        <div
          id="nav-brand-logo"
          className="flex items-center gap-2.5 cursor-pointer select-none group py-1.5 px-3 rounded-[var(--radius-16)] hover:bg-[#F3EFE9] transition-all duration-[var(--animate-duration-page)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] min-h-[44px]"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="SafePaws"
        >
          <div className="w-9 h-9 rounded-[var(--radius-12)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center justify-center text-[var(--color-ink)] transition-transform group-hover:scale-105">
            <PawIcon className="w-5 h-5 text-[var(--color-ink)]" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-[var(--color-ink)]">
            SafePaws
          </span>
        </div>

        {/* Center Nav Links - Inside glassmorphism pill */}
        <nav
          onMouseLeave={() => setHoveredNav(null)}
          className="hidden md:flex items-center gap-2 py-1.5 px-6 rounded-full bg-[var(--color-surface-raised)] hover:bg-white backdrop-blur-2xl border border-[var(--color-border)] shadow-sm text-[length:var(--text-label-button)] transition-all duration-[var(--animate-duration-page)]"
        >
          {navItems.map((item) => {
            const isHovered = hoveredNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={item.action}
                onMouseEnter={() => setHoveredNav(item.id)}
                className="relative px-5 py-2 rounded-full cursor-pointer transition-colors duration-[var(--animate-duration-micro)] select-none focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] min-h-[44px]"
              >
                {/* Sliding Glass Background Pill */}
                {isHovered && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-white backdrop-blur-md border border-[var(--color-border)] shadow-sm"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}

                {/* Button Content */}
                <span
                  className={`relative z-10 flex items-center gap-2 transition-all duration-[var(--animate-duration-micro)] ${
                    isHovered
                      ? 'text-[var(--color-accent)] font-semibold translate-y-[-0.5px]'
                      : 'text-[var(--color-ink-soft)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasBadge && activeAlertCount > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] ${
                          isHovered ? 'animate-ping opacity-90 scale-125' : 'animate-ping opacity-75'
                        }`}
                      />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)] shadow-[0_0_6px_rgba(226,129,31,0.8)]" />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Alert Bell button */}
          <motion.button
            id="header-alert-bell-btn"
            onClick={onOpenAlerts}
            title="Neighborhood Lost Pet Radar"
            whileHover="hover"
            whileTap={{ scale: 0.92 }}
            className="hidden sm:flex relative p-2.5 rounded-[var(--radius-12)] text-[var(--color-ink-soft)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface)] active:bg-[var(--color-surface)] backdrop-blur-md border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-[var(--animate-duration-dialog)] cursor-pointer group min-h-[44px] min-w-[44px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
            aria-label="Lost Pet Alerts"
          >
            {/* Dynamic light sheen reflection on hover */}
            <div className="absolute inset-0 rounded-[var(--radius-12)] overflow-hidden pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </div>

            {/* Animated Chime Bell Icon */}
            <motion.div
              variants={{
                hover: {
                  rotate: [0, -14, 12, -8, 4, 0],
                  transition: { duration: 0.55, ease: 'easeInOut' },
                },
              }}
              className="relative z-10 origin-top"
            >
              <Bell className="w-5 h-5 text-[var(--color-ink-soft)] group-hover:text-[var(--color-accent)] transition-colors duration-[var(--animate-duration-micro)]" />
            </motion.div>

            {/* Notification Badge */}
            {activeAlertCount > 0 && (
              <motion.span
                variants={{
                  hover: { scale: 1.25 },
                }}
                className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--color-accent)] group-hover:bg-[var(--color-accent-hover)] rounded-full border-2 border-[var(--color-surface)] shadow-sm z-20 transition-colors"
              />
            )}
          </motion.button>

          {/* Authentication & Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <img src={user?.picture || 'https://via.placeholder.com/40'} alt="Profile" className="w-10 h-10 rounded-full cursor-pointer border-2 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" onClick={onOpenProfile} />
              <button onClick={handleLogout} className="hidden sm:block text-[length:var(--text-label-button)] font-medium text-[var(--color-danger)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] rounded px-2 py-1 min-h-[44px]">Logout</button>
            </div>
          ) : (
            <button onClick={() => googleLogin()} className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-[var(--radius-12)] text-[length:var(--text-label-button)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 min-h-[44px] transition-colors">Sign In</button>
          )}

          {/* Mobile Menu Affordance */}
          <button 
            className="md:hidden p-2 rounded-[var(--radius-12)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
