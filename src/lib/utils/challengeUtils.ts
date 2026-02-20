import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/api/client';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';

/**
 * Check whether current user participates in challenge.
 */
export function isParticipant(challengeId: string): boolean {
  const normalizedChallengeId = resolveChallengeId(challengeId);
  const { user } = useAuthStore.getState();
  return user?.participatingChallengeIds?.includes(normalizedChallengeId) ?? false;
}

/**
 * Throw if current user cannot access challenge.
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
