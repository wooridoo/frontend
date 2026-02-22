import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import logo from '@/assets/woorido_logo.svg';
import { Modal } from '@/components/ui/Overlay/Modal';
import { useSignupModalStore } from '@/store/modal/useModalStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { MessageCircle, Mail } from 'lucide-react'; // ?? ??
import { PATHS } from '@/routes/paths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import { ApiError } from '@/lib/api/client';
import type { SocialAuthProvider } from '@/types/auth';
import { toast } from 'sonner';
import { useState } from 'react';
import styles from './SignupModal.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function SignupModal() {
    const { isOpen, onClose } = useSignupModalStore();
    const { onOpen: openLogin } = useLoginModalStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [socialPending, setSocialPending] = useState<SocialAuthProvider | null>(null);
    const returnTo = sanitizeReturnToPath(`${location.pathname}${location.search}${location.hash}`, PATHS.HOME);

    const handleClose = () => {
        setSocialPending(null);
        onClose();
    };

    const handleLoginLink = () => {
        handleClose();
        openLogin({ returnTo });
    };

    const handleEmailSignup = () => {
        handleClose();
        navigate(PATHS.SIGNUP);
    };

    const handleSocialSignup = async (provider: SocialAuthProvider) => {
        setSocialPending(provider);
        try {
            sessionStorage.setItem('oauth_provider', provider);
            sessionStorage.setItem('oauth_return_to', returnTo);
            const { startSocialAuth } = await import('@/lib/api/auth');
            const response = await startSocialAuth({ provider, intent: 'signup', returnTo });
            window.location.assign(response.authorizeUrl);
        } catch (error) {
            sessionStorage.removeItem('oauth_provider');
            sessionStorage.removeItem('oauth_return_to');
            if (error instanceof ApiError && error.code === 'AUTH_011') {
                toast.info('소셜 로그인은 준비 중입니다.');
            } else {
                toast.error('소셜 로그인 처리 중 문제가 발생했습니다.');
            }
            setSocialPending(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                {/* 보조 설명 */}
                <header className={styles.header}>
                    <div className={styles.logo}>
                        <img src={logo} alt="우리두 로고" className={styles.logoImage} />
                    </div>
                    <h2 className={styles.title}>회원가입</h2>
                    <p className={styles.subtitle}>
                        3초만에 가입하고<br />
                        도전하는 즐거움을 느껴보세요.
                    </p>
                </header>

                <div className={styles.buttonGroup}>
                    {/* 보조 설명 */}
                    <Button
                        className={`${styles.socialButton} ${styles.kakaoButton}`}
                        onClick={() => void handleSocialSignup('KAKAO')}
                        size="lg"
                        type="button"
                        variant="secondary"
                        disabled={socialPending !== null}
                        isLoading={socialPending === 'KAKAO'}
                    >
                        <MessageCircle size={20} fill="currentColor" className={styles.icon} />
                        <span>카카오로 3초만에 시작하기</span>
                    </Button>

                    <Button
                        className={`${styles.socialButton} ${styles.googleButton}`}
                        onClick={() => void handleSocialSignup('GOOGLE')}
                        size="lg"
                        type="button"
                        variant="outline"
                        disabled={socialPending !== null}
                        isLoading={socialPending === 'GOOGLE'}
                    >
                        <img src="/icons/google.svg" alt="" className={styles.googleIconImage} />
                        <span>구글로 시작하기</span>
                    </Button>

                    <div className={styles.divider}>
                        <span>또는</span>
                    </div>

                    {/* 보조 설명 */}
                    <Button
                        variant="secondary"
                        size="lg"
                        className={styles.emailButton}
                        onClick={handleEmailSignup}
                        leadingIcon={<Mail size={18} className={styles.icon} />}
                    >
                        이메일로 가입하기
                    </Button>
                </div>

                {/* 보조 설명 */}
                <footer className={styles.footer}>
                    <p className={styles.loginPrompt}>
                        이미 계정이 있으신가요?{' '}
                        <Button
                            size="xs"
                            type="button"
                            onClick={handleLoginLink}
                            className={styles.loginLink}
                            variant="text"
                        >
                            로그인
                        </Button>
                    </p>
                </footer>
            </div>
        </Modal>
    );
}
