import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import styles from './ChallengeDetailPage.module.css';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/navigation';
import { useJoinModalStore } from '@/store/useJoinModalStore';
import { useAuthGuard } from '@/hooks/useAuthGuard';

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

import { MOCK_CHALLENGES } from '@/lib/api/mocks/challenges';
import type { Challenge } from '@/types/domain';

function ChallengeDetailContent({ id }: { id?: string }) {
  const { requireAuth } = useAuthGuard();
  const joinModal = useJoinModalStore();

  const [data, setData] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call using mocks
    const timer = setTimeout(() => {
      const found = MOCK_CHALLENGES.find(c => c.id === id);
      setData(found || null);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  const handleJoinClick = () => {
    if (requireAuth()) {
      joinModal.onOpen();
    }
  };

  if (isLoading) return <ChallengeDetailSkeleton />;
  if (!data) return <div>챌린지를 찾을 수 없습니다.</div>;

  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        <div className={styles.imagePlaceholder}>
          {data.thumbnailUrl ? (
            <img src={data.thumbnailUrl} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <span className={styles.emoji}>🌅</span>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.categoryBadge}>{data.category}</span>
          <h2 className={styles.challengeTitle}>{data.name}</h2>
          <p className={styles.description}>{data.description || '설명이 없습니다.'}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>참여자</span>
          <span className={styles.statValue}>{data.currentMembers.toLocaleString()}명</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>인증률</span>
          <span className={styles.statValue}>{data.certificationRate || 0}%</span>
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
