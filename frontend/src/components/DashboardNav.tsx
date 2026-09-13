import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardNav = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout failed:', e);
    }
    logout();
  };

  return (
    <nav className="w-full bg-[#FAF6F0] border-b border-[#E8E0D5] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-2xl font-bold text-[#DE6828]">SafePaws</Link>
        <div className="hidden md:flex gap-6">
          <Link to="/dashboard" className="text-[#241812] hover:text-[#DE6828] font-medium transition-colors">Home</Link>
          <button className="text-[#8B847B] hover:text-[#DE6828] font-medium transition-colors">Trackings</button>
          <button className="text-[#8B847B] hover:text-[#DE6828] font-medium transition-colors">Community</button>
          <button className="text-[#8B847B] hover:text-[#DE6828] font-medium transition-colors">Health</button>
          <button className="text-[#8B847B] hover:text-[#DE6828] font-medium transition-colors">Groom</button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user?.picture ? (
          <img src={user.picture} alt={user?.name || 'User'} className="w-10 h-10 rounded-full border-2 border-[#DE6828]" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center text-[#241812] font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
        <button onClick={handleLogout} className="text-sm font-medium text-red-600 cursor-pointer ml-2">Logout</button>
      </div>
    </nav>
  );
};
