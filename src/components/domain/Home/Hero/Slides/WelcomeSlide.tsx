import Lottie from 'lottie-react';
import heroAnimation from '@/assets/lottie/hero-animation.json';
import styles from './WelcomeSlide.module.css';

export function WelcomeSlide() {
  return (
    <article className={styles.slideContent}>
      <div className={styles.textArea}>
        <h2 className={styles.slideTitle}>함께하는 즐거움<br />우리두 챌린지</h2>
        <p className={styles.slideDesc}>동료들과 함께 목표를 달성해보세요.</p>
      </div>
      <div className={styles.lottieWrapper}>
        <Lottie animationData={heroAnimation} loop={true} className={styles.lottie} />
      </div>
    </article>
  );
}
