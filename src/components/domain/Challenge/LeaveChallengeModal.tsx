import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button, SemanticIcon } from '@/components/ui';
import { useLeaveChallengeModalStore } from '@/store/modal/useModalStore';
import { useLeaveChallenge } from '@/hooks/useChallenge';
import styles from './CreateChallengeModal.module.css';

export function LeaveChallengeModal() {
    const { isOpen, challengeId, challengeTitle, onClose } = useLeaveChallengeModalStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const leaveMutation = useLeaveChallenge();

    const handleLeave = async () => {
        if (!challengeId) return;

        setIsSubmitting(true);
        try {
            await leaveMutation.mutateAsync(challengeId);
            onClose();
            // Navigate to challenges list
        } catch {
            // Error handled by mutation
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>챌린지 나가기</h2>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <SemanticIcon name="warning" size={48} />
                    </div>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                        {challengeTitle}
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        이 챌린지에서 나가시겠습니까?
                    </p>
                </div>

                <div style={{
                    background: 'var(--color-surface-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-lg)',
                }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                        • 나가기 후에도 다시 참여할 수 있습니다<br />
                        • 보증금은 정산 후 반환됩니다<br />
                        • 작성한 게시물은 유지됩니다
                    </p>
                </div>

                <div className={styles.actions}>
                    <Button onClick={onClose} variant="outline" fullWidth>
                        취소
                    </Button>
                    <Button
                        onClick={handleLeave}
                        disabled={isSubmitting}
                        variant="danger"
                        fullWidth
                    >
                        {isSubmitting ? '처리 중...' : '나가기'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
