import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PATHS } from '@/routes/paths';
import styles from './WalletPage.module.css';

// Mock Data
const MOCK_WALLET = {
  balance: 12500,
  history: [
    { id: 1, type: '충전', amount: 30000, date: '2026.02.05 14:30', isPlus: true },
    { id: 2, type: '챌린지 참가비', amount: -5000, date: '2026.02.05 15:00', isPlus: false },
    { id: 3, type: '보증금 환급', amount: 10000, date: '2026.02.01 09:00', isPlus: true },
    { id: 4, type: '출금', amount: -22500, date: '2026.01.28 11:20', isPlus: false },
  ],
};

export function WalletPage() {
  const navigate = useNavigate();
  // TODO: Fetch wallet data
  const wallet = MOCK_WALLET;

  return (
    <PageContainer>
      <PageHeader title="나의 지갑" showBack />

      <div className={styles.balanceCard}>
        <span className={styles.balanceLabel}>보유 잔액</span>
        <div className={styles.balanceAmount}>
          {wallet.balance.toLocaleString()}
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
          {wallet.history.length > 0 ? (
            wallet.history.map((item) => (
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
