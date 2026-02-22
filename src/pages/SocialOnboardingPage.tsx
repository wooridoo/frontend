import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { ApiError } from '@/lib/api/client';
import { completeSocialOnboarding } from '@/lib/api/user';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './SocialOnboardingPage.module.css';

const onboardingSchema = z.object({
  nickname: z.string().min(2, '닉네임은 2자 이상 입력해 주세요.').max(20, '닉네임은 20자까지 입력할 수 있습니다.'),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '휴대폰 번호는 010-0000-0000 형식으로 입력해 주세요.'),
  termsAgreed: z.boolean().refine((value) => value, { message: '서비스 이용약관에 동의해 주세요.' }),
  privacyAgreed: z.boolean().refine((value) => value, { message: '개인정보 수집 및 이용에 동의해 주세요.' }),
  marketingAgreed: z.boolean(),
});

type SocialOnboardingForm = z.infer<typeof onboardingSchema>;

/**
 * 소셜 신규가입 사용자의 필수 온보딩 정보를 입력받는 페이지입니다.
 */
export function SocialOnboardingPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, updateUser } = useAuthStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultNickname = useMemo(() => user?.nickname || '', [user?.nickname]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialOnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      nickname: defaultNickname,
      phone: '',
      termsAgreed: false,
      privacyAgreed: false,
      marketingAgreed: false,
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(PATHS.HOME, { replace: true });
      return;
    }

    if (!user?.requiresOnboarding) {
      const target = sanitizeReturnToPath(sessionStorage.getItem('oauth_return_to'), PATHS.HOME);
      navigate(target, { replace: true });
    }
  }, [isLoggedIn, navigate, user?.requiresOnboarding]);

  const onSubmit = async (form: SocialOnboardingForm) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await completeSocialOnboarding(form);
      updateUser(response.user);

      const returnTo = sanitizeReturnToPath(sessionStorage.getItem('oauth_return_to'), PATHS.HOME);
      sessionStorage.removeItem('oauth_return_to');
      sessionStorage.removeItem('oauth_provider');
      navigate(returnTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'USER_007') {
          setSubmitError('이미 사용 중인 닉네임입니다.');
        } else if (error.code === 'VALIDATION_001') {
          setSubmitError('필수 약관 동의 또는 입력 형식을 확인해 주세요.');
        } else {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError('온보딩 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer variant="content" contentWidth="sm">
      <PageHeader title="소셜 가입 정보 입력" showBack={false} />
      <section className={styles.card}>
        <h2 className={styles.title}>가입을 완료하려면 정보 입력이 필요합니다.</h2>
        <p className={styles.description}>닉네임, 휴대폰 번호, 필수 약관 동의를 완료해 주세요.</p>

        {submitError && <div className={styles.errorBox}>{submitError}</div>}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="닉네임"
            placeholder="우리두에서 사용할 이름"
            error={errors.nickname?.message}
            {...register('nickname')}
          />
          <Input
            label="휴대폰 번호"
            placeholder="010-1234-5678"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register('termsAgreed')} />
            <span>[필수] 서비스 이용약관 동의</span>
          </label>
          {errors.termsAgreed?.message ? <p className={styles.fieldError}>{errors.termsAgreed.message}</p> : null}

          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register('privacyAgreed')} />
            <span>[필수] 개인정보 수집 및 이용 동의</span>
          </label>
          {errors.privacyAgreed?.message ? <p className={styles.fieldError}>{errors.privacyAgreed.message}</p> : null}

          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register('marketingAgreed')} />
            <span>[선택] 마케팅 정보 수신 동의</span>
          </label>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
            가입 완료
          </Button>
        </form>
      </section>
    </PageContainer>
  );
}
