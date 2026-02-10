import { useNavigate } from 'react-router-dom';
import { Download, Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PATHS } from '@/routes/paths';
import { getMyProfile } from '@/lib/api/user';
import styles from './WalletPage.module.css';

export function WalletPage() {
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="나의 지갑" showBack />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </PageContainer>
    );
  }

  if (error || !user) {
    return (
      <PageContainer>
        <PageHeader title="나의 지갑" showBack />
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <div className="text-gray-500">지갑 정보를 불러올 수 없습니다.</div>
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
            onClick={() => navigate(PATHS.AUTH.LOGIN)}
          >
            로그인 하러 가기
          </button>
        </div>
      </PageContainer>
    );
  }

  // TODO: Add separate API for personal wallet transaction history
  const history: any[] = [];

  return (
    <PageContainer>
      <PageHeader title="나의 지갑" showBack />

      <div className={styles.balanceCard}>
        <span className={styles.balanceLabel}>보유 잔액</span>
        <div className={styles.balanceAmount}>
          {(user.account?.balance || 0).toLocaleString()}
          <span className={styles.currency}>Brix</span>
        </div>
      </div>

      <div className={styles.actionGrid}>
        <button
          className={styles.actionButton}
          onClick={() => navigate(PATHS.WALLET.CHARGE)}
        >
          <div className={styles.actionIcon}><Plus size={24} /></div>
          <span className={styles.actionLabel}>충전하기</span>
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate(PATHS.WALLET.WITHDRAW)}
        >
          <div className={styles.actionIcon}><Download size={24} /></div>
          <span className={styles.actionLabel}>출금하기</span>
        </button>
      </div>

      <div className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>최근 내역</h2>
        </div>

        <div className={styles.historyList}>
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <span className={styles.historyType}>{item.type}</span>
                  <span className={styles.historyDate}>{item.date}</span>
                </div>
                <span className={`${styles.historyAmount} ${item.isPlus ? styles.plus : styles.minus}`}>
                  {item.isPlus ? '+' : ''}{item.amount.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>거래 내역이 없습니다.</div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
