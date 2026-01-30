import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { SidebarIcon, type SidebarIconProps } from '@/components/ui/Icons';
import { Profile } from '@/components/ui/Profile';
import styles from './SideNav.module.css';
import logo from '@/assets/woorido_logo.svg';

interface SideNavProps {
  className?: string;
  isLoggedIn?: boolean;
  isCollapsed?: boolean;
  isOpen?: boolean; // Controlled state for mobile
  onClose?: () => void;
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  iconType: SidebarIconProps['type'];
}

const menuItems: NavItem[] = [
  { label: '홈', path: '/', iconType: 'home' },
  { label: '탐색', path: '/explore', iconType: 'explore' },
  { label: '추천', path: '/recommended', iconType: 'recommended' },
];

const challengeItems: NavItem[] = [
  { label: '피드', path: '/feed', iconType: 'feed' },
  { label: '정기모임', path: '/meetings', iconType: 'meetings' },
  { label: '투표', path: '/votes', iconType: 'votes' },
  { label: '장부', path: '/ledger', iconType: 'ledger' },
  { label: '멤버', path: '/members', iconType: 'members' },
  { label: '설정', path: '/settings', iconType: 'settings' },
];

const managementItems: NavItem[] = [
  { label: '프로필', path: '/profile', iconType: 'profile' },
];

export function SideNav({
  className,
  isLoggedIn = false,
  isCollapsed = false,
  isOpen = false, // Controlled state for mobile
  onClose,
  user,
  onLogout
}: SideNavProps & { isOpen?: boolean; onClose?: () => void }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    onClose?.();
  };

  const handleSignup = () => {
    navigate('/signup');
    onClose?.();
  };

  const handleLogout = () => {
    onLogout?.();
    onClose?.();
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      {/* Sidebar */}
      <nav className={clsx(styles.sidebar, isOpen && styles.open, isCollapsed && styles.collapsed, className)}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <NavLink to="/" onClick={handleNavClick}>
            <img src={logo} alt="우리두" className={styles.logo} />
          </NavLink>
        </div>

        {/* Auth Buttons or User Profile (Mobile Only) */}
        <div className={clsx(styles.authSection, styles.mobileOnly)}>
          {isLoggedIn && user ? (
            <Profile
              user={{ name: user.name, avatar: user.avatar }}
              size="md"
              onClick={() => navigate('/profile')}
            />
          ) : (
            <div className={styles.authButtons}>
              <button
                className={styles.loginButton}
                onClick={handleLogin}
              >
                로그인
              </button>
              <button
                className={styles.signupButton}
                onClick={handleSignup}
              >
                회원가입
              </button>
            </div>
          )}
        </div>

        {/* Menu Section */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>메뉴</span>
          <ul className={styles.navList}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(styles.navItem, isActive && styles.active)
                  }
                  onClick={handleNavClick}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>
                    <SidebarIcon type={item.iconType} size={20} />
                  </span>
                  <span className={clsx(styles.navLabel, isCollapsed && styles.hidden)}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenge Section */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>챌린지</span>
          <ul className={styles.navList}>
            {challengeItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(styles.navItem, isActive && styles.active)
                  }
                  onClick={handleNavClick}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>
                    <SidebarIcon type={item.iconType} size={20} />
                  </span>
                  <span className={clsx(styles.navLabel, isCollapsed && styles.hidden)}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Management Section */}
        <div className={styles.section}>
          <span className={styles.sectionTitle}>관리</span>
          <ul className={styles.navList}>
            {managementItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(styles.navItem, isActive && styles.active)
                  }
                  onClick={handleNavClick}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>
                    <SidebarIcon type={item.iconType} size={20} />
                  </span>
                  <span className={clsx(styles.navLabel, isCollapsed && styles.hidden)}>{item.label}</span>
                </NavLink>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <button
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  <span className={styles.navIcon}>
                    <SidebarIcon type="logout" size={20} />
                  </span>
                  <span className={clsx(styles.navLabel, isCollapsed && styles.hidden)}>로그아웃</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
