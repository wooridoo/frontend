import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Loading } from '@/components/feedback';
import { VoteStatusBadge } from './VoteStatusBadge';
import { useVoteDetail, useVoteResult, useCastVote } from '@/hooks/useVote';
import type { VoteOption } from '@/types/domain';
import { VoteStatus } from '@/types/domain';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { capabilities } from '@/lib/api/capabilities';
import { formatCurrency } from '@/lib/utils';
import styles from './VoteDetail.module.css';

const VOTE_LABEL: Record<VoteOption, string> = {
  AGREE: '찬성',
  DISAGREE: '반대',
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function VoteDetail() {
  const { voteId } = useParams<{ voteId: string }>();
  const { challengeId } = useChallengeRoute();
  const navigate = useNavigate();
  const { confirm } = useConfirmDialog();
  const { data: vote, isLoading } = useVoteDetail(voteId || '');
  const { data: result } = useVoteResult(voteId || '', capabilities.voteResult);
  const { mutate: castVote, isPending: isCasting } = useCastVote(voteId || '', challengeId);

  if (isLoading) return <Loading />;
  if (!vote) return <div>투표를 찾을 수 없습니다.</div>;

  const handleVote = async (option: VoteOption) => {
    const isConfirmed = await confirm({
      title: `${VOTE_LABEL[option]}으로 투표하시겠습니까?`,
      confirmText: '투표하기',
      cancelText: '취소',
    });
    if (!isConfirmed) return;
    castVote(option);
  };

  const isEnded = vote.status !== VoteStatus.PENDING;
  const hasVoted = !!vote.myVote;
  const canShowResult = capabilities.voteResult && !!result;
  const totalVotes = Math.max(vote.voteCount.total || 0, vote.voteCount.agree + vote.voteCount.disagree);

  const getPercentage = (count: number) => {
    if (totalVotes <= 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  const handleBack = async () => {
    const isConfirmed = await confirm({
      title: '투표 목록으로 돌아가시겠습니까?',
      confirmText: '이동',
      cancelText: '취소',
    });
    if (!isConfirmed) return;
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Button variant="ghost" onClick={() => void handleBack()}>
          목록으로
        </Button>
      </div>

      <div className={styles.header}>
        <div className={styles.statusRow}>
          <VoteStatusBadge status={vote.status} />
          <span className={styles.date}>{new Date(vote.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className={styles.title}>{vote.title}</h1>
        <div className={styles.author}>작성자: {vote.createdBy.nickname}</div>
      </div>

      <div className={styles.content}>
        {vote.description ? <p className={styles.description}>{vote.description}</p> : null}
        {vote.type === 'EXPENSE' && typeof vote.targetInfo?.amount === 'number' ? (
          <div className={styles.targetInfo}>
            <span className={styles.targetLabel}>지출 금액:</span>{' '}
            {formatCurrency(vote.targetInfo.amount, { withSuffix: true })}
          </div>
        ) : null}
      </div>

      <div className={styles.votingSection}>
        {isEnded || hasVoted ? (
          <div className={styles.results}>
            <h3>투표 결과</h3>

            {canShowResult ? (
              <div className={`${styles.resultBanner} ${result.passed ? styles.passed : styles.failed}`}>
                {result.passed ? '가결되었습니다' : '부결되었습니다'} ({result.approvalRate.toFixed(1)}%)
              </div>
            ) : null}

            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>
                <span>찬성</span>
                <span>
                  {vote.voteCount.agree}명 ({getPercentage(vote.voteCount.agree)}%)
                </span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${getPercentage(vote.voteCount.agree)}%` }} />
              </div>
            </div>

            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>
                <span>반대</span>
                <span>
                  {vote.voteCount.disagree}명 ({getPercentage(vote.voteCount.disagree)}%)
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.danger}`}
                  style={{ width: `${getPercentage(vote.voteCount.disagree)}%` }}
                />
              </div>
            </div>

            {hasVoted ? (
              <div className={styles.myVote}>
                내 투표: <span className={styles.myVoteValue}>{vote.myVote === 'AGREE' ? '찬성' : '반대'}</span>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={styles.actions}>
            <h3>투표하기</h3>
            <div className={styles.buttonGroup}>
              <Button className={styles.voteBtn} onClick={() => void handleVote('AGREE')} disabled={isCasting}>
                찬성
              </Button>
              <Button
                className={styles.voteBtn}
                variant="danger"
                onClick={() => void handleVote('DISAGREE')}
                disabled={isCasting}
              >
                반대
              </Button>
            </div>
            <p className={styles.deadlineInfo}>마감: {new Date(vote.deadline).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
