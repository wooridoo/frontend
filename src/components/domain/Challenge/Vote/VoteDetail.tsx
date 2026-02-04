import { useParams, useNavigate } from 'react-router-dom';
import { useVoteDetail, useCastVote } from '../../../../hooks/useVote';
import { Button, Loading } from '../../../../components/common';
import { VoteStatusBadge } from './VoteStatusBadge';
import { VoteStatus, type VoteOption } from '../../../../types/domain';
import { formatCurrency } from '@/utils/format';
import styles from './VoteDetail.module.css';

export function VoteDetail() {
  const { id, voteId } = useParams<{ id: string; voteId: string }>();
  const navigate = useNavigate();
  const { data: vote, isLoading } = useVoteDetail(Number(voteId));
  const { mutate: castVote, isPending: isCasting } = useCastVote(Number(voteId), id!);

  if (isLoading) return <Loading />;
  if (!vote) return <div>Vote not found</div>;

  const handleVote = (option: VoteOption) => {
    if (confirm(`${option === 'AGREE' ? '찬성' : option === 'DISAGREE' ? '반대' : '기권'}하시겠습니까?`)) {
      castVote(option);
    }
  };

  const isEnded = vote.status !== VoteStatus.PENDING;
  const hasVoted = !!vote.myVote;
  const showResults = isEnded || hasVoted;

  const totalVotes = vote.result ? vote.result.total : vote.voteCount.total - vote.voteCount.notVoted;

  const getPercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Button variant="ghost" onClick={() => navigate(-1)}>← 목록으로</Button>
      </div>

      <div className={styles.header}>
        <div className={styles.statusRow}>
          <VoteStatusBadge status={vote.status} />
          <span className={styles.date}>{new Date(vote.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className={styles.title}>{vote.title}</h1>
        <div className={styles.author}>
          작성자: {vote.createdBy.nickname}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{vote.description}</p>

        {vote.targetInfo && (
          <div className={styles.targetInfo}>
            <span className={styles.targetLabel}>관련 항목:</span>
            {vote.type === 'EXPENSE' ? `${formatCurrency(vote.targetInfo.amount ?? 0, { withSuffix: true })} 지출` : '멤버 강퇴'}
          </div>
        )}
      </div>

      <div className={styles.votingSection}>
        {showResults ? (
          <div className={styles.results}>
            <h3>투표 결과</h3>
            {isEnded && vote.result && (
              <div className={`${styles.resultBanner} ${vote.result.passed ? styles.passed : styles.failed}`}>
                {vote.result.passed ? '가결되었습니다' : '부결되었습니다'}
                (찬성률 {vote.result.approvalRate}%)
              </div>
            )}

            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>
                <span>찬성</span>
                <span>{vote.voteCount.agree}명 ({getPercentage(vote.voteCount.agree)}%)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${getPercentage(vote.voteCount.agree)}%` }} />
              </div>
            </div>

            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>
                <span>반대</span>
                <span>{vote.voteCount.disagree}명 ({getPercentage(vote.voteCount.disagree)}%)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.danger}`} style={{ width: `${getPercentage(vote.voteCount.disagree)}%` }} />
              </div>
            </div>

            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>
                <span>기권</span>
                <span>{vote.voteCount.abstain}명 ({getPercentage(vote.voteCount.abstain)}%)</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.neutral}`} style={{ width: `${getPercentage(vote.voteCount.abstain)}%` }} />
              </div>
            </div>

            {hasVoted && (
              <div className={styles.myVote}>
                내 투표: <span className={styles.myVoteValue}>{vote.myVote}</span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.actions}>
            <h3>투표하기</h3>
            <div className={styles.buttonGroup}>
              <Button
                className={styles.voteBtn}
                onClick={() => handleVote('AGREE')}
                disabled={isCasting}
              >
                찬성
              </Button>
              <Button
                className={styles.voteBtn}
                variant="danger" // Assuming danger variant exists or similar
                onClick={() => handleVote('DISAGREE')}
                disabled={isCasting}
              >
                반대
              </Button>
              <Button
                className={styles.voteBtn}
                variant="outline"
                onClick={() => handleVote('ABSTAIN')}
                disabled={isCasting}
              >
                기권
              </Button>
            </div>
            <p className={styles.deadlineInfo}>
              마감일: {new Date(vote.deadline).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
