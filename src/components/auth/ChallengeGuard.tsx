import { useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAccessDeniedModalStore } from '@/store/useAccessDeniedModalStore';
import { PATHS } from '@/routes/paths';

export function ChallengeGuard() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { onOpen, onClose } = useAccessDeniedModalStore();
  const navigate = useNavigate();

  const challengeId = id!;

  useEffect(() => {
    // 1. Invalid ID Check
    if (!challengeId) {
      navigate(PATHS.NOT_FOUND, { replace: true });
      return;
    }

    // 2. Participation Check: Wait for sync to complete (must be an array)
    if (!user || user.participatingChallengeIds === undefined) return;

    const isParticipant = user.participatingChallengeIds.includes(challengeId);
    console.log(`🛡️ ChallengeGuard: ID=${challengeId}, Participating=${user.participatingChallengeIds.length}, Allowed=${isParticipant}`);

    if (isParticipant) {
      onClose();
    } else {
      onOpen(id!);
    }
  }, [challengeId, user, onOpen, onClose, navigate, id]);

  // Block rendering until we're sure
  if (!user || user.participatingChallengeIds === undefined) {
    return null;
  }

  const isParticipant = user.participatingChallengeIds.includes(challengeId);

  if (!isParticipant) {
    return null;
  }

  return <Outlet />;
}
