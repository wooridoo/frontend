import { useEffect, useMemo, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useEditChallengeModalStore } from '@/store/modal/useModalStore';
import { useUpdateChallenge } from '@/hooks/useChallenge';
import { uploadChallengeBanner, uploadChallengeThumbnail } from '@/lib/api/upload';
import { validateSingleImageFile } from '@/lib/image/validation';
import styles from './ChallengeModalShared.module.css';

interface FormData {
    title: string;
    description: string;
    category: string;
    bannerUrl: string;
    thumbnailUrl: string;
    maxMembers: number;
}

const defaultFormData: FormData = {
    title: '',
    description: '',
    category: '',
    bannerUrl: '',
    thumbnailUrl: '',
    maxMembers: 20,
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function EditChallengeModal() {
    const { isOpen, challenge, onClose } = useEditChallengeModalStore();

    // 보조 처리
    const initialFormData = useMemo(() => {
        if (!challenge) return defaultFormData;
        return {
            title: challenge.title,
            description: challenge.description || '',
            category: challenge.category,
            bannerUrl: challenge.bannerUrl || '',
            thumbnailUrl: challenge.thumbnailUrl || '',
            maxMembers: challenge.memberCount.max,
        };
    }, [challenge]);

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);
    const [bannerUploading, setBannerUploading] = useState(false);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);

    const updateMutation = useUpdateChallenge();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            setError(null);
        }
    }, [initialFormData, isOpen]);

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
                bannerImage: formData.bannerUrl || undefined,
                thumbnailImage: formData.thumbnailUrl || undefined,
                maxMembers: formData.maxMembers,
            });
            handleClose();
        } catch {
            setError('챌린지 수정에 실패했습니다');
        }
    };

    const handleImageUpload = async (type: 'banner' | 'thumbnail', file: File) => {
        if (type === 'banner') {
            setBannerUploading(true);
        } else {
            setThumbnailUploading(true);
        }

        try {
            await validateSingleImageFile(type === 'banner' ? 'CHALLENGE_BANNER' : 'CHALLENGE_THUMBNAIL', file);
            const imageUrl = type === 'banner'
                ? await uploadChallengeBanner(file)
                : await uploadChallengeThumbnail(file);
            if (!imageUrl) {
                throw new Error('이미지 업로드 결과가 비어 있습니다.');
            }
            if (type === 'banner') {
                handleChange('bannerUrl', imageUrl);
            } else {
                handleChange('thumbnailUrl', imageUrl);
            }
            toast.success(type === 'banner' ? '배너 이미지 업로드 완료' : '썸네일 이미지 업로드 완료');
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : '이미지 업로드에 실패했습니다');
        } finally {
            if (type === 'banner') {
                setBannerUploading(false);
            } else {
                setThumbnailUploading(false);
            }
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
                            {[10, 20, 30].map((n) => (
                                <option key={n} value={n}>{n}명</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>대표 이미지 (배너)</label>
                        <label className={styles.uploadArea}>
                            <input
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                className={styles.hiddenFileInput}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        void handleImageUpload('banner', file);
                                    }
                                    event.target.value = '';
                                }}
                                type="file"
                            />
                            {formData.bannerUrl ? (
                                <img
                                    className={styles.uploadPreview}
                                    src={formData.bannerUrl}
                                    alt="배너 미리보기"
                                />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <Upload size={22} />
                                    <span>{bannerUploading ? '업로드 중...' : '배너 이미지 업로드'}</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>프로필 이미지 (썸네일)</label>
                        <label className={styles.uploadArea}>
                            <input
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                className={styles.hiddenFileInput}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        void handleImageUpload('thumbnail', file);
                                    }
                                    event.target.value = '';
                                }}
                                type="file"
                            />
                            {formData.thumbnailUrl ? (
                                <img
                                    className={styles.uploadPreview}
                                    src={formData.thumbnailUrl}
                                    alt="썸네일 미리보기"
                                />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <Upload size={22} />
                                    <span>{thumbnailUploading ? '업로드 중...' : '썸네일 이미지 업로드'}</span>
                                </div>
                            )}
                        </label>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.actions}>
                        <Button onClick={handleClose} variant="outline" fullWidth>
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={updateMutation.isPending}
                            fullWidth
                        >
                            {updateMutation.isPending ? '수정 중...' : '저장'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
