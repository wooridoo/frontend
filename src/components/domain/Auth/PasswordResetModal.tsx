import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { usePasswordResetModalStore } from '@/store/usePasswordResetModalStore';
import { requestPasswordReset } from '@/lib/api/auth';
import styles from './AuthModal.module.css';

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
                        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
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
                                placeholder="example@email.com"
                            />
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

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
                        <div className={styles.successIcon}>📧</div>
                        <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                            비밀번호 재설정 이메일을 보냈습니다!
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-lg)' }}>
                            {email}로 전송된 링크를 확인해주세요
                        </p>
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
