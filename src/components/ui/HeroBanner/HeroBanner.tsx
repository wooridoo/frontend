import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import styles from './HeroBanner.module.css';

interface BannerSlide {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

interface HeroBannerProps {
  className?: string;
  slides: BannerSlide[];
  autoPlayInterval?: number;
  onSlideClick?: (slide: BannerSlide) => void;
}

export function HeroBanner({
  className,
  slides,
  autoPlayInterval = 5000,
  onSlideClick,
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1 || autoPlayInterval <= 0) return;

    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [goToNext, autoPlayInterval, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className={clsx(styles.banner, className)}>
      {/* Slides Container */}
      <div
        className={styles.slidesContainer}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={styles.slide}
            onClick={() => onSlideClick?.(slide)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSlideClick?.(slide)}
          >
            <img src={slide.imageUrl} alt={slide.title || ''} />
            {(slide.title || slide.subtitle) && (
              <div className={styles.overlay}>
                {slide.title && <h2 className={styles.title}>{slide.title}</h2>}
                {slide.subtitle && <p className={styles.subtitle}>{slide.subtitle}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={clsx(styles.arrow, styles.prevArrow)}
            onClick={goToPrev}
            aria-label="이전 슬라이드"
          >
            ◀
          </button>
          <button
            type="button"
            className={clsx(styles.arrow, styles.nextArrow)}
            onClick={goToNext}
            aria-label="다음 슬라이드"
          >
            ▶
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={clsx(styles.dot, index === currentIndex && styles.activeDot)}
              onClick={() => goToSlide(index)}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type { HeroBannerProps, BannerSlide };
