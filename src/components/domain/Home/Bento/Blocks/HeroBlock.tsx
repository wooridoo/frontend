import { MainCarousel } from '../../Hero/MainCarousel';
import styles from './HeroBlock.module.css';

export function HeroBlock() {
  return (
    <div className={styles.container}>
      <MainCarousel />
    </div>
  );
}
