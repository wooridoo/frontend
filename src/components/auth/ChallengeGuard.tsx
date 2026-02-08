import { useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAccessDeniedModalStore } from '@/store/useAccessDeniedModalStore';
import { PATHS } from '@/routes/paths';

export function ChallengeGuard() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { onOpen } = useAccessDeniedModalStore();
  const navigate = useNavigate();

  const challengeId = Number(id);

  useEffect(() => {
    // 1. Invalid ID Check
    if (isNaN(challengeId)) {
      navigate(PATHS.NOT_FOUND, { replace: true });
      return;
    }

    // 2. Participation Check
    const isParticipant = user?.participatingChallengeIds?.includes(challengeId);

    if (!isParticipant) {
      onOpen(id!); // Open Access Denied Modal using string ID
      // The modal usually handles navigation on close.
      // If we render null here, the background is empty.
    }
  }, [challengeId, user, onOpen, navigate, id]);

  const isParticipant = user?.participatingChallengeIds?.includes(challengeId);

  if (!isParticipant) {
    return null; // Block access to child routes
  }

  return <Outlet />;
}
