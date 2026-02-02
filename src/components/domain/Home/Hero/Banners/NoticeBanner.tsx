import styles from './NoticeBanner.module.css';

export function NoticeBanner() {
  return (
    <div className={styles.bannerItem}>
      <span className={styles.bannerTag}>공지</span>
      <p className={styles.bannerText}>WooriDo 서비스 점검 안내</p>
    </div>
  );
}
