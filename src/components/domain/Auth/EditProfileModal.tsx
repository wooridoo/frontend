import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useEditProfileModalStore } from '@/store/modal/useModalStore';
import { useMyProfile, useUpdateProfile } from '@/hooks/useUser';
import styles from './AuthModal.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function EditProfileModal() {
    const { isOpen, onClose } = useEditProfileModalStore();
    const { data: user } = useMyProfile();
    const updateMutation = useUpdateProfile();

    // 보조 처리
    const initialNickname = useMemo(() => user?.nickname || '', [user]);
    const initialProfileImage = useMemo(() => user?.profileImage || '', [user]);

    const [nickname, setNickname] = useState(initialNickname);
    const [profileImage, setProfileImage] = useState(initialProfileImage);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!nickname.trim()) {
            setError('닉네임을 입력해주세요');
            return;
        }

        if (nickname.length < 2) {
            setError('닉네임은 2자 이상이어야 합니다');
            return;
        }

        try {
            await updateMutation.mutateAsync({
                nickname: nickname.trim(),
                profileImage: profileImage || undefined,
            });
            handleClose();
        } catch {
            setError('프로필 수정에 실패했습니다');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={styles.container}>
                <h2 className={styles.title}>프로필 수정</h2>

                <div className={styles.form}>
                    {/* 보조 설명 */}
                    <div className={styles.avatarPreview}>
                        <img
                            src={profileImage || '/images/avatar-fallback.svg'}
                            alt={nickname}
                            className={styles.avatarPreviewImage}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>닉네임 *</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={nickname}
                            onChange={(e) => {
                                setNickname(e.target.value);
                                setError(null);
                            }}
                            placeholder="닉네임"
                            maxLength={20}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>프로필 이미지 주소</label>
                        <input
                            type="url"
                            className={styles.input}
                            value={profileImage}
                            onChange={(e) => setProfileImage(e.target.value)}
                            placeholder="이미지 주소를 입력하세요"
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.actions}>
                        <Button onClick={handleClose} variant="secondary">
                            취소
                        </Button>
                        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? '저장 중...' : '저장'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
