import { useNavigate } from 'react-router-dom';
import type { Vote } from '@/types/domain';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { VoteStatusBadge } from './VoteStatusBadge';
import { VoteStatus } from '@/types/domain';
import { useVoteResult } from '@/hooks/useVote';
import { capabilities } from '@/lib/api/capabilities';
import styles from './VoteItem.module.css';

interface VoteItemProps {
  vote: Vote;
  challengeRef?: string;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function VoteItem({ vote, challengeRef }: VoteItemProps) {
  const navigate = useNavigate();
  const shouldLoadResult = capabilities.voteResult && vote.status !== VoteStatus.PENDING;
  const { data: voteResult } = useVoteResult(vote.voteId, shouldLoadResult);

  const handleClick = () => {
    navigate(CHALLENGE_ROUTES.voteDetail(challengeRef || vote.challengeId, vote.voteId));
  };

  const getDeadlineText = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffMs = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (days < 0) return '마감됨';
    if (days === 0) return '오늘 마감';
    return `${days}일 남음`;
  };

  const participationCount = vote.voteCount.agree + vote.voteCount.disagree;
  const eligibleVoters = vote.eligibleVoters > 0 ? vote.eligibleVoters : undefined;
  const participationRate = eligibleVoters ? (participationCount / eligibleVoters) * 100 : 0;

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.header}>
        <VoteStatusBadge status={vote.status} />
        <span className={styles.deadline}>{getDeadlineText(vote.deadline)}</span>
      </div>

      <h3 className={styles.title}>{vote.title}</h3>

      <div className={styles.footer}>
        <span className={styles.voters}>
          참여 {participationCount}/{eligibleVoters ?? '-'}
        </span>
        <span className={styles.author}>
          {voteResult
            ? `${voteResult.passed ? '가결' : '부결'} ${voteResult.approvalRate.toFixed(0)}%`
            : `작성자 ${vote.createdBy.nickname}`}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${participationRate}%` }} />
      </div>
    </div>
  );
}
