import styles from './ChallengeStats.module.css';
import { TrendingUp } from 'lucide-react';

export function ChallengeStats() {
  return (
    <div className={styles.container}>
      {/* 1. Total Balance */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.label}>💰 모임 잔액</span>
          <TrendingUp size={14} className="text-green-500" />
        </div>
        <div className={styles.balance}>₩4,259,000</div>
      </div>

      {/* 2. Monthly Stats */}
      <div className={styles.card}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>이번 달 수입</span>
          <span className={styles.income}>+₩500,000</span>
        </div>
        <div className={styles.statSub}>10명 서포트</div>

        <div className={styles.divider} />

        <div className={styles.statRow}>
          <span className={styles.statLabel}>이번 달 지출</span>
          <span className={styles.expense}>-₩350,000</span>
        </div>
        <div className={styles.statSub}>3건</div>
      </div>

      {/* 3. D-Day / Schedule */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.label}>📅 다음 서포트일</span>
        </div>
        <div className={styles.dday}>D-11</div>
        <div className={styles.date}>2026-02-01</div>
      </div>
    </div>
  );
}
