import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import styles from './LoginModal.module.css';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email.').email('Please enter a valid email.'),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(8, 'Password must be at least 8 characters.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginModal() {
  const { isOpen, onClose, redirectOnReject, message } = useLoginModalStore();
  const { onOpen: openSignup } = useSignupModalStore();
  const { onOpen: openPasswordReset } = usePasswordResetModalStore();
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
      login(response.user, response.accessToken, response.refreshToken);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        {message && <div className={styles.alertMessage}>{message}</div>}

        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="Woorido logo" className={styles.logoImage} />
          </div>
          <p className={styles.subtitle}>Achieve goals together with your team.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" isLoading={isLoading} className={styles.submitButton} variant="primary" size="lg">
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.socialButtons}>
          <Button type="button" variant="secondary" size="lg" className={styles.socialButton} disabled>
            <img src="/icons/google.svg" alt="" className={styles.socialIcon} />
            Continue with Google
          </Button>
          <Button type="button" variant="secondary" size="lg" className={styles.socialButton} disabled>
            <img src="/icons/kakao.svg" alt="" className={styles.socialIcon} />
            Continue with Kakao
          </Button>
        </div>

        <footer className={styles.footer}>
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                openPasswordReset();
              }}
              className="hover:text-gray-900 transition-colors"
            >
              Forgot Password
            </button>
            <span>|</span>
            <button type="button" onClick={handleSignupLink} className="hover:text-gray-900 transition-colors">
              Sign Up
            </button>
          </div>
        </footer>
      </div>
    </Modal>
  );
}