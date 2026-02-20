import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCompleteMeetingModalStore } from '@/store/modal/useModalStore';
import { useCompleteMeeting } from '@/hooks/useMeeting';
import styles from './MeetingModal.module.css';

export function CompleteMeetingModal() {
    const { isOpen, meeting, onClose } = useCompleteMeetingModalStore();
    const completeMutation = useCompleteMeeting();

    const handleComplete = async () => {
        if (!meeting) return;

        try {
            await completeMutation.mutateAsync(meeting.meetingId);
            onClose();
        } catch {
            // Error handled by mutation
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>모임 완료</h2>

                {meeting && (
                    <div className={styles.centeredContent}>
                        <div className={styles.completeEmoji}>
                            ✅
                        </div>
                        <p className={styles.completeTitle}>
                            <strong>{meeting.title}</strong>
                        </p>
                        <p className={styles.completeDescription}>
                            이 모임을 완료 처리하시겠습니까?<br />
                            완료 후에는 참석 인원 확정 및 정산이 진행됩니다.
                        </p>

                        <div className={styles.actions}>
                            <Button onClick={onClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button
                                onClick={handleComplete}
                                className={styles.submitButton}
                                disabled={completeMutation.isPending}
                            >
                                {completeMutation.isPending ? '처리 중...' : '모임 완료'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
