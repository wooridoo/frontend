import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getChallenges, type ChallengeInfo } from '@/lib/api/challenge';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './FeedBlock.module.css';

const CHALLENGE_FALLBACK_IMAGE = '/images/challenge-fallback.svg';

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>오늘의 추천 챌린지</h3>
        <div className={styles.controls}>
          <button onClick={() => scroll('left')} className={styles.controlBtn} aria-label="이전">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className={styles.controlBtn} aria-label="다음">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.grid} ref={containerRef}>
        {items.map((item) => (
          <div key={item.challengeId} className={styles.card}>
            <Link to={CHALLENGE_ROUTES.detailWithTitle(item.challengeId, item.title)} className={styles.imageWrapper}>
              <img
                src={item.thumbnailUrl || CHALLENGE_FALLBACK_IMAGE}
                alt={item.title}
                className={styles.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = CHALLENGE_FALLBACK_IMAGE;
                }}
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
                  onClick={() => handleChallengeAction(item.challengeId, item.title)}
                >
                  {isParticipant(item.challengeId) ? '이동' : '참여'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && items.length === 0 && (
          <div className={styles.loadingRow}>
            <Loader2 className={`animate-spin ${styles.loadingSpinner}`} />
          </div>
        )}
      </div>
    </div>
  );
}
