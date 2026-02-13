import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAccessDeniedModalStore } from '@/store/modal/useModalStore';
import { PATHS } from '@/routes/paths';
import { resolveChallengeId } from '@/lib/utils/challengeRoute';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';

export function ChallengeGuard() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { onClose } = useAccessDeniedModalStore();
  const navigate = useNavigate();

  const challengeId = resolveChallengeId(id);

  useEffect(() => {
    // 1. 유효하지 않은 ID 체크
    if (!challengeId) {
      navigate(PATHS.NOT_FOUND, { replace: true });
      return;
    }

    // 2. 참여 여부 확인: 동기화 완료 대기 (배열이어야 함)
    if (!user || user.participatingChallengeIds === undefined) return;

    const isParticipant = user.participatingChallengeIds.includes(challengeId);
    console.log(`🛡️ ChallengeGuard: ID=${challengeId}, Participating=${user.participatingChallengeIds.length}, Allowed=${isParticipant}`);

    if (isParticipant) {
      onClose();
    } else {
      // 3. 비회원은 소개 페이지로 리다이렉트 (모달 대신)
      navigate(CHALLENGE_ROUTES.intro(challengeId), { replace: true });
    }
  }, [challengeId, user, onClose, navigate]);

  // 확인될 때까지 렌더링 차단 (로딩 상태)
  if (!user || user.participatingChallengeIds === undefined) {
    return null;
  }

  const isParticipant = Boolean(challengeId) && user.participatingChallengeIds.includes(challengeId);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  if (!isParticipant) {
    return null;
  }

  return <Outlet />;
}
