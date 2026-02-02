import styles from './HeroSection.module.css';
import { MainCarousel } from './Hero/MainCarousel';
import { SideBanner } from './Hero/SideBanner';

export function HeroSection() {
  return (
    <section className={styles.container}>
      {/* Main Carousel (Left) */}
      <MainCarousel />

      {/* Side Banner (Right) - Desktop Only */}
      <SideBanner />
    </section>
  );
}
