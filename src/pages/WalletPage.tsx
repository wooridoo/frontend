import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { useMyAccount, useTransactionHistoryInfinite } from '@/hooks/useAccount';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PATHS } from '@/routes/paths';
import { useCreditChargeModalStore, useLoginModalStore, useWithdrawModalStore } from '@/store/modal/useModalStore';
import { formatCurrency } from '@/lib/utils';
import { formatUtcDateLabel } from '@/lib/utils/dateTime';
import { Button, SemanticIcon } from '@/components/ui';
import type { Transaction } from '@/types/account';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import styles from './WalletPage.module.css';

const positiveTypes: Transaction['type'][] = ['CHARGE', 'DEPOSIT', 'REFUND'];

function getTransactionMeta(type: Transaction['type']) {
  if (positiveTypes.includes(type)) {
    return { icon: 'charge' as const, positive: true };
  }

  if (type === 'WITHDRAW') {
    return { icon: 'withdraw' as const, positive: false };
  }

  if (type === 'SUPPORT' || type === 'SUPPORT_AUTO' || type === 'PAYMENT') {
    return { icon: 'ledger' as const, positive: false };
  }

  return { icon: 'action' as const, positive: false };
}

export function WalletPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onOpen: openLogin } = useLoginModalStore();
  const { onOpen: openChargeModal } = useCreditChargeModalStore();
  const { onOpen: openWithdrawModal } = useWithdrawModalStore();

  const { data: account, isLoading: accountLoading, error: accountError } = useMyAccount();
  const { data: transactionPages, isLoading: txLoading } = useTransactionHistoryInfinite({ size: 10 });

  const transactions = useMemo(
    () => transactionPages?.pages.flatMap(page => page.transactions).slice(0, 5) ?? [],
    [transactionPages?.pages]
  );

  if (accountLoading || txLoading) {
    return (
      <PageContainer variant="content" contentWidth="md">
        <PageHeader title="나의 지갑" showBack />
        <div className={styles.centerContainer}>
          <Loader2 className={styles.loadingIcon} size={32} />
        </div>
      </PageContainer>
    );
  }

  if (accountError || !account) {
    const returnTo = sanitizeReturnToPath(`${location.pathname}${location.search}${location.hash}`, PATHS.HOME);

    return (
      <PageContainer variant="content" contentWidth="md">
        <PageHeader title="나의 지갑" showBack />
        <div className={styles.centerContainer}>
          <div className={styles.errorText}>지갑 정보를 불러오지 못했습니다.</div>
          <Button
            className={styles.loginButton}
            onClick={() => openLogin({ returnTo, redirectOnReject: PATHS.HOME, message: '로그인이 필요합니다.' })}
            variant="secondary"
          >
            로그인 하러 가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="content" contentWidth="md">
      <PageHeader title="나의 지갑" showBack />

      <div className={styles.balanceCard}>
        <span className={styles.balanceLabel}>사용 가능 금액</span>
        <div className={styles.balanceAmount}>
          {formatCurrency(account.availableBalance)}
          <span className={styles.currency}>원</span>
        </div>
        <span className={styles.balanceLabel}>총 잔액 {formatCurrency(account.balance)}</span>
        <span className={styles.balanceLabel}>락업 금액 {formatCurrency(account.lockedBalance)}</span>
      </div>

      <div className={styles.actionGrid}>
        <Button className={styles.actionButton} onClick={openChargeModal} variant="secondary">
          <div className={styles.actionIcon}>
            <SemanticIcon name="charge" size={28} />
          </div>
          <span className={styles.actionLabel}>충전하기</span>
        </Button>
        <Button className={styles.actionButton} onClick={openWithdrawModal} variant="secondary">
          <div className={styles.actionIcon}>
            <SemanticIcon name="withdraw" size={28} />
          </div>
          <span className={styles.actionLabel}>출금하기</span>
        </Button>
      </div>

      <div className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>최근 거래</h2>
          <Button
            className={styles.viewAllButton}
            onClick={() => navigate('/me/ledger/transactions')}
            size="sm"
            trailingIcon={<ChevronRight size={14} />}
            variant="text"
          >
            전체보기
          </Button>
        </div>

        <div className={styles.historyList}>
          {transactions.length > 0 ? (
            transactions.map(item => {
              const meta = getTransactionMeta(item.type);
              const amount = Math.abs(item.amount);

              return (
                <div key={item.transactionId} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyTypeRow}>
                      <SemanticIcon
                        animated={false}
                        className={styles.historyTypeIcon}
                        name={meta.icon}
                        size={16}
                      />
                      <span className={styles.historyType}>{item.description || item.type}</span>
                    </div>
                    <span className={styles.historyDate}>{formatUtcDateLabel(item.createdAt)}</span>
                  </div>
                  <span className={`${styles.historyAmount} ${meta.positive ? styles.plus : styles.minus}`}>
                    {meta.positive ? '+' : '-'}
                    {formatCurrency(amount)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <SemanticIcon animated={false} name="empty" size={20} />
              거래 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
