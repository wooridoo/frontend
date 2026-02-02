import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import styles from './ChallengeDetailPage.module.css';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginModalStore } from '@/store/useLoginModalStore';
import { useJoinModalStore } from '@/store/useJoinModalStore';

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageContainer className={styles.page}>
      <PageHeader title="챌린지 상세" showBack />

      <main className={styles.content}>
        <Suspense fallback={<ChallengeDetailSkeleton />}>
          <ChallengeDetailContent id={id} />
        </Suspense>
      </main>
    </PageContainer>
  );
}

function ChallengeDetailContent({ id }: { id?: string }) {
  const { isLoggedIn } = useAuthStore();
  const loginModal = useLoginModalStore();
  const joinModal = useJoinModalStore();

  const [data, setData] = useState<{ title: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData({
        title: `Challenge #${id}`,
        description: '매일 아침 6시 기상하고 인증하는 챌린지입니다. 함께 습관을 만들어보아요!',
      });
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const handleJoinClick = () => {
    if (isLoggedIn) {
      joinModal.onOpen();
    } else {
      loginModal.onOpen();
    }
  };

  if (isLoading) return <ChallengeDetailSkeleton />;
  if (!data) return <div>챌린지를 찾을 수 없습니다.</div>;

  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        <div className={styles.imagePlaceholder}>
          {/* Image would go here */}
          <span className={styles.emoji}>🌅</span>
        </div>
        <div className={styles.info}>
          <span className={styles.categoryBadge}>생활습관</span>
          <h2 className={styles.challengeTitle}>{data.title}</h2>
          <p className={styles.description}>{data.description}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>참여자</span>
          <span className={styles.statValue}>1,234명</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>인증률</span>
          <span className={styles.statValue}>85%</span>
        </div>
      </div>

      <button className={styles.joinButton} onClick={handleJoinClick}>참여하기</button>
    </section>
  );
}

function ChallengeDetailSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.heroSkeleton}>
        <Skeleton className="w-full h-48 rounded-lg" />
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-3/4 h-8 rounded-md" />
        <Skeleton className="w-full h-20 rounded-md" />
      </div>
      <div className={styles.statsSkeleton}>
        <Skeleton className="flex-1 h-16 rounded-md" />
        <Skeleton className="flex-1 h-16 rounded-md" />
      </div>
    </div>
  );
}
