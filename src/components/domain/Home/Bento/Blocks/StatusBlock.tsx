import styles from './StatusBlock.module.css';
import { Target } from 'lucide-react';

export function StatusBlock() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>내 당도</span>
        <Target size={18} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <span className={styles.value}>72g</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: '72%' }}></div>
        </div>
        <p className={styles.subtext}>다음 등급까지 28g</p>
      </div>
    </div>
  );
}
