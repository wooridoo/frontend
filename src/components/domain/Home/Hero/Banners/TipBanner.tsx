import styles from './TipBanner.module.css';

export function TipBanner() {
  return (
    <div className={styles.bannerItem}>
      <span className={styles.bannerTag}>팁</span>
      <p className={styles.bannerText}>챌린지 성공 확률 높이는 법</p>
    </div>
  );
}
