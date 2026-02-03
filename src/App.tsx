import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { HomePage } from './pages/HomePage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { ExplorePage } from './pages/ExplorePage';
import { RecommendedPage } from './pages/RecommendedPage';
import { ChallengeDashboardLayout } from './components/domain/Challenge/Layout/ChallengeDashboardLayout';
import { FeedPage } from './components/domain/Challenge/Feed/FeedPage';
import { MainLayout } from './components/layout';
import { LoginModal } from './components/domain/Auth/LoginModal';
import { JoinChallengeModal } from './components/domain/Challenge/JoinChallengeModal';
import { AccessDeniedModal } from './components/domain/Auth/AccessDeniedModal';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { ChallengeGuard } from './components/auth/ChallengeGuard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={PATHS.HOME} element={<HomePage />} />
            <Route path={PATHS.EXPLORE} element={<ExplorePage />} />
            <Route path={PATHS.RECOMMENDED} element={<RecommendedPage />} />

            {/* My Routes - Protected */}
            <Route element={<AuthGuard />}>
              <Route path={PATHS.MY.PROFILE} element={<div>마이페이지 준비중</div>} />
              <Route path={PATHS.MY.CHALLENGES} element={<div>나의 챌린지 준비중</div>} />
              <Route path={PATHS.MY.LEDGER} element={<div>나의 장부 준비중</div>} />
              <Route path={PATHS.MY.SETTINGS} element={<div>설정 준비중</div>} />
              <Route path={PATHS.MY.ACCOUNT} element={<div>계정 관리 준비중</div>} />
            </Route>

            {/* Challenge Routes: Intro (Index) vs Dashboard (Sub-routes) */}
            <Route path={PATHS.CHALLENGE.DETAIL(':id')}>
              <Route index element={<ChallengeDetailPage />} />

              <Route element={<ChallengeGuard />}>
                <Route element={<ChallengeDashboardLayout />}>
                  <Route path="feed" element={<FeedPage />} />
                  <Route path="meetings" element={<div>정기모임 페이지 준비중</div>} />
                  <Route path="ledger" element={<div>장부 페이지 준비중</div>} />
                  <Route path="votes" element={<div>투표 페이지 준비중</div>} />
                  <Route path="members" element={<div>멤버 페이지 준비중</div>} />
                </Route>
              </Route>
            </Route>

            {/* Shortcut: Global Feed -> My Main Challenge */}
            <Route path={PATHS.FEED} element={<Navigate to={PATHS.CHALLENGE.FEED('1')} replace />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <LoginModal />
        <JoinChallengeModal />
        <AccessDeniedModal />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
