import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import logo from '@/assets/woorido_logo.svg';
import { Modal } from '@/components/ui/Overlay/Modal';
import { useLoginModalStore } from '@/store/useLoginModalStore';
import { useSignupModalStore } from '@/store/useSignupModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './LoginModal.module.css';

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

export function LoginModal() {
  const { isOpen, onClose, redirectOnReject, message } = useLoginModalStore();
  const { onOpen: openSignup } = useSignupModalStore();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    if (redirectOnReject) {
      navigate(redirectOnReject);
    }
  };

  const handleSignupLink = () => {
    onClose();
    openSignup();
  };

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
      const { login: apiLogin } = await import('@/lib/api/auth');
      const response = await apiLogin({ email: data.email, password: data.password });

      console.log('Login success:', response);

      // Store token and user data
      login(response.user, response.accessToken);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
      // alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        {/* Optional Alert Message */}
        {message && (
          <div className={styles.alertMessage}>
            {message}
          </div>
        )}

        {/* Logo & Branding */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="우리두 로고" className={styles.logoImage} />
          </div>
          <p className={styles.subtitle}>동료들과 함께 목표를 달성해보세요.</p>
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
            isLoading={isLoading}
            className={styles.submitButton}
            variant="primary"
            size="lg"
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
            <button type="button" onClick={handleSignupLink} className={styles.signupLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>
              회원가입
            </button>
          </p>
        </footer>
      </div>
    </Modal>
  );
}
