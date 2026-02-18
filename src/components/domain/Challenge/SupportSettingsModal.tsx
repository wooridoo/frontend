import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useSupportSettingsModalStore } from '@/store/modal/useModalStore';
import { useChallengeDetail, useUpdateSupportSettings } from '@/hooks/useChallenge';
import { formatCurrency } from '@/lib/utils';
import styles from './CreateChallengeModal.module.css';

const toBoolean = (value: unknown): boolean | undefined => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toUpperCase() === 'Y' || value.toLowerCase() === 'true') return true;
        if (value.toUpperCase() === 'N' || value.toLowerCase() === 'false') return false;
    }
    return undefined;
};

export function SupportSettingsModal() {
    const { isOpen, challengeId, onClose } = useSupportSettingsModalStore();
    const { data: challenge } = useChallengeDetail(challengeId || undefined);
    const updateMutation = useUpdateSupportSettings(challengeId || '');
    const [autoPayEnabled, setAutoPayEnabled] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setSaved(false);
        const initialValue = toBoolean((challenge?.myMembership as { autoPayEnabled?: unknown } | undefined)?.autoPayEnabled);
        if (typeof initialValue === 'boolean') {
            setAutoPayEnabled(initialValue);
        }
    }, [isOpen, challenge?.myMembership]);

    const handleClose = () => {
        setSaved(false);
        onClose();
    };

    const handleSave = async () => {
        if (!challengeId) return;
        try {
            const response = await updateMutation.mutateAsync({ autoPayEnabled });
            setAutoPayEnabled(response.autoPayEnabled);
            setSaved(true);
            setTimeout(handleClose, 1200);
        } catch {
            // handled by global error normalizer
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>서포트 설정</h2>

                {saved ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-md)' }}>✅</div>
                        <p>설정이 저장되었습니다.</p>
                    </div>
                ) : (
                    <div className={styles.form}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>월 서포트 금액</label>
                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                                {formatCurrency(challenge?.supportAmount || 0)}
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                챌린지 월 서포트 금액은 리더가 챌린지 설정에서 관리합니다.
                            </p>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <input
                                    type="checkbox"
                                    checked={autoPayEnabled}
                                    onChange={(event) => setAutoPayEnabled(event.target.checked)}
                                />
                                <span className={styles.label}>자동 납입 사용</span>
                            </label>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                매월 1일에 서포트 금액이 자동 결제됩니다.
                            </p>
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button
                                onClick={() => void handleSave()}
                                className={styles.submitButton}
                                disabled={!challengeId || updateMutation.isPending}
                            >
                                {updateMutation.isPending ? '저장 중...' : '저장'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
