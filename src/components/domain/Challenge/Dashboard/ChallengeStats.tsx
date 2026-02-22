import { TrendingUp } from 'lucide-react';
import { useChallengeAccount } from '@/hooks/useLedger';
import { formatCurrency, getDDay } from '@/lib/utils';
import { formatUtcDateLabel } from '@/lib/utils/dateTime';
import { Skeleton } from '@/components/feedback';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { SemanticIcon } from '@/components/ui';
import styles from './ChallengeStats.module.css';

interface ChallengeStatsProps {
  challengeId?: string;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ChallengeStats({ challengeId: propChallengeId }: ChallengeStatsProps) {
  const { challengeId: routeChallengeId } = useChallengeRoute();
  const challengeId = propChallengeId || routeChallengeId;
  const { data: account, isLoading } = useChallengeAccount(challengeId);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <Skeleton height={60} />
        </div>
        <div className={styles.card}>
          <Skeleton height={60} />
        </div>
        <div className={styles.card}>
          <Skeleton height={60} />
        </div>
      </div>
    );
  }

  if (!account) return null;

  const balance = account.balance ?? 0;
  const monthlySupport = account.stats?.monthlyAverage ?? 0;
  const totalExpense = account.stats?.totalExpense ?? 0;
  const supportTotal = account.supportStatus?.total ?? 0;

  const today = new Date();
  const nextMonth = new Date(today.getUTCFullYear(), today.getUTCMonth() + 1, 1);
  const nextSupportDateStr = nextMonth.toISOString();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.label}>
            <SemanticIcon animated={false} name="wallet" size={14} /> 모임 잔액
          </span>
          <TrendingUp className={styles.trendIcon} size={14} />
        </div>
        <div className={styles.balance}>{formatCurrency(balance)}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>이번 달 납입</span>
          <span className={styles.income}>+{formatCurrency(monthlySupport)}</span>
        </div>
        <div className={styles.statSub}>{supportTotal}명 납입 대상</div>

        <div className={styles.divider} />

        <div className={styles.statRow}>
          <span className={styles.statLabel}>누적 지출</span>
          <span className={styles.expense}>-{formatCurrency(totalExpense)}</span>
        </div>
        <div className={styles.statSub}>전체 누적 기준</div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.label}>
            <SemanticIcon animated={false} name="meeting" size={14} /> 다음 납입일
          </span>
        </div>
        <div className={styles.dday}>{getDDay(nextSupportDateStr)}</div>
        <div className={styles.date}>{formatUtcDateLabel(nextSupportDateStr)}</div>
      </div>
    </div>
  );
}
