import { Suspense, lazy, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { CHALLENGE_SLUG_REGEX } from '@/lib/utils/challengeRoute';

import { ChallengeDashboardLayout } from './components/domain/Challenge/Layout/ChallengeDashboardLayout';
import { MainLayout } from './components/layout';
import { AuthGuard } from './components/auth/AuthGuard';
import { ChallengeGuard } from './components/auth/ChallengeGuard';
import { ModalHost } from './components/ui/Overlay/ModalHost';
import { ErrorBoundary, Loading } from './components/common';
import { RegularMeetingDetail } from './components/domain/Challenge/Meeting/RegularMeetingDetail';
import { RegularMeetingList } from './components/domain/Challenge/Meeting/RegularMeetingList';
import { VoteList } from './components/domain/Challenge/Vote/VoteList';
import { CreateVote } from './components/domain/Challenge/Vote/CreateVote';
import { VoteDetail } from './components/domain/Challenge/Vote/VoteDetail';
import { MemberList } from './components/domain/Challenge/Member/MemberList';
import { MemberDetail } from './components/domain/Challenge/Member/MemberDetail';
import { useAuthStore } from '@/store/useAuthStore';
import { getChallenge } from '@/lib/api/challenge';
import { getMyProfile } from '@/lib/api/user';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(module => ({ default: module.ExplorePage })));
const RecommendedPage = lazy(() => import('./pages/RecommendedPage').then(module => ({ default: module.RecommendedPage })));
const MyPage = lazy(() => import('./pages/MyPage').then(module => ({ default: module.MyPage })));
const MyChallengesPage = lazy(() => import('./pages/MyChallengesPage').then(module => ({ default: module.MyChallengesPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(module => ({ default: module.AccountPage })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(module => ({ default: module.WalletPage })));
const TransactionHistoryPage = lazy(() => import('./pages/TransactionHistoryPage').then(module => ({ default: module.TransactionHistoryPage })));
const FeedPage = lazy(() => import('./components/domain/Challenge/Feed/FeedPage').then(module => ({ default: module.FeedPage })));
const ChallengeLedgerPage = lazy(() => import('./components/domain/Challenge/Ledger/ChallengeLedgerPage').then(module => ({ default: module.ChallengeLedgerPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const CreateChallengePage = lazy(() => import('./pages/CreateChallengePage').then(module => ({ default: module.CreateChallengePage })));
const ChallengeDetailPage = lazy(() => import('./pages/ChallengeDetailPage').then(module => ({ default: module.ChallengeDetailPage })));
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage').then(module => ({ default: module.PaymentCallbackPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

function RegularMeetingListWrapper() {
  const { challengeId, challengeRef } = useChallengeRoute();
  return <RegularMeetingList challengeId={challengeId} challengeRef={challengeRef} />;
}

function LegacyChallengeRedirect() {
  const { id, '*': rest } = useParams<{ id: string; '*': string }>();
  const location = useLocation();
  const isId = Boolean(id && (CHALLENGE_SLUG_REGEX.test(id) || /^\d+$/.test(id)));
  const { data: challengeTitle, isLoading } = useQuery({
    queryKey: ['legacy-challenge-title', id],
    enabled: Boolean(id) && isId,
    retry: false,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!id) return undefined;
      const challenge = await getChallenge(id);
      return challenge.title;
    },
  });

  if (!id) {
    return <Navigate to={PATHS.EXPLORE} replace />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const suffix = rest ? `/${rest}` : '';
  return (
    <Navigate
      to={`${CHALLENGE_ROUTES.detail(id, challengeTitle)}${suffix}${location.search}${location.hash}`}
      replace
    />
  );
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
                <Route path={PATHS.AUTH.RESET_PASSWORD} element={<ResetPasswordPage />} />
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
                  <Route path="/me/ledger/transactions" element={<TransactionHistoryPage />} />
                  <Route path="/me/account/transactions" element={<Navigate replace to="/me/ledger/transactions" />} />
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

                <Route path={CHALLENGE_ROUTES.ROOT} element={<Navigate to={PATHS.EXPLORE} replace />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_NEW} element={<Navigate to={CHALLENGE_ROUTES.NEW} replace />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_GROUP_NEW} element={<Navigate to={CHALLENGE_ROUTES.NEW} replace />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_DETAIL_PATTERN} element={<LegacyChallengeRedirect />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_GROUP_DETAIL_PATTERN} element={<LegacyChallengeRedirect />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_ROOT} element={<Navigate to={PATHS.EXPLORE} replace />} />
                <Route path={CHALLENGE_ROUTES.LEGACY_GROUP_ROOT} element={<Navigate to={PATHS.EXPLORE} replace />} />
                <Route path={PATHS.AUTH.LOGIN} element={<Navigate to={PATHS.HOME} replace />} />
                <Route path={PATHS.FEED} element={<Navigate to={PATHS.EXPLORE} replace />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <ModalHost />
            <Toaster position="top-center" richColors />
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
