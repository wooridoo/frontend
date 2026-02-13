import { TrendingUp } from 'lucide-react';
import { useChallengeAccount } from '@/hooks/useLedger';
import { formatCurrency, getDDay } from '@/utils/format';
import { formatUtcDateLabel } from '@/lib/utils/dateTime';
import { Skeleton } from '@/components/feedback';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { SemanticIcon } from '@/components/ui';
import styles from './ChallengeStats.module.css';

interface ChallengeStatsProps {
  challengeId?: string;
}

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
  const monthlyAverage = account.stats?.monthlyAverage ?? { support: 0, expense: 0 };
  const supportTotal = account.supportStatus?.thisMonth?.total ?? 0;

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
          <TrendingUp size={14} style={{ color: 'var(--color-status-success)' }} />
        </div>
        <div className={styles.balance}>{formatCurrency(balance)}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>이번 달 수입</span>
          <span className={styles.income}>+{formatCurrency(monthlyAverage.support)}</span>
        </div>
        <div className={styles.statSub}>{supportTotal}명 서포트 예정</div>

        <div className={styles.divider} />

        <div className={styles.statRow}>
          <span className={styles.statLabel}>이번 달 지출</span>
          <span className={styles.expense}>-{formatCurrency(monthlyAverage.expense)}</span>
        </div>
        <div className={styles.statSub}>예상치 포함</div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.label}>
            <SemanticIcon animated={false} name="meeting" size={14} /> 다음 서포트일
          </span>
        </div>
        <div className={styles.dday}>{getDDay(nextSupportDateStr)}</div>
        <div className={styles.date}>{formatUtcDateLabel(nextSupportDateStr)}</div>
      </div>
    </div>
  );
}
