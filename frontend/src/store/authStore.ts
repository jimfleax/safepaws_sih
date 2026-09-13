import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  profileCompleted: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
  setProfileCompleted: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setProfileCompleted: (status) => 
        set((state) => ({
          user: state.user ? { ...state.user, profileCompleted: status } : null
        })),
    }),
    {
      name: 'safepaws-auth',
    }
  )
);
