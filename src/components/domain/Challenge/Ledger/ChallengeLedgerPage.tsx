import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { Button } from '@/components/ui';
import { useChallengeAccount, useChallengeAccountGraph } from '@/hooks/useLedger';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useExpenseCreateModalStore, useSupportSettingsModalStore } from '@/store/modal/useModalStore';
import { formatCurrency } from '@/lib/utils';
import { ExpenseList } from './ExpenseList';
import { capabilities } from '@/lib/api/capabilities';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './ChallengeLedgerPage.module.css';

const incomeTypes = ['SUPPORT', 'DEPOSIT', 'ENTRY_FEE', 'REFUND'];

export function ChallengeLedgerPage() {
  const { challengeId } = useChallengeRoute();
  const { data, isLoading, error: accountError } = useChallengeAccount(challengeId);
  const { data: graphData, isLoading: graphLoading, error: graphError } = useChallengeAccountGraph(challengeId, 6);
  const { onOpen: openExpenseCreate } = useExpenseCreateModalStore();
  const { onOpen: openSupportSettings } = useSupportSettingsModalStore();

  if (isLoading || graphLoading) {
    return (
      <div className={styles.container}>
        <Skeleton className="w-full h-40 rounded-xl" />
        <Skeleton className="w-full h-56 rounded-lg" />
        <Skeleton className="w-full h-24 rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return <div>{accountError ? '장부 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' : '장부 정보를 불러오지 못했습니다.'}</div>;
  }

  const paidCount = data.supportStatus?.paid || 0;
  const totalCount = data.supportStatus?.total || 0;
  const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

  const chartRows = (graphData?.monthlyExpenses || []).map((expensePoint) => {
    const balancePoint = graphData?.monthlyBalances?.find((balance) => balance.month === expensePoint.month);
    return {
      month: expensePoint.month,
      expense: expensePoint.expense,
      balance: balancePoint?.balance ?? null,
    };
  });
  const hasGraphData = chartRows.length > 0;

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

      <section className={styles.chartSection}>
        <h3 className={styles.sectionTitle}>월별 소비/잔액 그래프</h3>
        {hasGraphData ? (
          <div className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(Number(value), { symbol: false })} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(Number(value), { symbol: false })} />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value), { symbol: false }),
                    name === 'expense' ? '월별 소비' : '월말 잔액',
                  ]}
                />
                <Bar yAxisId="left" dataKey="expense" fill="#F97316" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="balance" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : graphError ? (
          <div className={styles.errorState}>그래프 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>
        ) : (
          <div className={styles.transactionItem}>표시할 그래프 데이터가 없습니다.</div>
        )}
      </section>

      <section className={styles.statusSection}>
        <div className={styles.statusHeader}>
          <h3 className={styles.statusTitle}>이번 달 서포트비 납부 현황</h3>
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
          <div className={styles.expenseActions}>
            <Button variant="ghost" onClick={() => challengeId && openSupportSettings(challengeId)}>
              서포트비 설정
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
