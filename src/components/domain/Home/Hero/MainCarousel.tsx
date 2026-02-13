import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, SemanticIcon } from '@/components/ui';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './MainCarousel.module.css';

const SLIDES = [
  {
    id: 1,
    label: '새로운 시작',
    title: '나만의 챌린지를\n만들어보세요',
    description: '명확한 목표를 설정하고\n친구와 함께 달성해보세요.',
    icon: 'challenge' as const,
    action: '챌린지 만들기',
    link: CHALLENGE_ROUTES.NEW,
    bgClass: 'bg-primary-50',
  },
  {
    id: 2,
    label: '탐색하기',
    title: '지금 뜨는 챌린지\n참여하기',
    description: '다른 사람들이 어떤 목표를\n달성하고 있는지 확인해보세요.',
    icon: 'action' as const,
    action: '챌린지 보러가기',
    link: '/explore',
    bgClass: 'bg-orange-50',
  },
];

export function MainCarousel() {
  const { user } = useAuthGuard();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className={styles.carousel} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className={styles.track} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {SLIDES.map(slide => (
          <div key={slide.id} className={clsx(styles.slide, slide.bgClass)}>
            <div className={styles.content}>
              <div className={styles.textContent}>
                <span className={styles.label}>{slide.label}</span>
                <h2 className={styles.title}>
                  {slide.id === 1 && user ? `${user.name}님,\n새로운 도전을 시작해보세요!` : slide.title}
                </h2>
                <p className={styles.description}>{slide.description}</p>
                <div className={styles.actions}>
                  <Link to={slide.link}>
                    <Button size="lg" variant="primary">
                      {slide.action}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className={styles.imageWrapper}>
                <span className={styles.emoji}>
                  <SemanticIcon name={slide.icon} size={56} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={prevSlide}>
          <ChevronLeft size={20} />
        </button>
        <button className={styles.controlBtn} onClick={nextSlide}>
          <ChevronRight size={20} />
        </button>
      </div>

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
