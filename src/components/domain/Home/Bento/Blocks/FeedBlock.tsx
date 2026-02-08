import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './FeedBlock.module.css';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getChallenges, type ChallengeInfo } from '@/lib/api/challenge';

export function FeedBlock() {
  const [items, setItems] = useState<ChallengeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleChallengeAction, isParticipant } = useAuthGuard();

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        // Fetch challenges (using empty query for now to get a list)
        const challenges = await getChallenges({ category: '전체' });
        setItems(challenges);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 2; // Scroll half view
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Mock Infinite Scroll (API might not support pagination yet, so we just check scroll)
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      // If we are close to the end (within 100px)
      if (scrollWidth - (scrollLeft + clientWidth) < 100 && !loading) {
        // Implement pagination if API supports it later
        // loadMore(); 
      }
    }
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
          <div key={item.challengeId} className={styles.card}>
            <Link to={`/challenges/${item.challengeId}`} className={styles.imageWrapper}>
              <img
                src={item.thumbnailUrl || `https://picsum.photos/seed/${item.challengeId}/300/200`}
                alt={item.title}
                className={styles.image}
              />
            </Link>
            <div className={styles.cardContent}>
              <span className={styles.tag}>{item.category}</span>
              <Link to={`/challenges/${item.challengeId}`} className={styles.titleLink}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
              </Link>
              <div className={styles.cardFooter}>
                <span className={styles.participants}>{item.memberCount.current}명 참여</span>
                <button
                  className={styles.joinBtn}
                  onClick={() => handleChallengeAction(item.challengeId)}
                >
                  {isParticipant(item.challengeId) ? '이동' : '참여'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {loading && items.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
