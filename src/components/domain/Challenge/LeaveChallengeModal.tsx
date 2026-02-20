import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button, SemanticIcon } from '@/components/ui';
import { useLeaveChallengeModalStore } from '@/store/modal/useModalStore';
import { useLeaveChallenge } from '@/hooks/useChallenge';
import styles from './ChallengeModalShared.module.css';

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

                <div className={styles.centeredBlock}>
                    <div className={styles.iconBlock}>
                        <SemanticIcon name="warning" size={48} />
                    </div>
                    <p className={styles.centeredTitle}>
                        {challengeTitle}
                    </p>
                    <p className={styles.centeredDescription}>
                        이 챌린지에서 나가시겠습니까?
                    </p>
                </div>

                <div className={styles.surfacePanel}>
                    <p className={styles.panelText}>
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
