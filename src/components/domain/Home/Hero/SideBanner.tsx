import styles from './SideBanner.module.css';
import { NoticeBanner } from './Banners/NoticeBanner';
import { TipBanner } from './Banners/TipBanner';

export function SideBanner() {
  return (
    <aside className={styles.sideBanner}>
      <NoticeBanner />
      <TipBanner />
    </aside>
  );
}
