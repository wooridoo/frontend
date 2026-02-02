import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MainCarousel.module.css';
import { WelcomeSlide } from './Slides/WelcomeSlide';
import { EventSlide } from './Slides/EventSlide';

interface Slide {
  id: number;
  content: React.ReactNode;
  backgroundColor: string;
}

const drafts: Slide[] = [
  {
    id: 1,
    content: <WelcomeSlide />,
    backgroundColor: '#FFF7ED', // orange-50
  },
  {
    id: 2,
    content: <EventSlide />,
    backgroundColor: '#F3E8FF', // purple-100 equivalent
  }
];

export function MainCarousel() {
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
            {slide.content}
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
  );
}
