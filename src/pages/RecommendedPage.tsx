import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styles from './RecommendedPage.module.css';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Button, SemanticIcon } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { getChallenges } from '@/lib/api/challenge';
import { getCategoryLabel } from '@/lib/utils/categoryLabels';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';

const CHALLENGE_FALLBACK_IMAGE = '/images/challenge-fallback.svg';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function RecommendedPage() {
  const { isLoggedIn, user, requireAuth } = useAuthGuard();

  // 보조 처리
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges', 'recommended'],
    queryFn: () => getChallenges({ sort: 'memberCount.desc', size: 3 }),
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <PageContainer variant="content" contentWidth="xl" className={styles.page}>
        <PageHeader title="추천" />
        <div className={styles.loginPrompt}>
          <div className={styles.iconWrapper}>
            <SemanticIcon animated={false} name="warning" size={24} />
          </div>
          <h2 className={styles.promptTitle}>로그인이 필요해요</h2>
          <p className={styles.promptDesc}>
            로그인하시면 회원님을 위한<br />
            인기 챌린지를 추천해드려요!
          </p>
          <Button onClick={() => requireAuth()} className={styles.loginButton}>
            로그인하고 추천받기
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="content" contentWidth="xl" className={styles.page}>
      <PageHeader title="추천 챌린지" />

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.greeting}>
            <span className={styles.userName}>{user?.name}</span>님을 위한<br />
            오늘의 인기 챌린지
          </h2>
          <p className={styles.subtext}>많은 분들이 참여하고 있는 챌린지예요.</p>
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader2 className="animate-spin text-orange-500" size={32} />
            <p>챌린지를 불러오고 있어요...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {challenges?.map(challenge => {
              if (!challenge || !challenge.challengeId) return null;
              return (
                <Link to={CHALLENGE_ROUTES.detailWithTitle(challenge.challengeId, challenge.title)} key={challenge.challengeId} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={challenge.thumbnailUrl || CHALLENGE_FALLBACK_IMAGE}
                      alt={challenge.title}
                      className={styles.image}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = CHALLENGE_FALLBACK_IMAGE;
                      }}
                    />
                    {/* 보조 설명 */}
                  </div>
                  <div className={styles.cardContent}>
                    <span className={styles.tag}>{getCategoryLabel(challenge.category)}</span>
                    <h3 className={styles.cardTitle}>{challenge.title}</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.participants}>{challenge.memberCount.current.toLocaleString()}명 참여 중</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
