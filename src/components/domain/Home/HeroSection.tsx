import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lottie from 'lottie-react';
import heroAnimation from '@/assets/lottie/hero-animation.json'; // Ensure this path exists or use fallback
import styles from './HeroSection.module.css';

interface Slide {
  id: number;
  content: React.ReactNode;
  backgroundColor: string;
}

const drafts: Slide[] = [
  {
    id: 1,
    content: (
      <div className={styles.slideContent}>
        <div className={styles.textArea}>
          <h2 className={styles.slideTitle}>함께하는 즐거움<br />우리두 챌린지</h2>
          <p className={styles.slideDesc}>동료들과 함께 목표를 달성해보세요.</p>
        </div>
        <div className={styles.lottieWrapper}>
          {/* Placeholder for Lottie if import fails, logic handled below */}
        </div>
      </div>
    ),
    backgroundColor: '#FFF7ED', // orange-50
  },
  {
    id: 2,
    content: (
      <div className={styles.slideContent}>
        <div className={styles.textArea}>
          <h2 className={styles.slideTitle}>신규 가입 이벤트<br />당도 10g 지급!</h2>
          <p className={styles.slideDesc}>지금 시작하고 혜택을 받아보세요.</p>
        </div>
      </div>
    ),
    backgroundColor: '#F3E8FF', // purple-100 equivalent
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % drafts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % drafts.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + drafts.length) % drafts.length);

  return (
    <section className={styles.container}>
      {/* Main Carousel (Left) */}
      <div className={styles.carousel}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {drafts.map((slide) => (
            <div
              key={slide.id}
              className={styles.slide}
              style={{ backgroundColor: slide.backgroundColor }}
            >
              {slide.id === 1 ? (
                <div className={styles.slideContent}>
                  <div className={styles.textArea}>
                    <h2 className={styles.slideTitle}>함께하는 즐거움<br />우리두 챌린지</h2>
                    <p className={styles.slideDesc}>동료들과 함께 목표를 달성해보세요.</p>
                  </div>
                  <div className={styles.lottieWrapper}>
                    <Lottie animationData={heroAnimation} loop={true} className={styles.lottie} />
                  </div>
                </div>
              ) : slide.content}
            </div>
          ))}
        </div>

        {/* Controls */}
        <button className={clsx(styles.control, styles.prev)} onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button className={clsx(styles.control, styles.next)} onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className={styles.indicators}>
          <span className={styles.pageNumber}>
            {currentSlide + 1} / {drafts.length}
          </span>
        </div>
      </div>

      {/* Side Banner (Right) - Desktop Only */}
      <div className={styles.sideBanner}>
        <div className={styles.bannerItem}>
          <span className={styles.bannerTag}>공지</span>
          <p className={styles.bannerText}>WooriDo 서비스 점검 안내</p>
        </div>
        <div className={styles.bannerItem} style={{ backgroundColor: '#E0F2FE' }}>
          <span className={styles.bannerTag} style={{ color: '#0284C7' }}>팁</span>
          <p className={styles.bannerText}>챌린지 성공 확률 높이는 법</p>
        </div>
      </div>
    </section>
  );
}
