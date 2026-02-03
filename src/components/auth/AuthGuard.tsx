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
      // Trigger Login Modal
      // If user cancels login, where do they go? Usually Home or previous page.
      onOpen({
        redirectOnReject: PATHS.HOME,
        message: '로그인이 필요한 페이지입니다.'
      });

      // Optional: Redirect immediately to prevent flash? 
      // But we want to show the modal on the current route (background)?
      // If we render null, background is white.
      // If we render Outlet, user sees protected content for a split second?
      // Better: Render a placeholder or "Access Denied" state behind the modal.
    }
  }, [isLoggedIn, onOpen, navigate]);

  if (!isLoggedIn) {
    // Render nothing or a strict placeholder while modal is open
    // Ideally, we might want to Redirect to a "Login Required" page 
    // BUT our design uses Modals.
    // So we return null (or a loader) and let the Modal (controlled globally) show up.
    return null;
  }

  return <Outlet />;
}
