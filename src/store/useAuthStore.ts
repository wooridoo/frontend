import { create } from 'zustand';
import type { User } from '@/types/domain';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
  joinChallenge: (challengeId: number) => void; // Simulation Action
}

const DUMMY_USER: User = {
  userId: 1,
  email: 'user@woorido.com',
  name: '김우리',
  nickname: '우리두',
  profileImage: 'https://i.pravatar.cc/150?u=woorido',
  status: 'ACTIVE',
  brix: 72.5,
  account: {
    accountId: 101,
    balance: 154000,
    availableBalance: 154000,
    lockedBalance: 0
  },
  stats: {
    challengeCount: 3,
    completedChallenges: 1,
    totalSupportAmount: 50000
  },
  participatingChallengeIds: [] // Default: Not joined any challenge (Test P0 Join Flow)
};

import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (userData) => set({
        isLoggedIn: true,
        user: userData || DUMMY_USER
      }),
      logout: () => set({
        isLoggedIn: false,
        user: null
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

