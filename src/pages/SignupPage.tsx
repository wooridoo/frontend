import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ChevronLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import styles from './SignupPage.module.css';
import { PATHS } from '@/routes/paths';

// Zod Schema
const signupSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다')
    .regex(/[a-zA-Z]/, '영문을 포함해야 합니다'),
  confirmPassword: z.string(),
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다').max(10, '닉네임은 10자 이내여야 합니다'),
  termsOfService: z.literal(true, {
    errorMap: () => ({ message: '서비스 이용약관에 동의해주세요' }),
  }),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리방침에 동의해주세요' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });



  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['termsOfService', 'privacyPolicy']);
    } else if (step === 2) {
      isValid = await trigger(['email', 'password', 'confirmPassword', 'nickname']);
      if (isValid && !isEmailVerified) {
        alert('이메일 인증을 완료해주세요');
        return;
      }
    }

    if (isValid) {
      if (step === 2) {
        onSubmit(getValues());
      } else {
        setStep((prev) => (prev + 1) as 1 | 2 | 3);
      }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleVerifyEmail = async () => {
    const email = watch('email');
    const isValidEmail = await trigger('email');
    if (!isValidEmail) return;

    // Mock API Call
    alert(`인증 메일이 ${email}로 발송되었습니다.\n(테스트: 확인을 누르면 인증된 것으로 처리됩니다)`);
    setIsEmailVerified(true);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      // Mock API Call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Signup Data:', data);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    navigate(PATHS.HOME);
  };

  return (
    <div className={styles.container}>
      {step < 3 && (
        <>
          <header className={styles.header}>
            <div className={styles.logo}>WooriDo</div>
            <h1 className={styles.title}>회원가입</h1>
          </header>

          <div className={styles.stepIndicator}>
            <div className={`${styles.stepDot} ${step === 1 ? styles.active : ''}`} />
            <div className={`${styles.stepDot} ${step === 2 ? styles.active : ''}`} />
          </div>
        </>
      )}

      <form className={styles.stepContent} onSubmit={(e) => e.preventDefault()}>
        {/* Step 1: 약관 동의 */}
        {step === 1 && (
          <>
            <h2 className={styles.stepTitle}>약관에 동의해주세요</h2>
            <div className={styles.termsList}>
              <label className={styles.termItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...register('termsOfService')}
                />
                <span className={styles.termText}>
                  <span className={styles.termRequired}>[필수]</span>
                  서비스 이용약관 동의
                </span>
              </label>
              {errors.termsOfService && (
                <span className={styles.error}>{errors.termsOfService.message}</span>
              )}

              <label className={styles.termItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...register('privacyPolicy')}
                />
                <span className={styles.termText}>
                  <span className={styles.termRequired}>[필수]</span>
                  개인정보 수집 및 이용 동의
                </span>
              </label>
              {errors.privacyPolicy && (
                <span className={styles.error}>{errors.privacyPolicy.message}</span>
              )}
            </div>
          </>
        )}

        {/* Step 2: 정보 입력 */}
        {step === 2 && (
          <>
            <h2 className={styles.stepTitle}>정보를 입력해주세요</h2>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>이메일</label>
                <div className={styles.emailVerifyGroup}>
                  <input
                    className={styles.input}
                    placeholder="example@email.com"
                    type="email"
                    {...register('email')}
                    disabled={isEmailVerified}
                  />
                  <Button
                    type="button"
                    variant={isEmailVerified ? 'secondary' : 'primary'}
                    size="md"
                    onClick={handleVerifyEmail}
                    disabled={isEmailVerified}
                    className={styles.verifyButton}
                  >
                    {isEmailVerified ? '인증완료' : '인증하기'}
                  </Button>
                </div>
                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
              </div>

              <Input
                label="비밀번호"
                type="password"
                placeholder="영문, 숫자 포함 8자 이상"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Input
                label="닉네임"
                placeholder="2~10자 이내"
                error={errors.nickname?.message}
                {...register('nickname')}
              />
            </div>
          </>
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <CheckCircle size={40} />
            </div>
            <h2 className={styles.successTitle}>환영합니다!</h2>
            <p className={styles.successDesc}>
              회원가입이 완료되었습니다.<br />
              이제 우리두와 함께 목표를 달성해보세요!
            </p>
            <Button
              className={styles.submitButton}
              size="lg"
              onClick={handleComplete}
            >
              시작하기
            </Button>
          </div>
        )}
      </form>

      {step < 3 && (
        <div className={styles.bottomActions}>
          <Button
            variant="ghost"
            onClick={handleBack}
            className={styles.backButton}
          >
            <ChevronLeft size={20} /> 이전
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            isLoading={isSubmitting}
            className={styles.nextButton}
          >
            {step === 2 ? '완료' : '다음'}
          </Button>
        </div>
      )}
    </div>
  );
}
