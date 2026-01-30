import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { PanelLeftClose, PanelLeft, LogIn, UserPlus } from 'lucide-react';
import { SearchIcon } from '@/components/ui/Icons';
import { ProfileMenu } from '@/components/ui/Overlay';
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

            {/* Profile Menu (Dropdown/Modal) */}
            <ProfileMenu
              user={user}
              onLogout={onLogout}
              trigger={
                <button className={styles.profileButton}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className={styles.profileImage} />
                  ) : (
                    <span>{user.name.slice(0, 1)}</span>
                  )}
                </button>
              }
            />
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

