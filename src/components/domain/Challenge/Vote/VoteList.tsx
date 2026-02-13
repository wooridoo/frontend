import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotes } from '../../../../hooks/useVote';
import { VoteItem } from './VoteItem';
import { Button } from '@/components/ui';
import { Loading } from '@/components/common';
import { VoteStatus } from '../../../../types/domain';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './VoteList.module.css';

export function VoteList() {
  const { challengeId, challengeRef } = useChallengeRoute();
  const routeRef = challengeRef || challengeId;
  const navigate = useNavigate();
  const [tab, setTab] = useState<'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');

  const { data: votes, isLoading, error } = useVotes(
    challengeId,
    tab === 'IN_PROGRESS' ? VoteStatus.PENDING : undefined
  );

  const displayVotes = votes?.filter(vote =>
    tab === 'IN_PROGRESS' ? vote.status === VoteStatus.PENDING : vote.status !== VoteStatus.PENDING
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading votes</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Votes</h2>
        <Button onClick={() => navigate(CHALLENGE_ROUTES.voteNew(routeRef))}>Create Vote</Button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'IN_PROGRESS' ? styles.active : ''}`}
          onClick={() => setTab('IN_PROGRESS')}
        >
          In Progress
        </button>
        <button
          className={`${styles.tab} ${tab === 'COMPLETED' ? styles.active : ''}`}
          onClick={() => setTab('COMPLETED')}
        >
          Completed
        </button>
      </div>

      <div className={styles.list}>
        {displayVotes?.length === 0 ? (
          <div className={styles.empty}>
            {tab === 'IN_PROGRESS' ? 'No in-progress votes.' : 'No completed votes.'}
          </div>
        ) : (
          displayVotes?.map(vote => <VoteItem key={vote.voteId} vote={vote} challengeRef={routeRef} />)
        )}
      </div>
    </div>
  );
}
