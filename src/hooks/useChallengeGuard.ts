import { useQuery } from '@tanstack/react-query';
import { getChallengeFeed, ApiError } from '@/lib/api/challenge';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginModalStore } from '@/store/useLoginModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAccessDeniedModalStore } from '@/components/domain/Auth/AccessDeniedModal';
import { PATHS } from '@/routes/paths';

export function useChallengeGuard(challengeId: string) {
  const navigate = useNavigate();
  /* 
    Strict Auth Guard:
    Only trigger onOpen when error (401) occurs, do NOT re-trigger when modal closes.
    We access isOpen via getState() to avoid dependency cycle.
  */
  /* 
    Strict Auth Guard:
    Only trigger onOpen when error (401) occurs, do NOT re-trigger when modal closes.
    We access isOpen via getState() to avoid dependency cycle.
  */
  const onOpenLogin = useLoginModalStore(state => state.onOpen);
  const onOpenAccessDenied = useAccessDeniedModalStore(state => state.onOpen);

  const { data, error, isLoading } = useQuery({
    queryKey: ['challenge', challengeId, 'feed'],
    queryFn: () => getChallengeFeed(challengeId),
    retry: false, // Don't retry on 401/403
  });

  useEffect(() => {
    if (error instanceof ApiError) {
      console.log('🔒 useChallengeGuard Error:', error.status, error.message, 'ID:', challengeId);

      if (error.status === 401) {
        // Case 1: Not Logged In -> Open Login Modal
        if (!useLoginModalStore.getState().isOpen) {
          const { isLoggedIn, logout } = useAuthStore.getState();

          if (isLoggedIn) {
            // Case 1-B: Session Expired (Client thinks logged in, Server says 401)
            logout(); // Reset client state
            onOpenLogin({
              redirectOnReject: PATHS.HOME,
              message: '로그인이 만료되었습니다. 다시 로그인해주세요.'
            });
          } else {
            // Case 1-A: Just Guest
            onOpenLogin({ redirectOnReject: PATHS.HOME });
          }
        }
      } else if (error.status === 403) {
        // Case 2: Not Participant -> Open Access Denied Modal
        if (!useAccessDeniedModalStore.getState().isOpen) {
          onOpenAccessDenied(challengeId);
        }
      } else if (error.status === 404) {
        // Case 3: Not Found -> Redirect to 404 Page (or let Router handle it via navigate)
        // Since we are inside a component, we can force navigate.
        navigate(PATHS.NOT_FOUND, { replace: true });
      }
    }
  }, [error, challengeId, navigate, onOpenLogin, onOpenAccessDenied]);

  return { data, error, isLoading };
}
