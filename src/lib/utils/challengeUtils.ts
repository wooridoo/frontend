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
    throw new ApiError('Login required', 401);
  }

  if (!user.participatingChallengeIds?.includes(normalizedChallengeId)) {
    throw new ApiError('Challenge access denied', 403);
  }
}
