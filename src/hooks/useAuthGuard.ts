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
    console.log('[DEBUG] handleChallengeAction called - challengeId:', challengeId, 'isLoggedIn:', isLoggedIn);
    if (!requireAuth()) {
      console.log('[DEBUG] requireAuth failed - showing login modal');
      return;
    }

    const participating = isParticipant(challengeId);
    console.log('[DEBUG] isParticipant:', participating, 'participatingIds:', user?.participatingChallengeIds);

    if (participating) {
      const feedUrl = CHALLENGE_ROUTES.feed(challengeId);
      console.log('[DEBUG] navigating to feed:', feedUrl);
      navigate(feedUrl);
      return;
    }

    const detailUrl = CHALLENGE_ROUTES.detail(challengeId);
    console.log('[DEBUG] navigating to detail:', detailUrl);
    navigate(detailUrl);
  };

  return {
    isLoggedIn,
    user,
    requireAuth,
    isParticipant,
    handleChallengeAction,
  };
}
