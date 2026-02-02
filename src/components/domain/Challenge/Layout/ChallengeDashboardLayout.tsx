import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { ChallengeHero } from '../Dashboard/ChallengeHero';
import { ChallengeStats } from '../Dashboard/ChallengeStats';
import { ChallengeTabs } from '../Dashboard/ChallengeTabs';
import styles from './ChallengeDashboardLayout.module.css';

export function ChallengeDashboardLayout() {
  const location = useLocation();

  // Mock Data (In reality, fetch from React Query using URL params id)
  const challengeData = {
    title: '책벌레들',
    category: '인증',
    leaderName: '김철수',
    leaderScore: 65.5,
  };

  // If path is exactly /challenges/:id, redirect to feed
  // Note: This logic might be better in Routes, but safety check here
  const isRootPath = location.pathname.split('/').length === 3; // /challenges/1
  if (isRootPath) {
    return <Navigate to="feed" replace />;
  }

  return (
    <div className={styles.layout}>
      {/* 1. Hero */}
      <ChallengeHero
        title={challengeData.title}
        category={challengeData.category}
        leaderName={challengeData.leaderName}
        leaderScore={challengeData.leaderScore}
      />

      {/* 2. Stats Dashboard */}
      <ChallengeStats />

      {/* 3. Sticky Tabs */}
      <ChallengeTabs />

      {/* 4. Tab Content */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
