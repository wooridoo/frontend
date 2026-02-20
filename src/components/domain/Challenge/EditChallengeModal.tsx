import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useEditChallengeModalStore } from '@/store/modal/useModalStore';
import { useUpdateChallenge } from '@/hooks/useChallenge';
import styles from './CreateChallengeModal.module.css';

interface FormData {
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    maxMembers: number;
}

const defaultFormData: FormData = {
    title: '',
    description: '',
    category: '',
    thumbnailUrl: '',
    maxMembers: 20,
};

export function EditChallengeModal() {
    const { isOpen, challenge, onClose } = useEditChallengeModalStore();

    // Derive initial form data from challenge using useMemo
    const initialFormData = useMemo(() => {
        if (!challenge) return defaultFormData;
        return {
            title: challenge.title,
            description: challenge.description || '',
            category: challenge.category,
            thumbnailUrl: challenge.thumbnailUrl || '',
            maxMembers: challenge.memberCount.max,
        };
    }, [challenge]);

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const updateMutation = useUpdateChallenge();

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const handleChange = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!challenge) return;

        if (!formData.title.trim()) {
            setError('챌린지 이름을 입력해주세요');
            return;
        }

        try {
            await updateMutation.mutateAsync({
                challengeId: challenge.challengeId,
                name: formData.title,
                description: formData.description,
                category: formData.category,
                thumbnailUrl: formData.thumbnailUrl || undefined,
                maxMembers: formData.maxMembers,
            });
            handleClose();
        } catch {
            setError('챌린지 수정에 실패했습니다');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>챌린지 수정</h2>

                <div className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>챌린지 이름 *</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>설명</label>
                        <textarea
                            className={styles.textarea}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>최대 인원</label>
                        <select
                            className={styles.select}
                            value={formData.maxMembers}
                            onChange={(e) => handleChange('maxMembers', Number(e.target.value))}
                        >
                            {[10, 20, 30, 50, 100].map((n) => (
                                <option key={n} value={n}>{n}명</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>썸네일 주소</label>
                        <input
                            type="url"
                            className={styles.input}
                            value={formData.thumbnailUrl}
                            onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                            placeholder="이미지 주소를 입력하세요"
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.actions}>
                        <Button onClick={handleClose} className={styles.cancelButton}>
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? '수정 중...' : '저장'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
