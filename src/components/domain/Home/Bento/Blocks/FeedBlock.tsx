import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getChallenges, type ChallengeInfo } from '@/lib/api/challenge';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './FeedBlock.module.css';

export function FeedBlock() {
  const [items, setItems] = useState<ChallengeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleChallengeAction, isParticipant } = useAuthGuard();

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const challenges = await getChallenges();
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
    if (!containerRef.current) return;

    const scrollAmount = containerRef.current.clientWidth / 2;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    if (scrollWidth - (scrollLeft + clientWidth) < 100 && !loading) {
      // Keep placeholder logic until pagination is added to challenge API.
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

      <div className={styles.grid} ref={containerRef} onScroll={handleScroll}>
        {items.map((item) => (
          <div key={item.challengeId} className={styles.card}>
            <Link to={CHALLENGE_ROUTES.detailWithTitle(item.challengeId, item.title)} className={styles.imageWrapper}>
              <img
                src={item.thumbnailUrl || `https://picsum.photos/seed/${item.challengeId}/300/200`}
                alt={item.title}
                className={styles.image}
              />
            </Link>
            <div className={styles.cardContent}>
              <span className={styles.tag}>{item.category}</span>
              <Link to={CHALLENGE_ROUTES.detailWithTitle(item.challengeId, item.title)} className={styles.titleLink}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 20 }}>
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
