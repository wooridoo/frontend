import { useMemo, useState } from 'react';
import { useTransactionHistoryInfinite } from '@/hooks/useAccount';
import { Button, SemanticIcon } from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types/account';
import styles from './TransactionHistoryPage.module.css';

type FilterType = 'all' | 'deposit' | 'withdraw' | 'support';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'deposit', label: '충전' },
  { value: 'withdraw', label: '출금' },
  { value: 'support', label: '서포트' },
];

function formatUtcDate(dateString: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString));
}

function formatUtcTime(dateString: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date(dateString));
}

function getTransactionMeta(type: string) {
  switch (type) {
    case 'CHARGE':
    case 'DEPOSIT':
      return { icon: 'charge' as const, className: styles.deposit, positive: true };
    case 'WITHDRAW':
      return { icon: 'withdraw' as const, className: styles.withdraw, positive: false };
    case 'SUPPORT':
    case 'SUPPORT_AUTO':
      return { icon: 'ledger' as const, className: styles.support, positive: false };
    default:
      return { icon: 'action' as const, className: '', positive: false };
  }
}

export function TransactionHistoryPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTransactionHistoryInfinite({
    size: 20,
  });

  const allTransactions: Transaction[] = useMemo(
    () => data?.pages?.flatMap(page => page.transactions || []) || [],
    [data?.pages]
  );

  const filteredTransactions = useMemo(
    () =>
      allTransactions.filter(tx => {
        if (filter === 'all') return true;
        if (filter === 'deposit') return ['CHARGE', 'DEPOSIT', 'REFUND'].includes(tx.type);
        if (filter === 'withdraw') return tx.type === 'WITHDRAW';
        if (filter === 'support') return ['SUPPORT', 'SUPPORT_AUTO'].includes(tx.type);
        return true;
      }),
    [allTransactions, filter]
  );

  const groupedTransactions = useMemo(
    () =>
      filteredTransactions.reduce(
        (acc, tx) => {
          const date = formatUtcDate(tx.createdAt);
          if (!acc[date]) acc[date] = [];
          acc[date].push(tx);
          return acc;
        },
        {} as Record<string, Transaction[]>
      ),
    [filteredTransactions]
  );

  if (isLoading) {
    return (
      <PageContainer variant="content" contentWidth="md">
        <PageHeader showBack title="거래 내역" />
        <div className={styles.loading}>로딩 중...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="content" contentWidth="md">
      <PageHeader showBack title="거래 내역" />

      <div className={styles.filters}>
        {FILTER_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            className={`${styles.filterButton} ${filter === opt.value ? styles.active : ''}`}
            onClick={() => setFilter(opt.value)}
            shape="pill"
            size="sm"
            variant={filter === opt.value ? 'primary' : 'outline'}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className={styles.empty}>거래 내역이 없습니다.</div>
      ) : (
        <div className={styles.transactionList}>
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date} className={styles.dateGroup}>
              <div className={styles.dateHeader}>{date} UTC</div>
              {transactions.map(tx => {
                const meta = getTransactionMeta(tx.type);

                return (
                  <div key={tx.transactionId} className={styles.transactionItem}>
                    <div className={styles.transactionInfo}>
                      <div className={`${styles.transactionIcon} ${meta.className}`}>
                        <SemanticIcon animated={false} name={meta.icon} size={14} />
                      </div>
                      <div className={styles.transactionDetails}>
                        <span className={styles.transactionType}>{tx.description || tx.type}</span>
                        <span className={styles.transactionMeta}>{formatUtcTime(tx.createdAt)} UTC</span>
                      </div>
                    </div>
                    <div className={styles.transactionAmountSection}>
                      <div className={`${styles.transactionAmount} ${meta.positive ? styles.positive : styles.negative}`}>
                        {meta.positive ? '+' : '-'}
                        {formatCurrency(Math.abs(tx.amount))}
                      </div>
                      <div className={styles.transactionBalance}>잔액 {formatCurrency(tx.balanceAfter)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {hasNextPage ? (
            <div className={styles.loadMore}>
              <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} variant="secondary">
                {isFetchingNextPage ? '로딩 중...' : '더 보기'}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </PageContainer>
  );
}
