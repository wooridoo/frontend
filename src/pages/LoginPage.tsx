import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import styles from './LoginPage.module.css';

// Login form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 8자 이상이어야 합니다'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // TODO: Call login API
      console.log('Login attempt:', data);
      // await authApi.login(data);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Logo & Branding */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🍊</span>
            <h1 className={styles.logoText}>우리두</h1>
          </div>
          <p className={styles.tagline}>함께하는 모임, 함께하는 성장</p>
        </header>

        {/* Login Form */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="이메일"
            type="email"
            placeholder="email@example.com"
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className={styles.submitButton}
          >
            로그인
          </Button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span>또는</span>
        </div>

        {/* Social Login (P2) */}
        <div className={styles.socialButtons}>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={styles.socialButton}
            disabled
          >
            <img src="/icons/google.svg" alt="" className={styles.socialIcon} />
            Google로 계속하기
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={styles.socialButton}
            disabled
          >
            <img src="/icons/kakao.svg" alt="" className={styles.socialIcon} />
            카카오로 계속하기
          </Button>
        </div>

        {/* Footer Links */}
        <footer className={styles.footer}>
          <p className={styles.signupPrompt}>
            아직 회원이 아니신가요?{' '}
            <Link to="/signup" className={styles.signupLink}>
              회원가입
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
