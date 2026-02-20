import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import logo from '@/assets/woorido_logo.svg';
import { Modal } from '@/components/ui/Overlay/Modal';
import { useSignupModalStore } from '@/store/modal/useModalStore';
import { useLoginModalStore } from '@/store/modal/useModalStore';
import { MessageCircle, Mail } from 'lucide-react'; // Icons for buttons
import { PATHS } from '@/routes/paths';
import { sanitizeReturnToPath } from '@/lib/utils/authNavigation';
import { toast } from 'sonner';
import styles from './SignupModal.module.css';

export function SignupModal() {
    const { isOpen, onClose } = useSignupModalStore();
    const { onOpen: openLogin } = useLoginModalStore();
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = sanitizeReturnToPath(`${location.pathname}${location.search}${location.hash}`, PATHS.HOME);

    const handleLoginLink = () => {
        onClose();
        openLogin({ returnTo });
    };

    const handleEmailSignup = () => {
        onClose();
        navigate(PATHS.SIGNUP);
    };

    const handleKakaoLogin = () => {
        toast.info('카카오 로그인은 준비 중입니다.');
    };

    const handleGoogleLogin = () => {
        toast.info('구글 로그인은 준비 중입니다.');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modalContent}>
            <div className={styles.container}>
                {/* Logo & Branding */}
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
                    {/* Social Login Buttons */}
                    <Button
                        className={`${styles.socialButton} ${styles.kakaoButton}`}
                        onClick={handleKakaoLogin}
                        size="lg"
                        type="button"
                        variant="secondary"
                    >
                        <MessageCircle size={20} fill="currentColor" className={styles.icon} />
                        <span>카카오로 3초만에 시작하기</span>
                    </Button>

                    <Button
                        className={`${styles.socialButton} ${styles.googleButton}`}
                        onClick={handleGoogleLogin}
                        size="lg"
                        type="button"
                        variant="outline"
                    >
                        <img src="/icons/google.svg" alt="" className={styles.googleIconImage} />
                        <span>구글로 시작하기</span>
                    </Button>

                    <div className={styles.divider}>
                        <span>또는</span>
                    </div>

                    {/* Email Signup Button */}
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

                {/* Footer Links */}
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
