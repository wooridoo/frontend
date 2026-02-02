import styles from './TipBlock.module.css';
import { Lightbulb } from 'lucide-react';

export function TipBlock() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Lightbulb size={18} className={styles.icon} />
        <span className={styles.label}>오늘의 팁</span>
      </div>
      <p className={styles.content}>
        작은 습관이<br />
        큰 변화를 만듭니다.
      </p>
    </div>
  );
}
