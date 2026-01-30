import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { SidebarIcon } from '@/components/ui/Icons'; // Reusing icons
import styles from './ProfileMenu.module.css';

interface ProfileMenuProps {
  user: {
    name: string;
    avatar?: string;
    sugarScore?: number;
  };
  onLogout: () => void;
  trigger: React.ReactNode;
}

export function ProfileMenu({ user, onLogout, trigger }: ProfileMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Simple media query hook logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

  const MenuContent = () => (
    <div className={styles.menuContainer}>
      <div className={styles.userInfo}>
        <div className={styles.avatarLarge}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarFallback}>{user.name.charAt(0)}</span>
          )}
        </div>
        <div className={styles.userDetails}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userBrix}>🍬 {user.sugarScore || 0}g</span>
        </div>
      </div>

      <div className={styles.separator} />

      <button className={styles.menuItem} onClick={() => handleNavigate('/profile')}>
        <SidebarIcon type="profile" size={24} />
        마이페이지
      </button>
      <button className={styles.menuItem} onClick={() => handleNavigate('/my-challenges')}>
        <SidebarIcon type="feed" size={24} />
        나의 챌린지
      </button>
      <button className={styles.menuItem} onClick={() => handleNavigate('/ledger')}>
        <SidebarIcon type="ledger" size={24} />
        나의 장부
      </button>

      <div className={styles.separator} />

      <button className={styles.menuItem} onClick={() => handleNavigate('/settings')}>
        <SidebarIcon type="settings" size={24} />
        설정
      </button>
      <button className={clsx(styles.menuItem, styles.logout)} onClick={handleLogout}>
        <SidebarIcon type="logout" size={24} />
        로그아웃
      </button>
    </div>
  );

  // Mobile: Dialog (Blur Modal)
  if (isMobile) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <Dialog.Title className={styles.modalTitle}>메뉴</Dialog.Title>
              <Dialog.Close className={styles.closeButton}>×</Dialog.Close>
            </div>
            <MenuContent />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  // Desktop: DropdownMenu
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.dropdownContent} sideOffset={5} align="end">
          <MenuContent />
          <DropdownMenu.Arrow className={styles.arrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
