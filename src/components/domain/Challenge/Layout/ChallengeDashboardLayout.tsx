import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChallengeHero, ChallengeHeroSkeleton } from '../Dashboard/ChallengeHero';
import { ChallengeStats } from '../Dashboard/ChallengeStats';
import { ChallengeTabs } from '../Dashboard/ChallengeTabs';
import { useChallengeDetail } from '@/hooks/useChallenge';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { toChallengeSlug } from '@/lib/utils/challengeRoute';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import styles from './ChallengeDashboardLayout.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ChallengeDashboardLayout() {
  const { challengeId, challengeRef, isResolving } = useChallengeRoute();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: challenge, isLoading, error } = useChallengeDetail(challengeId);

  useEffect(() => {
    if (!challenge || !challengeRef) return;

    const canonicalRef = toChallengeSlug(String(challenge.challengeId), challenge.title);
    if (!canonicalRef || canonicalRef === challengeRef) return;

    const oldPrefix = `/${challengeRef}/challenge`;
    if (!location.pathname.startsWith(oldPrefix)) return;

    const suffix = location.pathname.slice(oldPrefix.length);
    const canonicalPath = `/${canonicalRef}/challenge${suffix}${location.search}${location.hash}`;
    navigate(canonicalPath, { replace: true });
  }, [challenge, challengeRef, location.hash, location.pathname, location.search, navigate]);

  if (isResolving || isLoading) {
    return (
      <div className={styles.layout}>
        <ChallengeHeroSkeleton />
        <div className={styles.stateContainer}>
          <PageContainer variant="content" contentWidth="xl" contentClassName={styles.contentShell}>
            <div className={styles.loadingBox} />
          </PageContainer>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className={styles.layout}>
        <div className={styles.stateContainer}>
          <PageContainer variant="content" contentWidth="xl" contentClassName={styles.contentShell}>
            <div className={styles.errorBox}>
              <h3>챌린지 정보를 불러올 수 없습니다.</h3>
              <p>{error?.message || '잠시 후 다시 시도해주세요.'}</p>
            </div>
          </PageContainer>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* 보조 설명 */}
      <ChallengeHero challenge={challenge} />

      {/* 보조 설명 */}
      <ChallengeStats challengeId={challengeId} />

      {/* 보조 설명 */}
      <ChallengeTabs />

      {/* 보조 설명 */}
      <main className={styles.content}>
        <PageContainer variant="content" contentWidth="xl" contentClassName={styles.contentShell}>
          <Outlet context={{ challenge }} />
        </PageContainer>
      </main>
    </div>
  );
}
