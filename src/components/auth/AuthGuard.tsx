import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { PATHS } from '@/routes/paths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function AuthGuard() {
  const { isLoggedIn } = useAuthStore();
  const { onOpen } = useLoginModalStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      const returnTo = sanitizeReturnToPath(
        `${location.pathname}${location.search}${location.hash}`,
        PATHS.HOME,
      );
      // 로그인 모달 띄우기
      // 사용자가 로그인을 취소하거나 실패하면 홈으로 리다이렉트 처리 옵션 등을 설정합니다.
      onOpen({
        returnTo,
        redirectOnReject: PATHS.HOME,
        message: '로그인이 필요한 페이지입니다.'
      });
    }
  }, [isLoggedIn, location.hash, location.pathname, location.search, onOpen]);

  if (!isLoggedIn) {
    // 모달이 떠있는 동안 배경에는 아무것도 렌더링하지 않음 (또는 로딩 스피너)
    return null;
  }

  return <Outlet />;
}
