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
        // 서버 측 로그아웃 요청 (토큰 무효화)
        // 실패하더라도 클라이언트 로그아웃 처리는 계속 진행합니다.
        try {
          await client.post('/auth/logout');
        } catch {
          // 서버 로그아웃 실패 시 조용히 실패 처리
        }
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
        });
      },
      /**
       * 사용자가 참여 중인 챌린지 목록을 서버와 동기화합니다.
       * - 로그인 상태이고 액세스 토큰이 있을 때만 동작합니다.
       * - '/challenges/me' API를 호출하여 참여 중인 챌린지 ID 목록을 가져옵니다.
       */
      syncParticipatingChallenges: async () => {
        const { isLoggedIn, accessToken, user } = get();
        // 로그인하지 않았거나 토큰/유저 정보가 없으면 중단
        if (!isLoggedIn || !accessToken || !user) return;

        try {
          const response = await client.get<ChallengeInfo[] | { challenges?: ChallengeInfo[], content?: ChallengeInfo[] }>('/challenges/me', { params: { status: 'participating' } });

          // API 응답 구조 유연하게 처리 (배열 또는 객체 감싸짐)
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
          console.log('✅ 참여 챌린지 동기화 완료:', challengeIds);
        } catch (error) {
          console.error('❌ 참여 챌린지 동기화 실패:', error);
        }
      },
      /**
       * 사용자 프로필 정보를 최신 상태로 갱신합니다.
       * - 잔액 변경, 정보 수정 등 변경 사항을 스토어에 반영하기 위해 사용됩니다.
       */
      refreshUser: async () => {
        const { isLoggedIn } = get();
        if (!isLoggedIn) return;
        try {
          const { getMyProfile } = await import('@/lib/api/user');
          const userData = await getMyProfile();
          set({ user: normalizeUser(userData) });
        } catch (error) {
          console.error('사용자 정보 갱신 실패:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
