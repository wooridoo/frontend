import { useNavigate } from 'react-router-dom';
import { useMyAccount, useTransactionHistoryInfinite } from '@/hooks/useAccount';
import { useCreditChargeModalStore } from '@/store/useCreditChargeModalStore';
import { useWithdrawModalStore } from '@/store/useWithdrawModalStore';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types/account';
import styles from './AccountPage.module.css';

export function AccountPage() {
    const navigate = useNavigate();
    const { data: account, isLoading: accountLoading } = useMyAccount();
    const { data: transactionsData } = useTransactionHistoryInfinite({ size: 5 });
    const { onOpen: openChargeModal } = useCreditChargeModalStore();
    const { onOpen: openWithdrawModal } = useWithdrawModalStore();

    if (accountLoading) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    // Handle wrapped response
    const accountData = account && typeof account === 'object' && 'data' in account ? account.data : account;
    const transactions: Transaction[] = transactionsData?.pages?.[0]?.data?.transactions || [];

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>내 지갑</h1>
                <p className={styles.subtitle}>크레딧을 충전하고 관리하세요</p>
            </div>

            {/* Balance Card */}
            <div className={styles.balanceCard}>
                <div className={styles.balanceLabel}>사용 가능 잔액</div>
                <div className={styles.balanceAmount}>
                    {formatCurrency(accountData?.availableBalance || 0)}
                </div>
                <div className={styles.balanceDetails}>
                    <div className={styles.balanceItem}>
                        <span className={styles.balanceItemLabel}>총 잔액</span>
                        <span className={styles.balanceItemValue}>
                            {formatCurrency(accountData?.balance || 0)}
                        </span>
                    </div>
                    <div className={styles.balanceItem}>
                        <span className={styles.balanceItemLabel}>잠긴 금액</span>
                        <span className={styles.balanceItemValue}>
                            {formatCurrency(accountData?.lockedBalance || 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <button className={styles.actionButton} onClick={openChargeModal}>
                    <span className={styles.actionIcon}>💳</span>
                    <span className={styles.actionLabel}>충전하기</span>
                </button>
                <button className={styles.actionButton} onClick={openWithdrawModal}>
                    <span className={styles.actionIcon}>🏦</span>
                    <span className={styles.actionLabel}>출금하기</span>
                </button>
            </div>

            {/* Recent Transactions */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>최근 거래</h2>
                    <span
                        className={styles.viewAllLink}
                        onClick={() => navigate('/me/account/transactions')}
                    >
                        전체보기
                    </span>
                </div>

                {transactions.length === 0 ? (
                    <div className={styles.empty}>거래 내역이 없습니다</div>
                ) : (
                    <ul className={styles.transactionList}>
                        {transactions.map((tx) => {
                            const icon = getTransactionIcon(tx.type);
                            const isPositive = ['CHARGE', 'DEPOSIT', 'REFUND'].includes(tx.type);
                            return (
                                <li key={tx.transactionId} className={styles.transactionItem}>
                                    <div className={styles.transactionInfo}>
                                        <div className={`${styles.transactionIcon} ${icon.className}`}>
                                            {icon.emoji}
                                        </div>
                                        <div className={styles.transactionDetails}>
                                            <span className={styles.transactionType}>{tx.description || tx.type}</span>
                                            <span className={styles.transactionDate}>{formatDate(tx.createdAt)}</span>
                                        </div>
                                    </div>
                                    <span className={`${styles.transactionAmount} ${isPositive ? styles.positive : styles.negative}`}>
                                        {isPositive ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
