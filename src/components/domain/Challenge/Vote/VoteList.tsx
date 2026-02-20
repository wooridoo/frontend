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
    return <div>투표 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>투표</h2>
        <Button onClick={() => navigate(CHALLENGE_ROUTES.voteNew(routeRef))}>투표 생성</Button>
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
          완료
        </button>
      </div>

      <div className={styles.list}>
        {displayVotes?.length === 0 ? (
          <div className={styles.empty}>
            {tab === 'IN_PROGRESS' ? '진행 중인 투표가 없습니다.' : '완료된 투표가 없습니다.'}
          </div>
        ) : (
          displayVotes?.map(vote => <VoteItem key={vote.voteId} vote={vote} challengeRef={routeRef} />)
        )}
      </div>
    </div>
  );
}
