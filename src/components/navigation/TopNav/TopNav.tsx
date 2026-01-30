import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { PanelLeftClose, PanelLeft, LogIn, UserPlus } from 'lucide-react';
import { SearchIcon } from '@/components/ui/Icons';
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
}

export function TopNav({
  className,
  isLoggedIn = false,
  isSidebarCollapsed,
  onToggleSidebar,
  user
}: TopNavProps) {
  const navigate = useNavigate();

  return (
    <header className={clsx(styles.root, className)}>
      <div className={styles.leftSection}>
        {/* Sidebar Toggle (Desktop) */}
        <button
          className={styles.menuButton}
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          {isSidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Center Section: Search Bar */}
      <div className={styles.centerSection}>
        <div className={styles.searchWrapper}>
          <SearchIcon className={styles.searchIcon} size={20} color="var(--color-grey-500)" />
          <input
            type="text"
            placeholder="챌린지를 검색하세요"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        {isLoggedIn && user ? (
          <div className={styles.userActions}>
            {/* DangDo Badge */}
            <div className={styles.dangdoBadge} title="나의 당도">
              🍬 {user.sugarScore}g
            </div>

            {/* Balance Link */}
            <button
              className={styles.balanceLink}
              onClick={() => navigate('/charge')}
            >
              {user.balance.toLocaleString()}원
            </button>

            {/* Profile */}
            <button
              className={styles.profileButton}
              onClick={() => navigate('/settings/profile')}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className={styles.profileImage} />
              ) : (
                <span>{user.name.slice(0, 1)}</span>
              )}
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <button
              className={clsx(styles.button, styles.secondaryButton)}
              onClick={() => navigate('/login')}
            >
              <LogIn size={16} /> 로그인
            </button>
            <button
              className={clsx(styles.button, styles.primaryButton)}
              onClick={() => navigate('/signup')}
            >
              <UserPlus size={16} /> 회원가입
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
