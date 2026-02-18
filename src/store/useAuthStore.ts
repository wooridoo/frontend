import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { client } from '@/lib/api/client';
import { getMyChallenges } from '@/lib/api/challenge';
import { normalizeUser } from '@/lib/utils/dataMappers';
import type { User } from '@/types/user';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (userData?: User, accessToken?: string, refreshToken?: string) => void;
  updateUser: (userData: User) => void;
  logout: () => Promise<void>;
  syncParticipatingChallenges: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (userData, accessToken, refreshToken) =>
        set({
          isLoggedIn: true,
          user: userData ? normalizeUser(userData) : null,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        }),

      updateUser: userData =>
        set({
          user: userData ? normalizeUser(userData) : null,
        }),

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            await client.post('/auth/logout', { refreshToken });
          }
        } catch {
          // Ignore API failure and clear local auth state anyway.
        }

        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      syncParticipatingChallenges: async () => {
        const { isLoggedIn, accessToken, user } = get();
        if (!isLoggedIn || !accessToken || !user) return;

        try {
          const challenges = await getMyChallenges('participating');
          const participatingChallengeIds = Array.from(
            new Set(challenges.map(challenge => String(challenge.challengeId)))
          );

          set({
            user: {
              ...user,
              participatingChallengeIds,
            },
          });
        } catch (error) {
          console.error('Failed to sync participating challenges:', error);
        }
      },

      refreshUser: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;

        try {
          const { getMyProfile } = await import('@/lib/api/user');
          const userData = await getMyProfile();
          set({ user: normalizeUser(userData) });
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
