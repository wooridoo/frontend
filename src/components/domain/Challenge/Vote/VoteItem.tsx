import styles from './VoteItem.module.css';
import type { Vote } from '../../../../types/domain';
import { VoteStatusBadge } from './VoteStatusBadge';
import { useNavigate } from 'react-router-dom';

interface VoteItemProps {
  vote: Vote;
}

export function VoteItem({ vote }: VoteItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/challenges/${vote.challengeId}/votes/${vote.voteId}`);
  };

  const getDeadlineText = (deadline: string) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return '마감됨';
    if (days === 0) return '오늘 마감';
    return `${days}일 남음`;
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.header}>
        <VoteStatusBadge status={vote.status} />
        <span className={styles.deadline}>{getDeadlineText(vote.deadline)}</span>
      </div>
      <h3 className={styles.title}>{vote.title}</h3>
      <div className={styles.footer}>
        <span className={styles.voters}>
          참여 {vote.voteCount.total - vote.voteCount.notVoted}/{vote.eligibleVoters}명
        </span>
        <span className={styles.author}>
          제안자: {vote.createdBy.nickname}
        </span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(vote.voteCount.agree / vote.voteCount.total) * 100}%` }}
        />
      </div>
    </div>
  );
}
