import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/api/client';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function isParticipant(challengeId: string): boolean {
  const normalizedChallengeId = resolveChallengeId(challengeId);
  const { user } = useAuthStore.getState();
  return user?.participatingChallengeIds?.includes(normalizedChallengeId) ?? false;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function validateChallengeAccess(challengeId: string): void {
  const normalizedChallengeId = resolveChallengeId(challengeId);
  const { isLoggedIn, user } = useAuthStore.getState();

  if (!isLoggedIn || !user) {
    throw new ApiError('로그인이 필요합니다.', 401);
  }

  if (!user.participatingChallengeIds?.includes(normalizedChallengeId)) {
    throw new ApiError('챌린지 접근 권한이 없습니다.', 403);
  }
}
