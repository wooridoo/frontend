import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/useLoginModalStore';
import { PATHS } from '@/routes/paths';

export function AuthGuard() {
  const { isLoggedIn } = useAuthStore();
  const { onOpen } = useLoginModalStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인 모달 띄우기
      // 사용자가 로그인을 취소하거나 실패하면 홈으로 리다이렉트 처리 옵션 등을 설정합니다.
      onOpen({
        redirectOnReject: PATHS.HOME,
        message: '로그인이 필요한 페이지입니다.'
      });
    }
  }, [isLoggedIn, onOpen, navigate]);

  if (!isLoggedIn) {
    // 모달이 떠있는 동안 배경에는 아무것도 렌더링하지 않음 (또는 로딩 스피너)
    return null;
  }

  return <Outlet />;
}
