import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';
import type { ChallengeInfo } from '@/types/challenge';
import { client } from '@/lib/api/client';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  login: (userData?: User, token?: string) => void;
  updateUser: (userData: User) => void;
  logout: () => Promise<void>;
  syncParticipatingChallenges: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

import { normalizeUser } from '@/lib/utils/dataMappers';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      login: (userData, token) => set({
        isLoggedIn: true,
        user: userData ? normalizeUser(userData) : null,
        accessToken: token || null,
      }),
      updateUser: (userData) => set({
        user: userData ? normalizeUser(userData) : null,
      }),
      logout: async () => {
        // 서버 측 토큰 무효화 시도 (실패해도 로컬 상태는 정리)
        try {
          await client.post('/auth/logout');
        } catch {
          // 서버 logout 실패해도 무시 — 로컬 정리가 우선
        }
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
        });
      },
      syncParticipatingChallenges: async () => {
        const { isLoggedIn, accessToken, user } = get();
        // accessToken이 없으면 API 호출하지 않음 (401 방지)
        if (!isLoggedIn || !accessToken || !user) return;

        try {
          const response = await client.get<ChallengeInfo[] | { challenges?: ChallengeInfo[], content?: ChallengeInfo[] }>('/challenges/me', { params: { status: 'participating' } });

          // client interceptor가 { success, data } wrapper를 벗겨서 data만 반환함
          // 백엔드 응답 구조: data가 배열이거나, { challenges: [...] } 형태일 수 있음
          const challenges = Array.isArray(response)
            ? response
            : (response.challenges || response.content || []);

          const challengeIds = challenges.map((c: ChallengeInfo) => c.challengeId);

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
      },
      refreshUser: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;
        try {
          const { getMyProfile } = await import('@/lib/api/user');
          const userData = await getMyProfile();
          set({ user: normalizeUser(userData) });
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
