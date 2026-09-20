import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  profileCompleted: boolean;
  phone?: string;
  neighborhood?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
  setProfileCompleted: (status: boolean) => void;
  updateProfile: (data: { phone: string; neighborhood: string }) => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setAuth: (user) => set({ user, isAuthenticated: true, isInitializing: false }),
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout failed on backend', e);
    }
    set({ user: null, isAuthenticated: false, isInitializing: false });
  },
  setProfileCompleted: (status) => 
    set((state) => ({
      user: state.user ? { ...state.user, profileCompleted: status } : null
    })),
  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data, profileCompleted: true } : null
    })),
  checkSession: async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        // /api/auth/me returns { id, name, email, phone, neighborhood, profileCompleted } directly
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          picture: data.picture || '',
          profileCompleted: data.profileCompleted ?? false,
          phone: data.phone,
          neighborhood: data.neighborhood,
        };
        set({ user, isAuthenticated: true, isInitializing: false });
      } else {
        set({ user: null, isAuthenticated: false, isInitializing: false });
      }
    } catch (err) {
      console.error('Failed to check session', err);
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },
}));

