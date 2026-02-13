import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Layout, Calendar, CreditCard, Vote, Users } from 'lucide-react';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useVotes } from '@/hooks/useVote';
import { VoteStatus } from '@/types/domain';
import styles from './ChallengeTabs.module.css';

const TABS = [
  { path: 'feed', label: '피드', icon: Layout },
  { path: 'meetings', label: '정기모임', icon: Calendar },
  { path: 'ledger', label: '장부', icon: CreditCard },
  { path: 'votes', label: '투표', icon: Vote },
  { path: 'members', label: '멤버', icon: Users },
];

export function ChallengeTabs() {
  const { challengeId } = useChallengeRoute();
  const { data: activeVotes } = useVotes(challengeId, VoteStatus.PENDING);
  const activeVoteCount = activeVotes?.length ?? 0;

  return (
    <div className={styles.container}>
      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => clsx(styles.tab, isActive && styles.active)}
            end={tab.path === 'feed'} // Only feed is root-like if needed
          >
            <tab.icon size={16} className={styles.icon} />
            <span className={styles.label}>{tab.label}</span>
            {tab.path === 'votes' && activeVoteCount > 0 && (
              <span className={styles.badge}>{activeVoteCount}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
