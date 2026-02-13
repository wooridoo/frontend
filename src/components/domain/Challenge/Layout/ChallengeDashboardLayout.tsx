import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChallengeHero, ChallengeHeroSkeleton } from '../Dashboard/ChallengeHero';
import { ChallengeStats } from '../Dashboard/ChallengeStats';
import { ChallengeTabs } from '../Dashboard/ChallengeTabs';
import { useChallengeDetail } from '@/hooks/useChallenge';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { toChallengeSlug } from '@/lib/utils/challengeRoute';
import styles from './ChallengeDashboardLayout.module.css';

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
        {/* Skeleton for Stats & Tabs could be added here */}
        <div style={{ height: 200 }}></div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className={styles.layout}>
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h3>챌린지 정보를 불러올 수 없습니다.</h3>
          <p>{error?.message || '잠시 후 다시 시도해주세요.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* 1. Hero */}
      <ChallengeHero challenge={challenge} />

      {/* 2. Stats Dashboard */}
      <ChallengeStats challengeId={challengeId} />

      {/* 3. Sticky Tabs */}
      <ChallengeTabs />

      {/* 4. Tab Content */}
      <main className={styles.content}>
        <Outlet context={{ challenge }} />
      </main>
    </div>
  );
}
