import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './SignupPage.module.css';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { signup, login as apiLogin } from '@/lib/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Button, Input } from '@/components/ui';


// Zod Schema
const signupSchema = z.object({
  // Basic Info
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요 (예: 1990-01-01)').optional().or(z.literal('')),
  phone: z.string().regex(/^010-?([0-9]{4})-?([0-9]{4})$/, '올바른 휴대폰 번호 형식이 아닙니다'),

  // Account Info
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string(),
  nickname: z.string().min(2, '닉네임은 2글자 이상이어야 합니다'),

  // Terms
  termsOfService: z.boolean().refine((val) => val === true, {
    message: '서비스 이용약관에 동의해야 합니다',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 이용에 동의해야 합니다',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Terms, 2: Info (Merged), 3: Completion
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      termsOfService: false,
      privacyPolicy: false,
    },
  });

  const termsOfService = watch('termsOfService');
  const privacyPolicy = watch('privacyPolicy');

  const handleNextStep = async () => {
    if (step === 1) {
      const isTermsValid = await trigger(['termsOfService', 'privacyPolicy']);
      if (isTermsValid) setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    else navigate(-1);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Signup
      await signup({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        name: data.name,
        phone: data.phone,
        birthDate: data.birthDate || undefined,
        profileImage: '/images/avatar-fallback.svg',
        termsAgreed: data.termsOfService,
        privacyAgreed: data.privacyPolicy,
        marketingAgreed: false // Default to false
      });

      // 2. Auto Login
      const loginResponse = await apiLogin({ email: data.email, password: data.password });
      login(loginResponse.user, loginResponse.accessToken, loginResponse.refreshToken);

      setStep(3);
    } catch (error) {
      console.error(error);
      // Global error handler will show toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer variant="content" contentWidth="sm">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>우리두</div>
          <h1 className={styles.title}>회원가입</h1>
        </header>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepDot} ${step === 1 ? styles.active : ''}`} />
          <div className={`${styles.stepDot} ${step === 2 ? styles.active : ''}`} />
          <div className={`${styles.stepDot} ${step === 3 ? styles.active : ''}`} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.stepContent}>
          {/* Step 1: Terms Agreement */}
          {step === 1 && (
            <div className={styles.stepWrapper}>
              <h2 className={styles.stepTitle}>약관에 동의해주세요</h2>
              <div className={styles.termsList}>
                <label className={styles.termItem}>
                  <input
                    type="checkbox"
                    {...register('termsOfService')}
                    className={styles.checkbox}
                  />
                  <span className={styles.termText}>
                    <span className={styles.termRequired}>[필수]</span> 서비스 이용약관 동의
                  </span>
                </label>
                {errors.termsOfService && <p className={styles.error}>{errors.termsOfService.message}</p>}

                <label className={styles.termItem}>
                  <input
                    type="checkbox"
                    {...register('privacyPolicy')}
                    className={styles.checkbox}
                  />
                  <span className={styles.termText}>
                    <span className={styles.termRequired}>[필수]</span> 개인정보 수집 및 이용 동의
                  </span>
                </label>
                {errors.privacyPolicy && <p className={styles.error}>{errors.privacyPolicy.message}</p>}
              </div>

              <div className={styles.bottomActions}>
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} className={styles.backButton}>
                  취소
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  trailingIcon={<ChevronRight size={16} />}
                  onClick={handleNextStep}
                  disabled={!termsOfService || !privacyPolicy}
                  className={styles.nextButton}
                >
                  다음
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: User Info (Merged Basic + Account) */}
          {step === 2 && (
            <div className={styles.stepWrapper}>
              <h2 className={styles.stepTitle}>정보를 입력해주세요</h2>

              <div className={styles.formGroup}>
                {/* Basic Info Section */}
                <div className={styles.section}>
                  <Input
                    label="이름 (실명)"
                    placeholder="홍길동"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="휴대폰 번호"
                    placeholder="010-1234-5678"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Input
                    label="생년월일 (선택)"
                    placeholder="예: 1990-01-01"
                    error={errors.birthDate?.message}
                    {...register('birthDate')}
                  />
                </div>

                <hr className={styles.divider} />

                {/* Account Info Section */}
                <div className={styles.section}>
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
                    {...register('password')}
                  />
                  <Input
                    label="비밀번호 확인"
                    type="password"
                    placeholder="비밀번호 재입력"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                  <Input
                    label="닉네임"
                    placeholder="우리두에서 사용할 이름"
                    error={errors.nickname?.message}
                    {...register('nickname')}
                  />
                </div>
              </div>

              <div className={styles.bottomActions}>
                <Button
                  type="button"
                  variant="ghost"
                  leadingIcon={<ChevronLeft size={16} />}
                  onClick={handlePrevStep}
                  className={styles.backButton}
                >
                  이전
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className={styles.nextButton}
                >
                  가입 완료
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 className={styles.successTitle}>환영합니다!</h2>
              <p className={styles.successDesc}>
                회원가입이 완료되었습니다.<br />
                이제 우리두의 모든 서비스를 이용해보세요.
              </p>
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate(PATHS.HOME)}
              >
                시작하기
              </Button>
            </div>
          )}
        </form>
      </div>
    </PageContainer>
  );
}
