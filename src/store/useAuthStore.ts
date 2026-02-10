import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';
import { client } from '@/lib/api/client';
import type { ChallengeInfo } from '@/types/challenge';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  login: (userData?: User, token?: string) => void;
  logout: () => void;
  syncParticipatingChallenges: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      login: (userData, token) => set({
        isLoggedIn: true,
        user: userData || null,
        accessToken: token || null,
      }),
      logout: () => set({
        isLoggedIn: false,
        user: null,
        accessToken: null,
      }),
      syncParticipatingChallenges: async () => {
        const { isLoggedIn, user } = get();
        if (!isLoggedIn || !user) return;

        try {
          // Direct client call to avoid circular dependency with challenge.ts
          // The response structure is { success: true, data: { content: [...] }, ... } -> handled by client interceptor
          // BUT getChallenges/getMyChallenges usually returns T[] or { content: T[] }.
          // Let's match the getMyChallenges implementation logic:
          // return client.get<{ content: ChallengeInfo[] }>('/challenges/me', { params: { status } });

          const response = await client.get<any>('/challenges/me', { params: { status: 'participating' } });
          console.log('🔍 Sync participating response:', response);

          const content = response?.content;
          if (!content) {
            console.warn('⚠️ No content found in response');
            return;
          }

          const challengeIds = content.map((c: any) => c.challengeId);

          set({
            user: {
              ...user,
              participatingChallengeIds: challengeIds
            }
          });
          console.log('✅ Synced participating challenges:', challengeIds);
        } catch (error) {
          console.error('❌ Failed to sync participating challenges:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
