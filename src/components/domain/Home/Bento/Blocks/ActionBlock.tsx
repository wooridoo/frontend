import styles from './ActionBlock.module.css';
import { Clock, CheckCircle } from 'lucide-react';

export function ActionBlock() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>오늘의 인증</span>
        <Clock size={18} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.timer}>
          <span className={styles.time}>03:22</span>
          <span className={styles.timeLabel}>남음</span>
        </div>
        <button className={styles.button}>
          <CheckCircle size={20} />
          <span>인증하기</span>
        </button>
      </div>
    </div>
  );
}
