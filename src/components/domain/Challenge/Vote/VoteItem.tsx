import { useNavigate } from 'react-router-dom';
import type { Vote } from '../../../../types/domain';
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

    if (days < 0) return 'Closed';
    if (days === 0) return 'Closes today';
    return `${days} day(s) left`;
  };

  const totalVotes = vote.voteCount.total || 0;
  const agreeVotes = vote.voteCount.agree || 0;
  const participationCount = vote.voteCount.agree + vote.voteCount.disagree;
  const participationRate = totalVotes > 0 ? (agreeVotes / totalVotes) * 100 : 0;

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.header}>
        <VoteStatusBadge status={vote.status} />
        <span className={styles.deadline}>{getDeadlineText(vote.deadline)}</span>
      </div>

      <h3 className={styles.title}>{vote.title}</h3>

      <div className={styles.footer}>
        <span className={styles.voters}>
          Participated {participationCount}/{vote.eligibleVoters}
        </span>
        <span className={styles.author}>
          {voteResult ? `${voteResult.passed ? 'Passed' : 'Rejected'} ${voteResult.approvalRate.toFixed(0)}%` : `By ${vote.createdBy.nickname}`}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${participationRate}%` }} />
      </div>
    </div>
  );
}
