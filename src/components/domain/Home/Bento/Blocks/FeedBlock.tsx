import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './FeedBlock.module.css';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const INITIAL_ITEMS = [
  { id: 1, title: '하루 물 2L 마시기', participants: 120, tag: '건강', image: 'https://picsum.photos/seed/water/300/200' },
  { id: 2, title: '영어 단어 50개 암기', participants: 85, tag: '학습', image: 'https://picsum.photos/seed/eng/300/200' },
  { id: 3, title: '매일 1만원 저축하기', participants: 230, tag: '재테크', image: 'https://picsum.photos/seed/money/300/200' },
  { id: 4, title: '아침 6시 기상하기', participants: 50, tag: '생활', image: 'https://picsum.photos/seed/morning/300/200' },
  { id: 5, title: '독서 30분', participants: 42, tag: '학습', image: 'https://picsum.photos/seed/book/300/200' },
];

export function FeedBlock() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleChallengeAction, isParticipant } = useAuthGuard();

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 2; // Scroll half view
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Mock Infinite Scroll
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      // If we are close to the end (within 100px)
      if (scrollWidth - (scrollLeft + clientWidth) < 100 && !loading) {
        loadMore();
      }
    }
  };

  const loadMore = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newItems = Array.from({ length: 4 }).map((_, i) => ({
        id: items.length + i + 1,
        title: `새로운 챌린지 ${items.length + i + 1}`,
        participants: Math.floor(Math.random() * 100),
        tag: ['건강', '학습', '재테크', '취미'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/300/200?random=${items.length + i}`,
      }));
      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>오늘의 추천 챌린지 🔥</h3>
        <div className={styles.controls}>
          <button onClick={() => scroll('left')} className={styles.controlBtn} aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className={styles.controlBtn} aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        className={styles.grid}
        ref={containerRef}
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <Link to={`/challenges/${item.id}`} className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.image} />
            </Link>
            <div className={styles.cardContent}>
              <span className={styles.tag}>{item.tag}</span>
              <Link to={`/challenges/${item.id}`} className={styles.titleLink}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
              </Link>
              <div className={styles.cardFooter}>
                <span className={styles.participants}>{item.participants}명 참여</span>
                <button
                  className={styles.joinBtn}
                  onClick={() => handleChallengeAction(item.id)}
                >
                  {isParticipant(item.id) ? '이동' : '참여'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}>
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
