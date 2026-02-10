import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import clsx from 'clsx';
import { SidebarIcon, type SidebarIconProps } from '@/components/ui/Icons';
import styles from './SideNav.module.css';
import logo from '@/assets/woorido_logo.svg';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { PATHS } from '@/routes/paths';

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


// Section 1: Main Navigation
const mainItems: NavItem[] = [
  { label: '홈', path: PATHS.HOME, iconType: 'home' },
  { label: '탐색', path: PATHS.EXPLORE, iconType: 'explore' },
  { label: '추천', path: '/recommended', iconType: 'recommended' }, // Recommended not yet in PATHS, keeping as string or adding to PATHS? Let's add it to PATHS later or keep string if P2
];

// Section 2: Subscriptions (Joined Challenges) - Mock Data
// In real app, this comes from API/Store
const joinedChallenges = [
  { id: '1', label: '책벌레들', path: PATHS.CHALLENGE.FEED('1'), iconType: 'feed' },
  { id: '2', label: '이른새벽 기상', path: PATHS.CHALLENGE.FEED('2'), iconType: 'feed' },
  // { id: 3, label: '헬스장 출석', path: PATHS.CHALLENGE.FEED(3), iconType: 'feed' },
] as const;


export function SideNav({
  className,
  isCollapsed = false,
  isOpen = false, // Controlled state for mobile
  onClose,
}: SideNavProps & { isOpen?: boolean; onClose?: () => void }) {

  const handleNavClick = () => {
    onClose?.();
  };

  const { isLoggedIn: isUserLoggedIn, user, isParticipant } = useAuthGuard();

  return (
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      {/* Sidebar */}
      <nav className={clsx(styles.sidebar, isOpen && styles.open, !isOpen && isCollapsed && styles.collapsed, className)}>

        {/* Mobile Header: Logo + Close Button */}
        <div className={clsx(styles.mobileHeader, !isOpen && styles.hidden)}>
          <button className={styles.menuButton} onClick={onClose}>
            <Menu size={24} />
          </button>
          <NavLink to={PATHS.HOME} onClick={handleNavClick} className={styles.logoLink}>
            <img src={logo} alt="우리두" className={styles.logo} />
          </NavLink>
        </div>

        {/* Note: Logo is now in TopNav, so removed from here */}

        {/* 1. Main Menu Section */}
        <div className={styles.section}>
          <ul className={styles.navList}>
            {mainItems.map((item) => (
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

        <div className={styles.divider} />

        {/* 2. Subscriptions (Joined Challenges) Section - Only show when logged in */}
        {/* 2. Subscriptions (Joined Challenges) Section - Only show when logged in */}
        {isUserLoggedIn && user?.participatingChallengeIds && (
          <div className={styles.section}>
            <span className={clsx(styles.sectionTitle, (isCollapsed && !isOpen) && styles.hidden)}>가입한 챌린지</span>
            <ul className={styles.navList}>
              {joinedChallenges
                .filter(item => isParticipant(item.id))
                .map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(styles.navItem, isActive && styles.active)
                      }
                      onClick={handleNavClick}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {/* Reuse feed icon for now, or use challenge avatar if available */}
                      <span className={styles.challengeIcon}>
                        {item.label.slice(0, 1)}
                      </span>
                      <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden)}>{item.label}</span>
                    </NavLink>
                  </li>
                ))}

              {/* Show "No Challenges" if empty */}
              {(!user.participatingChallengeIds || user.participatingChallengeIds.length === 0) && (
                <li className={styles.emptyItem}>
                  <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden, styles.emptyText)}>
                    참여 중인 챌린지가 없습니다.
                  </span>
                </li>
              )}

              {/* View All Button - Only show if there are challenges */}
              {user.participatingChallengeIds.length > 0 && (
                <li className={styles.viewAllItem}>
                  <button className={clsx(styles.navItem, styles.viewAllButton)}>
                    <span className={styles.navIcon}>
                      {/* Chevron Down or similar */}
                      <span style={{ fontSize: '18px' }}>⌄</span>
                    </span>
                    <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden)}>더보기</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}

      </nav>
    </>
  );
}
