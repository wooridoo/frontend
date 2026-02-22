import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/user';
import { ResponsiveOverlay } from './ResponsiveOverlay';
import { ProfileMenuContent } from './ProfileMenuContent';
import styles from './ProfileMenu.module.css'; // ?? ??

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
  trigger: React.ReactNode;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ProfileMenu({ user, onLogout, trigger }: ProfileMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // 보조 처리

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <ResponsiveOverlay
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      title="메뉴"
      // 보조 처리
      desktopContentClassName={styles.profileDropdownWidth} // ?? ??
    >
      <ProfileMenuContent
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </ResponsiveOverlay>
  );
}
