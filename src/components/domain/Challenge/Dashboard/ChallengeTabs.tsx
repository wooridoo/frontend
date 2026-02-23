import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Layout, Calendar, CreditCard, Vote, Users, type LucideIcon } from 'lucide-react';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './ChallengeTabs.module.css';

interface TabItem {
  path: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

const TABS: TabItem[] = [
  { path: 'feed', label: '피드', icon: Layout },
  { path: 'meetings', label: '정기모임', icon: Calendar },
  { path: 'ledger', label: '장부', icon: CreditCard },
  { path: 'votes', label: '투표', icon: Vote },
  { path: 'members', label: '멤버', icon: Users },
];

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ChallengeTabs() {
  const location = useLocation();
  const { challengeRef, challengeId } = useChallengeRoute();
  const routeRef = challengeRef || challengeId;

  const resolveTabPath = (tabPath: string): string => {
    if (!routeRef) return tabPath;

    switch (tabPath) {
      case 'feed':
        return CHALLENGE_ROUTES.feed(routeRef);
      case 'meetings':
        return CHALLENGE_ROUTES.meetings(routeRef);
      case 'ledger':
        return CHALLENGE_ROUTES.ledger(routeRef);
      case 'votes':
        return CHALLENGE_ROUTES.votes(routeRef);
      case 'members':
        return CHALLENGE_ROUTES.members(routeRef);
      default:
        return tabPath;
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.tabs}>
        {TABS.map((tab) => {
          const toPath = resolveTabPath(tab.path);
          return (
          <NavLink
            key={tab.path}
            to={toPath}
            className={({ isActive }) => clsx(styles.tab, isActive && styles.active)}
            end={tab.path === 'feed'} // ?? ??
            onClick={() => {
              console.debug('[ChallengeTabs] tab-click', {
                tab: tab.path,
                from: location.pathname,
                to: toPath,
                challengeRef,
                challengeId,
              });
            }}
          >
            <tab.icon size={16} className={styles.icon} />
            <span className={styles.label}>{tab.label}</span>
            {tab.count && <span className={styles.badge}>{tab.count}</span>}
          </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
