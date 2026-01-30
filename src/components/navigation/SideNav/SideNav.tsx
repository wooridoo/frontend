import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import clsx from 'clsx';
import { SidebarIcon, type SidebarIconProps } from '@/components/ui/Icons';
// Profile component removed per user feedback
import styles from './SideNav.module.css';
import logo from '@/assets/woorido_logo.svg';

interface SideNavProps {
  className?: string;
  isLoggedIn?: boolean;
  isCollapsed?: boolean;
  isOpen?: boolean; // Controlled state for mobile
  onClose?: () => void;
  onToggle?: () => void;
  user?: {
    name: string;
    avatar?: string;
  };
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
];



export function SideNav({
  className,
  isCollapsed = false,
  isOpen = false, // Controlled state for mobile
  onClose,
  onToggle,
}: SideNavProps & { isOpen?: boolean; onClose?: () => void }) {





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
      <nav className={clsx(styles.sidebar, isOpen && styles.open, !isOpen && isCollapsed && styles.collapsed, className)}>
        {/* Header: Toggle + Logo */}
        <div className={styles.headerWrapper}>
          <button
            className={styles.toggleButton}
            onClick={onToggle}
            aria-label={isCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
          >
            <Menu size={24} />
          </button>

          <NavLink to="/" onClick={handleNavClick} className={clsx(styles.logoLink, (isCollapsed && !isOpen) && styles.hidden)}>
            <img src={logo} alt="우리두" className={styles.logo} />
          </NavLink>
        </div>

        {/* Auth Buttons or User Profile (Mobile Only) */}


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
                    <SidebarIcon type={item.iconType} size={24} />
                  </span>
                  <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden)}>{item.label}</span>
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
                    <SidebarIcon type={item.iconType} size={24} />
                  </span>
                  <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden)}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>


      </nav>
    </>
  );
}
