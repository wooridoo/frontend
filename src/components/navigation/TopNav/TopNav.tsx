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
  user?: {
    name: string;
    avatar?: string;
    sugarScore: number;
    balance: number;
  };
  onLogout: () => void;
}

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
