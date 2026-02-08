import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useDeleteChallengeModalStore } from '@/store/useDeleteChallengeModalStore';
import { useDeleteChallenge } from '@/hooks/useChallenge';
import styles from './CreateChallengeModal.module.css';

export function DeleteChallengeModal() {
    const { isOpen, challengeId, challengeTitle, onClose } = useDeleteChallengeModalStore();
    const [confirmText, setConfirmText] = useState('');

    const deleteMutation = useDeleteChallenge();

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    const handleDelete = async () => {
        if (!challengeId || confirmText !== '삭제') return;

        try {
            await deleteMutation.mutateAsync(challengeId);
            handleClose();
            // Navigate to challenges list after deletion
        } catch {
            // Error handled by mutation
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title} style={{ color: 'var(--color-error)' }}>
                    ⚠️ 챌린지 삭제
                </h2>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                        {challengeTitle}
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        이 챌린지를 정말 삭제하시겠습니까?<br />
                        <strong style={{ color: 'var(--color-error)' }}>이 작업은 되돌릴 수 없습니다.</strong>
                    </p>
                </div>

                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-lg)',
                }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: '#dc2626', margin: 0 }}>
                        삭제 시 다음 데이터가 모두 삭제됩니다:
                    </p>
                    <ul style={{ fontSize: 'var(--font-size-sm)', color: '#dc2626', margin: 'var(--spacing-xs) 0 0', paddingLeft: 'var(--spacing-lg)' }}>
                        <li>모든 모임 기록</li>
                        <li>모든 투표 기록</li>
                        <li>모든 피드 게시물</li>
                        <li>모든 장부 기록</li>
                    </ul>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        확인을 위해 "삭제"를 입력해주세요
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="삭제"
                    />
                </div>

                <div className={styles.actions}>
                    <Button onClick={handleClose} className={styles.cancelButton}>
                        취소
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={confirmText !== '삭제' || deleteMutation.isPending}
                        style={{ background: 'var(--color-error)' }}
                    >
                        {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
