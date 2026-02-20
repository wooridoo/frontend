import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { SidebarIcon, type SidebarIconProps } from '@/components/ui/Icons';
import styles from './SideNav.module.css';
import logo from '@/assets/woorido_logo.svg';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getMyChallenges } from '@/lib/api/challenge';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';

interface SideNavProps {
  className?: string;
  isCollapsed?: boolean;
  isOpen?: boolean; // Controlled state for mobile
  onClose?: () => void;
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
  { label: '추천', path: PATHS.RECOMMENDED, iconType: 'recommended' },
];


export function SideNav({
  className,
  isCollapsed = false,
  isOpen = false, // Controlled state for mobile
  onClose,
}: SideNavProps) {

  const handleNavClick = () => {
    onClose?.();
  };

  const { isLoggedIn: isUserLoggedIn } = useAuthGuard();

  // Fetch real joined challenges from API
  const { data: joinedChallenges = [] } = useQuery({
    queryKey: ['challenges', 'me', 'sidenav'],
    queryFn: () => getMyChallenges('participating'),
    enabled: isUserLoggedIn,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });

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

        {/* 2. Joined Challenges Section - Dynamic from API */}
        {isUserLoggedIn && (
          <div className={styles.section}>
            <span className={clsx(styles.sectionTitle, (isCollapsed && !isOpen) && styles.hidden)}>가입한 챌린지</span>
            <ul className={styles.navList}>
              {joinedChallenges.length > 0 ? (
                joinedChallenges.map((challenge) => (
                  <li key={challenge.challengeId}>
                    <NavLink
                      to={CHALLENGE_ROUTES.feedWithTitle(challenge.challengeId, challenge.title)}
                      className={({ isActive }) =>
                        clsx(styles.navItem, isActive && styles.active)
                      }
                      onClick={handleNavClick}
                      title={isCollapsed ? (challenge.title || '이름 없는 챌린지') : undefined}
                    >
                      <span className={styles.challengeIcon}>
                        {(challenge.title || '?').slice(0, 1)}
                      </span>
                      <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden)}>
                        {challenge.title || '이름 없는 챌린지'}
                      </span>
                    </NavLink>
                  </li>
                ))
              ) : (
                <li className={styles.emptyItem}>
                  <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden, styles.emptyText)}>
                    참여 중인 챌린지가 없습니다.
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}

      </nav>
    </>
  );
}

