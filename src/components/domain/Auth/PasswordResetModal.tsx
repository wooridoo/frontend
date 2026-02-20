import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button, SemanticIcon } from '@/components/ui';
import { usePasswordResetModalStore } from '@/store/modal/useModalStore';
import { requestPasswordReset } from '@/lib/api/auth';
import styles from './PasswordResetModal.module.css';

/**
 * 비밀번호 재설정 요청 모달입니다.
 * 이메일 입력 단계와 전송 완료 단계를 같은 모달에서 관리합니다.
 */
export function PasswordResetModal() {
    const { isOpen, onClose } = usePasswordResetModalStore();
    const [step, setStep] = useState<'email' | 'sent'>('email');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setStep('email');
        setEmail('');
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError('이메일을 입력해주세요');
            return;
        }

        if (!email.includes('@')) {
            setError('올바른 이메일 형식을 입력해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            await requestPasswordReset(email);
            setStep('sent');
        } catch {
            setError('비밀번호 재설정 이메일 전송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={styles.container}>
                <h2 className={styles.title}>비밀번호 재설정</h2>

                {step === 'email' && (
                    <div className={styles.form}>
                        <p className={styles.description}>
                            가입하신 이메일 주소를 입력하시면<br />
                            비밀번호 재설정 링크를 보내드립니다.
                        </p>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>이메일</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                placeholder="가입한 이메일 주소를 입력하세요"
                            />
                        </div>

                        {error && (
                            <div className={styles.error} role="alert" aria-live="polite">
                                {error}
                            </div>
                        )}

                        <div className={styles.actions}>
                            <Button onClick={handleClose} variant="secondary">
                                취소
                            </Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? '전송 중...' : '전송'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'sent' && (
                    <div className={styles.success}>
                        <div className={styles.successIcon}>
                            <SemanticIcon name="notification" size={36} />
                        </div>
                        <p className={styles.successTitle}>
                            비밀번호 재설정 이메일을 보냈습니다!
                        </p>
                        <p className={styles.successDescription}>
                            {email}로 전송된 링크를 확인해주세요
                        </p>
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
