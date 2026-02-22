import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { completeSocialAuth } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginResponse, SocialAuthProvider } from '@/types/auth';
import styles from './SocialAuthCallbackPage.module.css';

type CallbackStatus = 'processing' | 'failed';
const completeRequestCache = new Map<string, Promise<LoginResponse>>();

/**
 * 외부 소셜 로그인 후 인가 코드를 서비스 세션으로 교환하는 콜백 페이지입니다.
 */
export function SocialAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  const provider = useMemo<SocialAuthProvider | null>(() => {
    const fromStorage = sessionStorage.getItem('oauth_provider');
    const fromQuery = searchParams.get('provider');
    const normalized = (fromStorage || fromQuery || '').toUpperCase();
    if (normalized === 'GOOGLE' || normalized === 'KAKAO') {
      return normalized;
    }
    return null;
  }, [searchParams]);

  const precheckErrorMessage = useMemo(() => {
    if (oauthError) {
      return '소셜 로그인 인증이 취소되었거나 실패했습니다.';
    }
    if (!code || !state || !provider) {
      return '소셜 로그인 요청 정보가 올바르지 않습니다.';
    }
    return null;
  }, [code, oauthError, provider, state]);

  const status: CallbackStatus = precheckErrorMessage || errorMessage ? 'failed' : 'processing';
  const displayErrorMessage = precheckErrorMessage || errorMessage || '소셜 로그인 처리 중 문제가 발생했습니다.';
  const callbackKey = provider && code && state ? `${provider}:${state}:${code}` : null;

  useEffect(() => {
    if (precheckErrorMessage || !provider || !code || !state || !callbackKey) {
      return;
    }

    let isDisposed = false;
    const existingTask = completeRequestCache.get(callbackKey);
    const requestTask = existingTask ?? completeSocialAuth({ provider, code, state });

    if (!existingTask) {
      completeRequestCache.set(callbackKey, requestTask);
    }

    requestTask
      .then((response) => {
        if (isDisposed) {
          return;
        }

        login(response.user, response.accessToken, response.refreshToken);
        const fallback = sessionStorage.getItem('oauth_return_to');
        const target = sanitizeReturnToPath(response.returnTo ?? fallback, PATHS.HOME);

        sessionStorage.removeItem('oauth_provider');
        if (response.user?.requiresOnboarding) {
          sessionStorage.setItem('oauth_return_to', target);
          navigate(PATHS.AUTH.SOCIAL_ONBOARDING, { replace: true });
          return;
        }

        sessionStorage.removeItem('oauth_return_to');
        navigate(target, { replace: true });
      })
      .catch((error) => {
        if (isDisposed) {
          return;
        }

        if (error instanceof ApiError) {
          if (error.code === 'AUTH_011') {
            setErrorMessage('소셜 로그인 설정이 아직 완료되지 않았습니다.');
            return;
          }
          if (error.code === 'AUTH_012' || error.code === 'AUTH_013') {
            setErrorMessage('유효하지 않은 소셜 로그인 요청입니다.');
            return;
          }
          if (error.code === 'AUTH_015') {
            setErrorMessage('소셜 계정 이메일을 확인할 수 없어 로그인을 완료하지 못했습니다.');
            return;
          }
          if (error.code === 'AUTH_017') {
            setErrorMessage('인가 코드가 만료되었거나 이미 사용되었습니다. 다시 시도해 주세요.');
            return;
          }
          if (error.code === 'AUTH_018') {
            setErrorMessage('소셜 인증 제공자 응답 처리 중 문제가 발생했습니다.');
            return;
          }
          setErrorMessage(error.message);
          return;
        }
        setErrorMessage('소셜 로그인 처리 중 문제가 발생했습니다.');
      })
      .finally(() => {
        completeRequestCache.delete(callbackKey);
      });

    return () => {
      isDisposed = true;
    };
  }, [callbackKey, code, login, navigate, precheckErrorMessage, provider, state]);

  return (
    <PageContainer variant="content" contentWidth="sm">
      <PageHeader title="소셜 로그인" showBack={false} />
      <section className={styles.card}>
        {status === 'processing' && (
          <>
            <div className={styles.spinner} />
            <h2 className={styles.title}>로그인 처리 중입니다.</h2>
            <p className={styles.description}>잠시만 기다려 주세요.</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <h2 className={styles.title}>로그인에 실패했습니다.</h2>
            <p className={styles.description}>{displayErrorMessage}</p>
            <Button onClick={() => navigate(PATHS.HOME, { replace: true })}>
              홈으로 이동
            </Button>
          </>
        )}
      </section>
    </PageContainer>
  );
}
