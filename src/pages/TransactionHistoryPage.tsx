import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionHistoryInfinite } from '@/hooks/useAccount';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import type { Transaction } from '@/types/account';
import styles from './TransactionHistoryPage.module.css';

type FilterType = 'all' | 'deposit' | 'withdraw' | 'support';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'deposit', label: '충전' },
    { value: 'withdraw', label: '출금' },
    { value: 'support', label: '서포트' },
];

export function TransactionHistoryPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<FilterType>('all');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useTransactionHistoryInfinite({ size: 20 });

    const allTransactions: Transaction[] = data?.pages?.flatMap(page => page.data?.transactions || []) || [];

    const filteredTransactions = allTransactions.filter(tx => {
        if (filter === 'all') return true;
        if (filter === 'deposit') return ['CHARGE', 'DEPOSIT', 'REFUND'].includes(tx.type);
        if (filter === 'withdraw') return tx.type === 'WITHDRAW';
        if (filter === 'support') return ['SUPPORT', 'SUPPORT_AUTO'].includes(tx.type);
        return true;
    });

    // Group by date
    const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
        const date = new Date(tx.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(tx);
        return acc;
    }, {} as Record<string, typeof filteredTransactions>);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'CHARGE':
            case 'DEPOSIT':
                return { emoji: '💰', className: styles.deposit };
            case 'WITHDRAW':
                return { emoji: '💸', className: styles.withdraw };
            case 'SUPPORT':
            case 'SUPPORT_AUTO':
                return { emoji: '🤝', className: styles.support };
            default:
                return { emoji: '📋', className: '' };
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>거래 내역</h1>
                <button className={styles.backButton} onClick={() => navigate(PATHS.MY.ACCOUNT)}>
                    ← 돌아가기
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                {FILTER_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        className={`${styles.filterButton} ${filter === opt.value ? styles.active : ''}`}
                        onClick={() => setFilter(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
                <div className={styles.empty}>
                    거래 내역이 없습니다
                </div>
            ) : (
                <div className={styles.transactionList}>
                    {Object.entries(groupedTransactions).map(([date, transactions]) => (
                        <div key={date} className={styles.dateGroup}>
                            <div className={styles.dateHeader}>{date}</div>
                            {transactions.map((tx) => {
                                const icon = getTransactionIcon(tx.type);
                                const isPositive = ['CHARGE', 'DEPOSIT', 'REFUND'].includes(tx.type);
                                return (
                                    <div key={tx.transactionId} className={styles.transactionItem}>
                                        <div className={styles.transactionInfo}>
                                            <div className={`${styles.transactionIcon} ${icon.className}`}>
                                                {icon.emoji}
                                            </div>
                                            <div className={styles.transactionDetails}>
                                                <span className={styles.transactionType}>
                                                    {tx.description || tx.type}
                                                </span>
                                                <span className={styles.transactionMeta}>
                                                    {formatTime(tx.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.transactionAmountSection}>
                                            <div className={`${styles.transactionAmount} ${isPositive ? styles.positive : styles.negative}`}>
                                                {isPositive ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                            </div>
                                            <div className={styles.transactionBalance}>
                                                잔액 {formatCurrency(tx.balanceAfter)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {hasNextPage && (
                        <div className={styles.loadMore}>
                            <Button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                variant="secondary"
                            >
                                {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
