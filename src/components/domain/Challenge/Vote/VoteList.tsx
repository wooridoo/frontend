import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotes } from '../../../../hooks/useVote';
import { VoteItem } from './VoteItem';
import { Button, Loading } from '../../../../components/common';
import { VoteStatus } from '../../../../types/domain';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './VoteList.module.css';

export function VoteList() {
  const { challengeId, challengeRef } = useChallengeRoute();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');

  const { data: votes, isLoading, error } = useVotes(
    challengeId,
    tab === 'IN_PROGRESS' ? VoteStatus.PENDING : undefined
  );

  // Filter for completed if needed (as API might return mixed if status param not perfectly aligned with UI tab logic yet)
  const displayVotes = votes?.filter(v =>
    tab === 'IN_PROGRESS' ? v.status === VoteStatus.PENDING : v.status !== VoteStatus.PENDING
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading votes</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>투표</h2>
        <Button onClick={() => navigate(CHALLENGE_ROUTES.voteNew(challengeRef || challengeId))}>
          새 투표 생성
        </Button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'IN_PROGRESS' ? styles.active : ''}`}
          onClick={() => setTab('IN_PROGRESS')}
        >
          진행 중
        </button>
        <button
          className={`${styles.tab} ${tab === 'COMPLETED' ? styles.active : ''}`}
          onClick={() => setTab('COMPLETED')}
        >
          종료됨
        </button>
      </div>

      <div className={styles.list}>
        {displayVotes?.length === 0 ? (
          <div className={styles.empty}>
            {tab === 'IN_PROGRESS' ? '진행 중인 투표가 없습니다.' : '종료된 투표가 없습니다.'}
          </div>
        ) : (
          displayVotes?.map(vote => (
            <VoteItem key={vote.voteId} vote={vote} />
          ))
        )}
      </div>
    </div>
  );
}
