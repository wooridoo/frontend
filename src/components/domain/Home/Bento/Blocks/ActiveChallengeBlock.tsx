import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChallenge, type ChallengeInfo } from '@/lib/api/challenge';
import { useAuthStore } from '@/store/useAuthStore';
import { ChallengeStatus } from '@/types/enums';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './ActiveChallengeBlock.module.css';

export function ActiveChallengeBlock() {
  const { user } = useAuthStore();
  const [activeChallenge, setActiveChallenge] = useState<ChallengeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (user?.participatingChallengeIds?.length) {
        try {
          // Fetch the first participating challenge
          const challengeId = user.participatingChallengeIds[0];
          const data = await getChallenge(String(challengeId));
          setActiveChallenge(data);
        } catch (error) {
          console.error('Failed to fetch active challenge:', error);
        }
      }
      setLoading(false);
    };

    fetchChallenge();
  }, [user]);

  const calculateDDay = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days >= 0 ? `D-${days}` : '종료';
  };

  if (loading) {
    return <div className={styles.container} />;
  }

  if (!activeChallenge) {
    return (
      <div className={styles.container}>
        <Link to={CHALLENGE_ROUTES.ROOT} className={styles.link}>
          <img
            src="https://picsum.photos/seed/new_challenge/600/400"
            alt="Join a Challenge"
            className={styles.image}
          />
          <div className={styles.overlay}>
            <div className={styles.content}>
              <span className={styles.tag}>새로운 도전</span>
              <h3 className={styles.title}>챌린지에<br />참여해보세요!</h3>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to={CHALLENGE_ROUTES.detailWithTitle(activeChallenge.challengeId, activeChallenge.title)} className={styles.link}>
        <img
          src={activeChallenge.thumbnailUrl || "https://picsum.photos/seed/running/600/400"}
          alt={activeChallenge.title}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <div className={styles.content}>
            <span className={styles.tag}>
              {activeChallenge.status === ChallengeStatus.IN_PROGRESS ? '진행 중' : '모집 중'}
            </span>
            <h3 className={styles.title}>{activeChallenge.title}</h3>
            <p className={styles.progress}>
              {calculateDDay(activeChallenge.endDate)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
