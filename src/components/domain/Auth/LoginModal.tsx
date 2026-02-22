import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import logo from '@/assets/woorido_logo.svg';
import { Button, Input } from '@/components/ui';
import { Modal } from '@/components/ui/Overlay/Modal';
import {
  useLoginModalStore,
  usePasswordResetModalStore,
  useSignupModalStore,
} from '@/store/modal/useModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/api/client';
import { PATHS } from '@/routes/paths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import type { SocialAuthProvider } from '@/types/auth';

import styles from './LoginModal.module.css';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function LoginModal() {
  const { isOpen, onClose, redirectOnReject, returnTo, message } = useLoginModalStore();
  const { onOpen: openSignup } = useSignupModalStore();
  const { onOpen: openPasswordReset } = usePasswordResetModalStore();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [socialPending, setSocialPending] = useState<SocialAuthProvider | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [providerEnabled, setProviderEnabled] = useState<Record<SocialAuthProvider, boolean>>({
    GOOGLE: false,
    KAKAO: false,
  });
  const [providerReason, setProviderReason] = useState<Record<SocialAuthProvider, string | null>>({
    GOOGLE: null,
    KAKAO: null,
  });
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isDisposed = false;
    import('@/lib/api/auth')
      .then(({ getSocialProviders }) => getSocialProviders())
      .then((response) => {
        if (isDisposed) {
          return;
        }

        const nextEnabled: Record<SocialAuthProvider, boolean> = { GOOGLE: true, KAKAO: true };
        const nextReason: Record<SocialAuthProvider, string | null> = { GOOGLE: null, KAKAO: null };

        response.providers.forEach((provider) => {
          if (provider.provider === 'GOOGLE' || provider.provider === 'KAKAO') {
            nextEnabled[provider.provider] = provider.enabled;
            nextReason[provider.provider] = provider.reasonCode ?? null;
          }
        });

        setProviderEnabled(nextEnabled);
        setProviderReason(nextReason);
      })
      .catch(() => {
        if (!isDisposed) {
          setProviderEnabled({ GOOGLE: false, KAKAO: false });
          setProviderReason({ GOOGLE: null, KAKAO: null });
        }
      });

    return () => {
      isDisposed = true;
    };
  }, [isOpen]);

  const handleClose = () => {
    setAuthError(null);
    setSocialPending(null);
    onClose();
    if (redirectOnReject) {
      navigate(redirectOnReject);
    }
  };

  const handleSignupLink = () => {
    setAuthError(null);
    setSocialPending(null);
    onClose();
    openSignup();
  };

  const handleSocialLogin = async (provider: SocialAuthProvider) => {
    if (!providerEnabled[provider]) {
      if (providerReason[provider] === 'AUTH_011') {
        setAuthError('선택한 소셜 로그인은 아직 준비 중입니다.');
      } else {
        setAuthError('선택한 소셜 로그인 제공자를 현재 사용할 수 없습니다.');
      }
      return;
    }

    setAuthError(null);
    setSocialPending(provider);

    try {
      const fallbackReturnTo = `${location.pathname}${location.search}${location.hash}`;
      const safeReturnTo = sanitizeReturnToPath(returnTo || fallbackReturnTo, PATHS.HOME);
      sessionStorage.setItem('oauth_provider', provider);
      sessionStorage.setItem('oauth_return_to', safeReturnTo);

      const { startSocialAuth } = await import('@/lib/api/auth');
      const response = await startSocialAuth({ provider, intent: 'login', returnTo: safeReturnTo });
      window.location.assign(response.authorizeUrl);
    } catch (error) {
      sessionStorage.removeItem('oauth_provider');
      sessionStorage.removeItem('oauth_return_to');
      if (error instanceof ApiError && error.code === 'AUTH_011') {
        setAuthError('소셜 로그인은 준비 중입니다. 잠시 후 다시 시도해 주세요.');
      } else {
        setAuthError('소셜 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
      setSocialPending(null);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    ref: passwordRegisterRef,
    ...passwordField
  } = register('password');

  const handlePasswordRef = (element: HTMLInputElement | null) => {
    passwordRegisterRef(element);
    passwordInputRef.current = element;
  };

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const { login: apiLogin } = await import('@/lib/api/auth');
      const response = await apiLogin({ email: data.email, password: data.password });
      login(response.user, response.accessToken, response.refreshToken);
      const safeReturnTo = sanitizeReturnToPath(returnTo, PATHS.HOME);
      onClose();
      navigate(safeReturnTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH_001') {
          setAuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (error.code === 'AUTH_002') {
          setAuthError('계정이 잠겨 있습니다. 잠시 후 다시 시도해 주세요.');
        } else {
          setAuthError(error.message || '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      } else {
        setAuthError('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }

      setValue('password', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
      passwordInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        {message && <div className={styles.alertMessage}>{message}</div>}
        {authError && <div className={styles.inlineError}>{authError}</div>}

        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="우리두 로고" className={styles.logoImage} />
          </div>
          <p className={styles.subtitle}>동료들과 함께 목표를 달성해보세요.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="이메일"
            type="email"
            placeholder="이메일 주소를 입력하세요"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="8자 이상 입력"
            error={errors.password?.message}
            {...passwordField}
            ref={handlePasswordRef}
          />

          <Button type="submit" isLoading={isLoading} className={styles.submitButton} variant="primary" size="lg">
            로그인
          </Button>
        </form>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <div className={styles.socialButtons}>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={styles.socialButton}
            disabled={socialPending !== null || !providerEnabled.GOOGLE}
            isLoading={socialPending === 'GOOGLE'}
            onClick={() => void handleSocialLogin('GOOGLE')}
          >
            <img src="/icons/google.svg" alt="" className={styles.socialIcon} />
            구글로 계속하기
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={styles.socialButton}
            disabled={socialPending !== null || !providerEnabled.KAKAO}
            isLoading={socialPending === 'KAKAO'}
            onClick={() => void handleSocialLogin('KAKAO')}
          >
            <img src="/icons/kakao.svg" alt="" className={styles.socialIcon} />
            카카오로 계속하기
          </Button>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Button
              type="button"
              onClick={() => {
                onClose();
                openPasswordReset();
              }}
              className={styles.footerLink}
              size="xs"
              variant="text"
            >
              비밀번호 찾기
            </Button>
            <span className={styles.footerDivider}>|</span>
            <Button type="button" onClick={handleSignupLink} className={styles.footerLink} size="xs" variant="text">
              회원가입
            </Button>
          </div>
        </footer>
      </div>
    </Modal>
  );
}
