import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import styles from './SideNav.module.css';
import logo from '@/assets/woorido_logo.svg';

interface SideNavProps {
  className?: string;
  isLoggedIn?: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

const menuItems: NavItem[] = [
  { label: '홈', path: '/', icon: '🏠' },
  { label: '탐색', path: '/explore', icon: '🔍' },
  { label: '추천', path: '/recommended', icon: '💝' },
];

const challengeItems: NavItem[] = [
  { label: '피드', path: '/feed', icon: '📋' },
  { label: '정기모임', path: '/meetings', icon: '📅' },
  { label: '투표', path: '/votes', icon: '🗳️' },
  { label: '장부', path: '/ledger', icon: '💰' },
  { label: '멤버', path: '/members', icon: '👥' },
  { label: '설정', path: '/settings', icon: '⚙️' },
];

const managementItems: NavItem[] = [
  { label: '프로필', path: '/profile', icon: '👤' },
];

export function SideNav({
  className,
  isLoggedIn = false,
  user,
  onLogout
}: SideNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogin = () => {
    navigate('/login');
    closeMenu();
  };

  const handleSignup = () => {
    navigate('/signup');
    closeMenu();
  };

  const handleLogout = () => {
    onLogout?.();
    closeMenu();
  };

  return (
    <>
      {/* Hamburger Button (Mobile) */}
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="메뉴 열기"
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

      {/* Sidebar */}
      <nav className={clsx(styles.sidebar, isOpen && styles.open, className)}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <NavLink to="/" onClick={closeMenu}>
            <img src={logo} alt="우리두" className={styles.logo} />
          </NavLink>
        </div>

        {/* Auth Buttons or User Profile */}
        <div className={styles.authSection}>
          {isLoggedIn && user ? (
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              <span className={styles.userName}>{user.name}</span>
            </div>
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
                  onClick={closeMenu}
                >
                  {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                  <span>{item.label}</span>
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
                  onClick={closeMenu}
                >
                  {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                  <span>{item.label}</span>
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
                  onClick={closeMenu}
                >
                  {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <button
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  <span className={styles.navIcon}>🚪</span>
                  <span>로그아웃</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
