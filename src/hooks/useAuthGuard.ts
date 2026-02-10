import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/useLoginModalStore';

export function useAuthGuard() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const { onOpen: openLoginModal } = useLoginModalStore();

  /**
   * Checks if user is logged in. If not, opens login modal.
   * @param callback Optional callback to execute if logged in.
   * @returns boolean True if logged in, False if modal opened.
   */
  const requireAuth = (callback?: () => void): boolean => {
    if (!isLoggedIn) {
      openLoginModal();
      return false;
    }
    if (callback) callback();
    return true;
  };

  /**
   * Checks if the user is participating in the given challenge.
   * @param challengeId 
   * @returns boolean
   */
  const isParticipant = (challengeId: string | number): boolean => {
    return !!user?.participatingChallengeIds?.includes(String(challengeId));
  };

  /**
   * Standard interaction handler for Challenge Cards / Buttons.
   * - Not Logged In -> Login Modal
   * - Logged In + Joined -> Navigate to Feed
   * - Logged In + Not Joined -> Navigate to Intro (Sales Page)
   */
  const handleChallengeAction = (challengeId: string | number) => {
    if (!requireAuth()) return;

    if (isParticipant(challengeId)) {
      navigate(`/challenges/${challengeId}/feed`);
    } else {
      navigate(`/challenges/${challengeId}`);
    }
  };

  return {
    isLoggedIn,
    user,
    requireAuth,
    isParticipant,
    handleChallengeAction,
  };
}
