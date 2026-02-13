import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAccessDeniedModalStore } from '@/store/modal/useModalStore';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';

export function ChallengeGuard() {
  const { challengeId, challengeRef, isResolving } = useChallengeRoute();
  const { user } = useAuthStore();
  const { onClose } = useAccessDeniedModalStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isResolving) return;

    if (!challengeId) {
      navigate(PATHS.NOT_FOUND, { replace: true });
      return;
    }

    if (!user || user.participatingChallengeIds === undefined) return;

    const allowed = user.participatingChallengeIds.includes(challengeId);
    if (allowed) {
      onClose();
      return;
    }

    const routeRef = challengeRef || challengeId;
    navigate(CHALLENGE_ROUTES.intro(routeRef), { replace: true });
  }, [challengeId, challengeRef, isResolving, navigate, onClose, user]);

  if (isResolving || !user || user.participatingChallengeIds === undefined) {
    return null;
  }

  const allowed = Boolean(challengeId) && user.participatingChallengeIds.includes(challengeId);
  if (!allowed) {
    return null;
  }

  return <Outlet />;
}
