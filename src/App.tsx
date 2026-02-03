import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
            <Route path="/" element={<HomePage />} />
            <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/recommended" element={<RecommendedPage />} />

            {/* Challenge Dashboard Routes */}
            <Route path="/challenges/:id" element={<ChallengeDashboardLayout />}>
              <Route index element={<Navigate to="feed" replace />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="meetings" element={<div>정기모임 페이지 준비중</div>} />
              <Route path="ledger" element={<div>장부 페이지 준비중</div>} />
              <Route path="votes" element={<div>투표 페이지 준비중</div>} />
              <Route path="members" element={<div>멤버 페이지 준비중</div>} />
            </Route>

            {/* Shortcut: Global Feed -> My Main Challenge */}
            <Route path="/feed" element={<Navigate to="/challenges/1/feed" replace />} />
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
