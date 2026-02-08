import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { RecommendedPage } from './pages/RecommendedPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { MyChallengesPage } from './pages/MyChallengesPage';
import { AccountPage } from './pages/AccountPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { ChallengeDashboardLayout } from './components/domain/Challenge/Layout/ChallengeDashboardLayout';
import { FeedPage } from './components/domain/Challenge/Feed/FeedPage';
import { MainLayout } from './components/layout';
import { LoginModal } from './components/domain/Auth/LoginModal';
import { JoinChallengeModal } from './components/domain/Challenge/JoinChallengeModal';
import { CreateChallengeModal } from './components/domain/Challenge/CreateChallengeModal';
import { CreditChargeModal } from './components/domain/Account/CreditChargeModal';
import { WithdrawModal } from './components/domain/Account/WithdrawModal';
import { AccessDeniedModal } from './components/domain/Auth/AccessDeniedModal';
import { PasswordResetModal } from './components/domain/Auth/PasswordResetModal';
import { EditProfileModal } from './components/domain/Auth/EditProfileModal';
import { WithdrawAccountModal } from './components/domain/Auth/WithdrawAccountModal';
import { CreateMeetingModal } from './components/domain/Meeting/CreateMeetingModal';
import { EditMeetingModal } from './components/domain/Meeting/EditMeetingModal';
import { AttendanceResponseModal } from './components/domain/Meeting/AttendanceResponseModal';
import { CompleteMeetingModal } from './components/domain/Meeting/CompleteMeetingModal';
import { EditChallengeModal } from './components/domain/Challenge/EditChallengeModal';
import { SupportSettingsModal } from './components/domain/Challenge/SupportSettingsModal';
import { DelegateLeaderModal } from './components/domain/Challenge/DelegateLeaderModal';
import { DeleteChallengeModal } from './components/domain/Challenge/DeleteChallengeModal';
import { LeaveChallengeModal } from './components/domain/Challenge/LeaveChallengeModal';
import { SupportPaymentModal } from './components/domain/Challenge/SupportPaymentModal';
import { PostDetailModal } from './components/domain/Challenge/Feed/PostDetailModal';
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
import { MemberList } from './components/domain/Challenge/Member/MemberList';
import { MemberDetail } from './components/domain/Challenge/Member/MemberDetail';
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
                  <Route path={PATHS.MY.PROFILE} element={<MyProfilePage />} />
                  <Route path={PATHS.MY.CHALLENGES} element={<MyChallengesPage />} />
                  <Route path={PATHS.MY.LEDGER} element={<div>나의 장부 준비중</div>} />
                  <Route path={PATHS.MY.SETTINGS} element={<div>설정 준비중</div>} />
                  <Route path={PATHS.MY.ACCOUNT} element={<AccountPage />} />
                  <Route path="/me/account/transactions" element={<TransactionHistoryPage />} />
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
                      <Route path="members" element={<MemberList />} />
                      <Route path="members/:memberId" element={<MemberDetail />} />
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
            <CreateChallengeModal />
            <CreditChargeModal />
            <WithdrawModal />
            <AccessDeniedModal />
            {/* Auth Modals */}
            <PasswordResetModal />
            <EditProfileModal />
            <WithdrawAccountModal />
            {/* Meeting Modals */}
            <CreateMeetingModal />
            <EditMeetingModal />
            <AttendanceResponseModal />
            <CompleteMeetingModal />
            {/* Challenge Management Modals */}
            <EditChallengeModal />
            <SupportSettingsModal />
            <DelegateLeaderModal />
            <DeleteChallengeModal />
            <LeaveChallengeModal />
            <SupportPaymentModal />
            <PostDetailModal />
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
