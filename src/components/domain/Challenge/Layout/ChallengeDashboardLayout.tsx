import { Outlet } from 'react-router-dom';
import { ChallengeHero } from '../Dashboard/ChallengeHero';
import { ChallengeStats } from '../Dashboard/ChallengeStats';
import { ChallengeTabs } from '../Dashboard/ChallengeTabs';
import styles from './ChallengeDashboardLayout.module.css';

export function ChallengeDashboardLayout() {
  // Mock Data (In reality, fetch from React Query using URL params id)
  const challengeData = {
    title: '책벌레들',
    category: '인증',
    leaderName: '김철수',
    leaderScore: 65.5,
  };

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
