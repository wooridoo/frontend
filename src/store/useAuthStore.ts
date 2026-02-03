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

const DUMMY_USER: User = {
  userId: 1,
  email: 'user@woorido.com',
  name: '김우리',
  nickname: '우리두',
  profileImage: 'https://i.pravatar.cc/150?u=woorido',
  status: UserStatus.ACTIVE, // Use Enum
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
  participatingChallengeIds: []
};

import { persist } from 'zustand/middleware';
import { UserStatus } from '@/types/enums';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      login: (userData, token) => set({
        isLoggedIn: true,
        user: userData || DUMMY_USER,
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

