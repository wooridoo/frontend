import { MainCarousel } from '../../Hero/MainCarousel';
import styles from './HeroBlock.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function HeroBlock() {
  return (
    <div className={styles.container}>
      <MainCarousel />
    </div>
  );
}
