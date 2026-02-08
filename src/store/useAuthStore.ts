import { create } from 'zustand';
import type { User } from '@/types/domain';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null; // Added for API Client
  login: (userData?: User, token?: string) => void;
  logout: () => void;
  joinChallenge: (challengeId: number) => void; // Simulation Action
}



import { persist } from 'zustand/middleware';


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      login: (userData, token) => set({
        isLoggedIn: true,
        user: userData || null,
        accessToken: token || 'mock-access-token',
      }),
      logout: () => set({
        isLoggedIn: false,
        user: null,
        accessToken: null,
      }),
      joinChallenge: (challengeId: number) => set((state) => ({
        user: state.user ? {
          ...state.user,
          participatingChallengeIds: [...(state.user.participatingChallengeIds || []), challengeId]
        } : null
      }))
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);

