import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styles from './RecommendedPage.module.css';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Button } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { getChallenges } from '@/lib/api/challenge';
import { PATHS } from '@/routes/paths';

export function RecommendedPage() {
  const { isLoggedIn, user, requireAuth } = useAuthGuard();

  // Fetch Recommended (Top 3)
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges', 'recommended'],
    queryFn: () => getChallenges(), // 실제로는 추천 알고리즘 API를 쓰겠지만 일단 전체 목록 조회
    enabled: isLoggedIn,
    select: (data) => data.slice(0, 3) // 클라이언트에서 상위 3개 자르기 (Mock 환경)
  });

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

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className="animate-spin text-orange-500" size={32} />
            <p>회원님을 분석하고 있어요...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {challenges?.map(challenge => (
              <Link to={PATHS.CHALLENGE.DETAIL(String(challenge.challengeId))} key={challenge.challengeId} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={challenge.thumbnailUrl || ''} alt={challenge.title} className={styles.image} />
                  <div className={styles.badge}>98% 일치</div>
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.tag}>{challenge.category}</span>
                  <h3 className={styles.cardTitle}>{challenge.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.participants}>{challenge.memberCount.current.toLocaleString()}명 참여 중</span>
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
