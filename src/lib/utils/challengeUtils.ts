import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/api/client';

/**
 * 챌린지 참여 여부 확인 (Helper)
 */
export function isParticipant(challengeId: string): boolean {
  const { user } = useAuthStore.getState();
  return user?.participatingChallengeIds?.includes(challengeId) ?? false;
}

/**
 * 챌린지 접근 권한 검증 (Helper)
 */
export function validateChallengeAccess(challengeId: string): void {
  const { isLoggedIn, user } = useAuthStore.getState();
  if (!isLoggedIn || !user) throw new ApiError('로그인이 필요합니다.', 401);

  if (!user.participatingChallengeIds?.includes(challengeId)) {
    throw new ApiError('해당 챌린지에 참여하지 않았습니다.', 403);
  }
}
