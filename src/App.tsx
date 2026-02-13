import { Suspense, lazy, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';

import { ChallengeDashboardLayout } from './components/domain/Challenge/Layout/ChallengeDashboardLayout';
import { MainLayout } from './components/layout';
import { LoginModal } from './components/domain/Auth/LoginModal';
import { SignupModal } from './components/domain/Auth/SignupModal';
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
import { AuthGuard } from './components/auth/AuthGuard';
import { ChallengeGuard } from './components/auth/ChallengeGuard';
import { ErrorBoundary, Loading } from './components/common';
import { RegularMeetingDetail } from './components/domain/Challenge/Meeting/RegularMeetingDetail';
import { RegularMeetingList } from './components/domain/Challenge/Meeting/RegularMeetingList';
import { VoteList } from './components/domain/Challenge/Vote/VoteList';
import { CreateVote } from './components/domain/Challenge/Vote/CreateVote';
import { VoteDetail } from './components/domain/Challenge/Vote/VoteDetail';
import { MemberList } from './components/domain/Challenge/Member/MemberList';
import { MemberDetail } from './components/domain/Challenge/Member/MemberDetail';
import { useAuthStore } from '@/store/useAuthStore';
import { getMyProfile } from '@/lib/api/user';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(module => ({ default: module.ExplorePage })));
const RecommendedPage = lazy(() => import('./pages/RecommendedPage').then(module => ({ default: module.RecommendedPage })));
const MyPage = lazy(() => import('./pages/MyPage').then(module => ({ default: module.MyPage })));
const MyChallengesPage = lazy(() => import('./pages/MyChallengesPage').then(module => ({ default: module.MyChallengesPage })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(module => ({ default: module.WalletPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(module => ({ default: module.AccountPage })));
const TransactionHistoryPage = lazy(() => import('./pages/TransactionHistoryPage').then(module => ({ default: module.TransactionHistoryPage })));
const FeedPage = lazy(() => import('./components/domain/Challenge/Feed/FeedPage').then(module => ({ default: module.FeedPage })));
const ChallengeLedgerPage = lazy(() => import('./components/domain/Challenge/Ledger/ChallengeLedgerPage').then(module => ({ default: module.ChallengeLedgerPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));
const CreateChallengePage = lazy(() => import('./pages/CreateChallengePage').then(module => ({ default: module.CreateChallengePage })));
const ChallengeDetailPage = lazy(() => import('./pages/ChallengeDetailPage').then(module => ({ default: module.ChallengeDetailPage })));
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage').then(module => ({ default: module.PaymentCallbackPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

function RegularMeetingListWrapper() {
  const { id } = useParams<{ id: string }>();
  return <RegularMeetingList challengeId={id} />;
}

function LegacyChallengeRedirect() {
  const { id, '*': rest } = useParams<{ id: string; '*': string }>();
  const location = useLocation();

  if (!id) {
    return <Navigate to={PATHS.EXPLORE} replace />;
  }

  const suffix = rest ? `/${rest}` : '';
  return <Navigate to={`${CHALLENGE_ROUTES.detail(id)}${suffix}${location.search}${location.hash}`} replace />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isLoggedIn, updateUser, syncParticipatingChallenges } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) return;

    getMyProfile()
      .then(user => {
        updateUser(user);
        syncParticipatingChallenges();
      })
      .catch(error => {
        console.error('Failed to sync user profile:', error);
      });
  }, [isLoggedIn, syncParticipatingChallenges, updateUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path={PATHS.SIGNUP} element={<SignupPage />} />
                <Route path={PATHS.HOME} element={<HomePage />} />
                <Route path={PATHS.EXPLORE} element={<ExplorePage />} />
                <Route path={PATHS.RECOMMENDED} element={<RecommendedPage />} />
                <Route path={CHALLENGE_ROUTES.NEW} element={<CreateChallengePage />} />

                <Route element={<AuthGuard />}>
                  <Route path={PATHS.MY.PROFILE} element={<MyPage />} />
                  <Route path={PATHS.MY.CHALLENGES} element={<MyChallengesPage />} />
                  <Route path={PATHS.MY.LEDGER} element={<WalletPage />} />
                  <Route path={PATHS.MY.SETTINGS} element={<SettingsPage />} />
                  <Route path={PATHS.MY.ACCOUNT} element={<AccountPage />} />
                  <Route path="/me/account/transactions" element={<TransactionHistoryPage />} />
                  <Route path={PATHS.WALLET.PAYMENT_CALLBACK} element={<PaymentCallbackPage />} />
                </Route>

                <Route path={CHALLENGE_ROUTES.INTRO_PATTERN} element={<ChallengeDetailPage />} />
                <Route path={CHALLENGE_ROUTES.DETAIL_PATTERN}>
                  <Route element={<ChallengeGuard />}>
                    <Route element={<ChallengeDashboardLayout />}>
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

                <Route path={CHALLENGE_ROUTES.LEGACY_NEW} element={<Navigate to={CHALLENGE_ROUTES.NEW} replace />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_DETAIL_PATTERN} element={<LegacyChallengeRedirect />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_ROOT} element={<Navigate to={PATHS.EXPLORE} replace />} />
                <Route path={PATHS.AUTH.LOGIN} element={<Navigate to={PATHS.HOME} replace />} />
                <Route path={PATHS.FEED} element={<Navigate to={PATHS.EXPLORE} replace />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <LoginModal />
            <SignupModal />
            <JoinChallengeModal />
            <CreateChallengeModal />
            <CreditChargeModal />
            <WithdrawModal />
            <AccessDeniedModal />
            <PasswordResetModal />
            <EditProfileModal />
            <WithdrawAccountModal />
            <CreateMeetingModal />
            <EditMeetingModal />
            <AttendanceResponseModal />
            <CompleteMeetingModal />
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
