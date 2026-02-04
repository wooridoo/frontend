import { useParams } from 'react-router-dom';
import { useChallengeAccount } from '@/hooks/useLedger';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { formatCurrency } from '@/utils/format';
import { ExpenseList } from './ExpenseList';
import styles from './ChallengeLedgerPage.module.css';

export function ChallengeLedgerPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useChallengeAccount(id);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-12 rounded-lg" />
        <Skeleton className="w-full h-24 rounded-lg" />
      </div>
    );
  }

  if (!data) return <div>장부 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      {/* 1. Summary Section */}
      <section className={styles.summaryCard}>
        <div className={styles.summaryLabel}>현재 잔액</div>
        <div className={styles.summaryBalance}>
          {formatCurrency(data.balance, { withSuffix: true })}
        </div>
        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>이번 달 입금</div>
            <div className={`${styles.statValue} ${styles.income}`}>
              +{formatCurrency(data.stats.monthlyAverage.support, { symbol: false })}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>이번 달 지출</div>
            <div className={`${styles.statValue} ${styles.expense}`}>
              -{formatCurrency(data.stats.monthlyAverage.expense, { symbol: false })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Support Status */}
      <section className={styles.statusSection}>
        <div className={styles.statusHeader}>
          <h3 className={styles.statusTitle}>이번 달 회비 납입 현황</h3>
          <span className={styles.statusInfo}>
            {data.supportStatus.thisMonth.paid}명 완료 / 총 {data.supportStatus.thisMonth.total}명
          </span>
        </div>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{
              width: `${(data.supportStatus.thisMonth.paid / data.supportStatus.thisMonth.total) * 100}%`
            }}
          />
        </div>
      </section>

      {/* 3. Transaction List */}
      <section className={styles.transactionSection}>
        <h3 className={styles.sectionTitle}>최근 거래 내역</h3>
        <div className={styles.transactionList}>
          {data.recentTransactions.map(tx => (
            <div key={tx.transactionId} className={styles.transactionItem}>
              <div className={styles.transactionInfo}>
                <div className={styles.transactionDesc}>
                  <span className={styles.typeBadge}>{tx.type}</span>
                  {tx.description}
                </div>
                <div className={styles.transactionDate}>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className={`${styles.transactionAmount} ${['SUPPORT', 'DEPOSIT'].includes(tx.type) ? styles.plus : styles.minus}`}>
                {['SUPPORT', 'DEPOSIT'].includes(tx.type) ? '+' : '-'}
                {formatCurrency(tx.amount, { symbol: false })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Expense List (New) */}
      <section className={styles.expenseSection}>
        <ExpenseList />
      </section>
    </div>
  );
}

