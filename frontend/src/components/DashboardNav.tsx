import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldAlert, ScanLine, List, LogOut, User } from 'lucide-react';

export const DashboardNav = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout failed:', e);
    }
    logout();
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Rail */}
      <nav className="hidden md:flex flex-col w-64 bg-[#FAF6F0] border-r border-[#E8E0D5] h-screen sticky top-0 px-6 py-8">
        <Link to="/dashboard" className="text-2xl font-bold text-brand-orange mb-12 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded">SafePaws</Link>
        <div className="flex flex-col gap-2 flex-1">
          <Link 
            to="/scan" 
            className="flex items-center gap-3 px-4 py-3 bg-brand-orange text-white rounded-xl font-medium hover:bg-[#C55A1F] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
            aria-label="Scan a dog"
          >
            <ScanLine size={20} />
            Scan a dog
          </Link>
          <div className="h-4"></div>
          
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange ${
              isCurrent('/dashboard') ? 'bg-safe-neutral text-brand-dark' : 'text-[#8B847B] hover:bg-[#F3EFE9] hover:text-brand-dark'
            }`}
          >
            <List size={20} />
            My pets
          </Link>

          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left focus:outline-none focus:ring-2 focus:ring-brand-orange ${
              isCurrent('/alerts') ? 'bg-safe-neutral text-brand-dark' : 'text-[#8B847B] hover:bg-[#F3EFE9] hover:text-brand-dark'
            }`}
          >
            <ShieldAlert size={20} />
            Alerts
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3">
            {user?.picture ? (
              <img src={user.picture} alt={user?.name || 'User'} className="w-10 h-10 rounded-full border-2 border-brand-orange" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-safe-neutral flex items-center justify-center text-brand-dark font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <span className="font-medium text-brand-dark truncate">{user?.name || 'Account'}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-alert-clay hover:bg-red-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-alert-clay"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FAF6F0] border-t border-[#E8E0D5] px-6 py-3 flex items-center justify-between z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded ${isCurrent('/dashboard') ? 'text-brand-dark' : 'text-[#8B847B]'}`}
        >
          <List size={24} />
          <span className="text-xs font-medium">My pets</span>
        </Link>
        <Link 
          to="/scan" 
          className="flex flex-col items-center gap-1 -mt-8 focus:outline-none"
          aria-label="Scan a dog"
        >
          <div className="w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#FAF6F0] transition-transform hover:scale-105 focus:ring-4 focus:ring-brand-orange/50">
            <ScanLine size={28} />
          </div>
          <span className="text-xs font-medium text-brand-orange mt-1">Scan</span>
        </Link>
        <button 
          onClick={handleLogout} 
          className="flex flex-col items-center gap-1 text-[#8B847B] focus:outline-none focus:ring-2 focus:ring-alert-clay rounded"
        >
          <User size={24} />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
};
