import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';

export function useAuthGuard() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const { onOpen: openLoginModal } = useLoginModalStore();

  const requireAuth = (callback?: () => void): boolean => {
    if (!isLoggedIn) {
      openLoginModal();
      return false;
    }
    if (callback) callback();
    return true;
  };

  const isParticipant = (challengeId: string | number): boolean => {
    const normalizedChallengeId = resolveChallengeId(String(challengeId));
    return !!user?.participatingChallengeIds?.includes(normalizedChallengeId);
  };

  const handleChallengeAction = (challengeId: string | number) => {
    if (!requireAuth()) return;

    if (isParticipant(challengeId)) {
      navigate(CHALLENGE_ROUTES.feed(challengeId));
      return;
    }

    navigate(CHALLENGE_ROUTES.detail(challengeId));
  };

  return {
    isLoggedIn,
    user,
    requireAuth,
    isParticipant,
    handleChallengeAction,
  };
}
