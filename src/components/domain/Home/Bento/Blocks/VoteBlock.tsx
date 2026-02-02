import styles from './VoteBlock.module.css';
import { Vote, Calendar } from 'lucide-react';
import { useLoginModalStore } from '@/store/useLoginModalStore';

export function VoteBlock() {
  const { onOpen } = useLoginModalStore();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>정기 모임</span>
        <Vote size={18} className={styles.icon} />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <Calendar size={14} className={styles.infoIcon} />
          <span className={styles.date}>12월 28일 (금) 19:00</span>
        </div>
        <p className={styles.question}>이번 주 모임 참석하시나요?</p>

        <div className={styles.actions}>
          <button className={styles.voteBtn} onClick={onOpen}>
            ⭕ 참석
          </button>
          <button className={`${styles.voteBtn} ${styles.secondary}`} onClick={onOpen}>
            ❌ 불참
          </button>
        </div>
      </div>
    </div>
  );
}
