import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { HomePage } from './pages/HomePage';
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
import { ErrorBoundary, Loading } from './components/common';
import { RegularMeetingDetail } from './components/domain/Challenge/Meeting/RegularMeetingDetail';
import { RegularMeetingList } from './components/domain/Challenge/Meeting/RegularMeetingList';
import { ChallengeLedgerPage } from './components/domain/Challenge/Ledger/ChallengeLedgerPage';
import { VoteList } from './components/domain/Challenge/Vote/VoteList';
import { CreateVote } from './components/domain/Challenge/Vote/CreateVote';
import { VoteDetail } from './components/domain/Challenge/Vote/VoteDetail';
import { useParams } from 'react-router-dom';

// Wrapper to pass challengeId param
function RegularMeetingListWrapper() {
  const { id } = useParams<{ id: string }>();
  return <RegularMeetingList challengeId={id} />;
}

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
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
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
                  <Route element={<ChallengeGuard />}>
                    <Route element={<ChallengeDashboardLayout />}>
                      {/* Default redirect to feed */}
                      <Route index element={<Navigate to="feed" replace />} />

                      <Route path="feed" element={<FeedPage />} />
                      <Route path="meetings" element={<RegularMeetingListWrapper />} />
                      <Route path="meetings/:meetingId" element={<RegularMeetingDetail />} />
                      <Route path="ledger" element={<ChallengeLedgerPage />} />
                      <Route path="votes" element={<VoteList />} />
                      <Route path="votes/new" element={<CreateVote />} />
                      <Route path="votes/:voteId" element={<VoteDetail />} />
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
        </Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
