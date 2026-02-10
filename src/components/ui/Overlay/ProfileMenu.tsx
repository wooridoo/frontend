import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/user';
import { ResponsiveOverlay } from './ResponsiveOverlay';
import { ProfileMenuContent } from './ProfileMenuContent';
import styles from './ProfileMenu.module.css'; // For internal styles if needed, or pass className

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
  trigger: React.ReactNode;
}

export function ProfileMenu({ user, onLogout, trigger }: ProfileMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // ResponsiveOverlay가 useMediaQuery를 내부에서 처리하므로 여기서 useMediaQuery 필요 없음.

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
      // ProfileMenu style tweaks if necessary
      desktopContentClassName={styles.profileDropdownWidth} // width control 필요 (기존 260px)
    >
      <ProfileMenuContent
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </ResponsiveOverlay>
  );
}
