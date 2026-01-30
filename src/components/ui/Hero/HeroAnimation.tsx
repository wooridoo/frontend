import Lottie from 'lottie-react';
import animationData from '@/assets/lottie/brix-badge.json';
import clsx from 'clsx';
import styles from './HeroAnimation.module.css';

interface HeroAnimationProps {
  className?: string;
}

export function HeroAnimation({ className }: HeroAnimationProps) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.content}>
        <h2 className={styles.title}>함께하면 더 쉬운 저축</h2>
        <p className={styles.subtitle}>월 10만원 챌린지로 시작해보세요!</p>
        <button className={styles.ctaButton}>지금 시작하기</button>
      </div>

      <div className={styles.graphic}>
        <Lottie
          animationData={animationData}
          loop={true}
          className={styles.lottie}
        />
      </div>
    </div>
  );
}
