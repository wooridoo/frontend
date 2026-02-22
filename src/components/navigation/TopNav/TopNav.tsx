import type { User } from '@/types/user';
import clsx from 'clsx';
import { NavLeft } from './components/NavLeft';
import { NavSearch } from './components/NavSearch';
import { NavRight } from './components/NavRight';
import styles from './TopNav.module.css';

interface TopNavProps {
  className?: string;
  isLoggedIn?: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  user?: User;
  onLogout: () => void;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function TopNav({
  className,
  isLoggedIn = false,
  isSidebarCollapsed,
  onToggleSidebar,
  user,
  onLogout
}: TopNavProps) {
  return (
    <header className={clsx(styles.root, className)}>
      <div className={styles.contentWrapper}>
        <NavLeft
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
        />

        <NavSearch />

        <NavRight
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
