import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Icon, IconButton, type IconName } from '@/components/ui';
import styles from './SideNav.module.css';
import logo from '@/assets/woorido_logo.svg';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getMyChallenges } from '@/lib/api/challenge';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useAuthStore } from '@/store/useAuthStore';

interface SideNavProps {
  className?: string;
  isCollapsed?: boolean;
  isOpen?: boolean; // ?? ??
  onClose?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  iconName: IconName;
}


// 보조 처리
const mainItems: NavItem[] = [
  { label: '홈', path: PATHS.HOME, iconName: 'home' },
  { label: '탐색', path: PATHS.EXPLORE, iconName: 'explore' },
  { label: '추천', path: PATHS.RECOMMENDED, iconName: 'recommended' },
];


/**
 * 좌측 네비게이션 컴포넌트입니다.
 * 메인 메뉴와 사용자가 참여한 챌린지 목록을 함께 렌더링합니다.
 */
export function SideNav({
  className,
  isCollapsed = false,
  isOpen = false, // ?? ??
  onClose,
}: SideNavProps) {

  const handleNavClick = () => {
    onClose?.();
  };

  const { isLoggedIn: isUserLoggedIn } = useAuthGuard();
  const userId = useAuthStore((state) => state.user?.userId);

  // 보조 처리
  const { data: joinedChallenges = [] } = useQuery({
    queryKey: ['challenges', 'me', 'sidenav', userId ?? 'guest'],
    queryFn: () => getMyChallenges('participating'),
    enabled: isUserLoggedIn && Boolean(userId),
    staleTime: 0,
  });

  return (
    <>
      {/* 보조 설명 */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      {/* 보조 설명 */}
      <nav className={clsx(styles.sidebar, isOpen && styles.open, !isOpen && isCollapsed && styles.collapsed, className)}>

        {/* 보조 설명 */}
        <div className={clsx(styles.mobileHeader, !isOpen && styles.hidden)}>
          <IconButton
            aria-label="사이드 메뉴 닫기"
            className={styles.menuButton}
            icon={<Menu size={24} />}
            onClick={onClose}
            size="md"
            variant="ghost"
          />
          <NavLink to={PATHS.HOME} onClick={handleNavClick} className={styles.logoLink}>
            <img src={logo} alt="우리두" className={styles.logo} />
          </NavLink>
        </div>

        {/* 보조 설명 */}
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
                    <Icon name={item.iconName} size={24} />
                  </span>
                  <span className={clsx(styles.navLabel, (isCollapsed && !isOpen) && styles.hidden)}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.divider} />

        {/* 보조 설명 */}
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

