import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MainCarousel.module.css';
import { Link } from 'react-router-dom';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';

const SLIDES = [
  {
    id: 1,
    label: '새로운 시작',
    title: '나만의 챌린지를\n만들어보세요',
    description: '원하는 목표를 설정하고\n친구들과 함께 달성해보세요.',
    emoji: '✨',
    action: '챌린지 만들기',
    link: CHALLENGE_ROUTES.NEW,
    bgClass: 'bg-primary-50'
  },
  {
    id: 2,
    label: '탐색하기',
    title: '지금 뜨는 챌린지\n참여하기',
    description: '다른 사람들은 어떤 목표를\n달성하고 있을까요?',
    emoji: '🔥',
    action: '챌린지 구경가기',
    link: '/explore',
    bgClass: 'bg-orange-50'
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
                  <Link to={slide.link}>
                    <Button variant="primary" size="lg">{slide.action}</Button>
                  </Link>
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
