import { create } from 'zustand';
import type { User } from '@/types/domain';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
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
  }
};

export const useAuthStore = create<AuthState>((set) => ({
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
}));

