import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useDeleteChallengeModalStore } from '@/store/modal/useModalStore';
import { useDeleteChallenge } from '@/hooks/useChallenge';
import styles from './ChallengeModalShared.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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
            // 보조 처리
        } catch {
            // 보조 처리
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={`${styles.title} ${styles.titleDanger}`}>
                    ⚠️ 챌린지 삭제
                </h2>

                <div className={styles.centeredBlock}>
                    <p className={styles.centeredTitle}>
                        {challengeTitle}
                    </p>
                    <p className={styles.centeredDescription}>
                        이 챌린지를 정말 삭제하시겠습니까?<br />
                        <strong className={styles.dangerStrong}>이 작업은 되돌릴 수 없습니다.</strong>
                    </p>
                </div>

                <div className={styles.dangerPanel}>
                    <p className={styles.dangerPanelTitle}>
                        삭제 시 다음 데이터가 모두 삭제됩니다:
                    </p>
                    <ul className={styles.dangerPanelList}>
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
                    <Button onClick={handleClose} variant="outline" fullWidth>
                        취소
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={confirmText !== '삭제' || deleteMutation.isPending}
                        variant="danger"
                        fullWidth
                    >
                        {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
