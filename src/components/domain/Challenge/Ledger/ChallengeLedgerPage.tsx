import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { Button } from '@/components/ui';
import { useChallengeAccount } from '@/hooks/useLedger';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useExpenseCreateModalStore, useSupportSettingsModalStore } from '@/store/modal/useModalStore';
import { formatCurrency } from '@/utils/format';
import { ExpenseList } from './ExpenseList';
import { capabilities } from '@/lib/api/capabilities';
import styles from './ChallengeLedgerPage.module.css';

const incomeTypes = ['SUPPORT', 'DEPOSIT', 'ENTRY_FEE', 'REFUND'];

export function ChallengeLedgerPage() {
  const { challengeId } = useChallengeRoute();
  const { data, isLoading } = useChallengeAccount(challengeId);
  const { onOpen: openExpenseCreate } = useExpenseCreateModalStore();
  const { onOpen: openSupportSettings } = useSupportSettingsModalStore();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-12 rounded-lg" />
        <Skeleton className="w-full h-24 rounded-lg" />
      </div>
    );
  }

  if (!data) return <div>회계 정보를 불러오지 못했습니다.</div>;

  const paidCount = data.supportStatus?.paid || 0;
  const totalCount = data.supportStatus?.total || 0;
  const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

  return (
    <div className={styles.container}>
      <section className={styles.summaryCard}>
        <div className={styles.summaryLabel}>현재 잔액</div>
        <div className={styles.summaryBalance}>{formatCurrency(data.balance, { withSuffix: true })}</div>
        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>이번 달 평균</div>
            <div className={`${styles.statValue} ${styles.income}`}>
              +{formatCurrency(data.stats.monthlyAverage, { symbol: false })}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>누적 지출</div>
            <div className={`${styles.statValue} ${styles.expense}`}>
              -{formatCurrency(data.stats.totalExpense, { symbol: false })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statusSection}>
        <div className={styles.statusHeader}>
          <h3 className={styles.statusTitle}>이번 달 회비 납부 현황</h3>
          <span className={styles.statusInfo}>
            {paidCount}명 완료 / 총 {totalCount}명
          </span>
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className={styles.transactionSection}>
        <h3 className={styles.sectionTitle}>최근 거래 내역</h3>
        <div className={styles.transactionList}>
          {data.recentTransactions.length > 0 ? (
            data.recentTransactions.map((tx) => (
              <div key={tx.transactionId} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionDesc}>
                    <span className={styles.typeBadge}>{tx.type}</span>
                    {tx.description}
                  </div>
                  <div className={styles.transactionDate}>{new Date(tx.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={`${styles.transactionAmount} ${incomeTypes.includes(tx.type) ? styles.plus : styles.minus}`}>
                  {incomeTypes.includes(tx.type) ? '+' : '-'}
                  {formatCurrency(Math.abs(tx.amount), { symbol: false })}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.transactionItem}>거래 내역이 없습니다.</div>
          )}
        </div>
      </section>

      <section className={styles.expenseSection}>
        <div className={styles.statusHeader}>
          <h3 className={styles.sectionTitle}>지출 관리</h3>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => challengeId && openSupportSettings(challengeId)}>
              서포트 설정
            </Button>
            {capabilities.expenseActions ? (
              <Button onClick={() => challengeId && openExpenseCreate(challengeId)}>지출 등록</Button>
            ) : null}
          </div>
        </div>
        <ExpenseList />
      </section>
    </div>
  );
}
