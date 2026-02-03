import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecommendedPage.module.css';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Button } from '@/components/ui';
import { Loader2 } from 'lucide-react';

const MOCK_RECOMMENDATIONS = [
  { id: 101, title: '나를 위한 맞춤: 아침 요가', participants: 45, tag: '건강', image: 'https://picsum.photos/seed/yoga/300/200' },
  { id: 102, title: '직장인을 위한 재테크', participants: 210, tag: '자산', image: 'https://picsum.photos/seed/invest/300/200' },
  { id: 103, title: '영어 회화 마스터', participants: 88, tag: '역량', image: 'https://picsum.photos/seed/english/300/200' },
];

export function RecommendedPage() {
  const { isLoggedIn, user, requireAuth } = useAuthGuard();
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<typeof MOCK_RECOMMENDATIONS>([]);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      // Simulate personalized algorithm delay
      const timer = setTimeout(() => {
        setChallenges(MOCK_RECOMMENDATIONS);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <PageContainer className={styles.page}>
        <PageHeader title="추천" />
        <div className={styles.loginPrompt}>
          <div className={styles.iconWrapper}>🔒</div>
          <h2 className={styles.promptTitle}>로그인이 필요해요</h2>
          <p className={styles.promptDesc}>
            로그인하시면 회원님의 관심사와 활동 패턴을 분석해<br />
            딱 맞는 챌린지를 추천해드려요!
          </p>
          <Button onClick={() => requireAuth()} className={styles.loginButton}>
            로그인하고 추천받기
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.page}>
      <PageHeader title="추천 챌린지" />

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.greeting}>
            <span className={styles.userName}>{user?.name}</span>님을 위한<br />
            오늘의 추천 챌린지 ✨
          </h2>
          <p className={styles.subtext}>회원님의 관심사를 기반으로 선정했어요.</p>
        </div>

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className="animate-spin text-orange-500" size={32} />
            <p>회원님을 분석하고 있어요...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {challenges.map(challenge => (
              <Link to={`/challenges/${challenge.id}`} key={challenge.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={challenge.image} alt={challenge.title} className={styles.image} />
                  <div className={styles.badge}>98% 일치</div>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.tag}>{challenge.tag}</span>
                  <h3 className={styles.cardTitle}>{challenge.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.participants}>{challenge.participants}명 참여 중</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
