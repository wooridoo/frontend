import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MainCarousel.module.css';

const SLIDES = [
  {
    id: 1,
    label: '2월의 챌린지',
    title: '함께하면 더 쉬운\n습관 만들기',
    description: '혼자서는 작심삼일이라면?\n우리두와 함께 매일 조금씩 성장해요.',
    emoji: '🚀',
    action: '지금 시작하기',
    bgClass: 'bg-primary-50'
  },
  {
    id: 2,
    label: '신규 기능',
    title: '인증하고\n포인트 받자!',
    description: '매일매일 챌린지 인증하면\n현금처럼 쓸 수 있는 릭스를 드려요.',
    emoji: '📸',
    action: '인증하러 가기',
    bgClass: 'bg-orange-50'
  },
  {
    id: 3,
    label: '커뮤니티',
    title: '같은 목표를 가진\n사람들과 함께',
    description: '서로 응원하고 격려하며\n목표를 달성해보세요.',
    emoji: '🤝',
    action: '모임 둘러보기',
    bgClass: 'bg-blue-50'
  }
];

export function MainCarousel() {
  const { user } = useAuthGuard();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={styles.track}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className={clsx(styles.slide, slide.bgClass)}>
            <div className={styles.content}>
              <div className={styles.textContent}>
                <span className={styles.label}>{slide.label}</span>
                <h2 className={styles.title}>
                  {/* Personalize first slide if user exists */}
                  {slide.id === 1 && user
                    ? `${user.name}님, \n새로운 습관을 시작해보세요!`
                    : slide.title}
                </h2>
                <p className={styles.description}>{slide.description}</p>
                <div className={styles.actions}>
                  <Button variant="primary" size="lg">{slide.action}</Button>
                </div>
              </div>
              <div className={styles.imageWrapper}>
                <span className={styles.emoji}>{slide.emoji}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={prevSlide} className={styles.controlBtn}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className={styles.controlBtn}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicators */}
      <div className={styles.indicators}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={clsx(styles.indicator, idx === currentSlide && styles.active)}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}
