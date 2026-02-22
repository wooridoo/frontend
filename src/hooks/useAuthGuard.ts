import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import { PATHS } from '@/routes/paths';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useAuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuthStore();
  const { onOpen: openLoginModal } = useLoginModalStore();

  const requireAuth = (callback?: () => void): boolean => {
    if (!isLoggedIn) {
      const returnTo = sanitizeReturnToPath(
        `${location.pathname}${location.search}${location.hash}`,
        PATHS.HOME,
      );
      openLoginModal({ returnTo });
      return false;
    }
    if (callback) callback();
    return true;
  };

  const isParticipant = (challengeId: string | number): boolean => {
    const normalizedChallengeId = resolveChallengeId(String(challengeId));
    return !!user?.participatingChallengeIds?.includes(normalizedChallengeId);
  };

  const handleChallengeAction = (challengeId: string | number, challengeTitle?: string) => {
    if (!requireAuth()) return;

    if (isParticipant(challengeId)) {
      navigate(CHALLENGE_ROUTES.feed(challengeId, challengeTitle));
      return;
    }

    navigate(CHALLENGE_ROUTES.detail(challengeId, challengeTitle));
  };

  return {
    isLoggedIn,
    user,
    requireAuth,
    isParticipant,
    handleChallengeAction,
  };
}
