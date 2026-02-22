import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useWithdrawAccountModalStore } from '@/store/modal/useModalStore';
import { useMyProfile, useWithdrawAccount } from '@/hooks/useUser';
import { ApiError } from '@/lib/api/client';
import { PATHS } from '@/routes/paths';
import styles from './WithdrawAccountModal.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function WithdrawAccountModal() {
    const { isOpen, onClose } = useWithdrawAccountModalStore();
    const { data: userProfile } = useMyProfile();
    const [confirmText, setConfirmText] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const withdrawMutation = useWithdrawAccount();
    const navigate = useNavigate();
    const hasPassword = userProfile?.hasPassword ?? true;

    const handleClose = () => {
        setConfirmText('');
        setPassword('');
        setErrorMessage(null);
        onClose();
    };

    const handleWithdraw = async () => {
        const passwordRequired = hasPassword;
        if (confirmText !== '탈퇴' || (passwordRequired && !password.trim())) return;
        setErrorMessage(null);

        try {
            await withdrawMutation.mutateAsync({
                reason: 'USER_REQUEST',
                ...(passwordRequired ? { password: password.trim() } : {}),
            });
            navigate(PATHS.HOME, { replace: true });
        } catch (error) {
            if (error instanceof ApiError && error.code === 'USER_003') {
                setErrorMessage('비밀번호가 일치하지 않습니다.');
                return;
            }
            if (error instanceof ApiError && error.code === 'USER_009') {
                setErrorMessage('비밀번호를 입력해주세요.');
                return;
            }
            setErrorMessage('탈퇴 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.title}>
                        <TriangleAlert size={24} className={styles.titleIcon} />
                        회원 탈퇴
                    </h2>
                    <p className={styles.description}>
                        정말 탈퇴하시겠습니까?
                        <strong className={styles.descriptionStrong}> 이 작업은 되돌릴 수 없습니다.</strong>
                    </p>
                </header>

                <div className={styles.warningPanel} role="note" aria-live="polite">
                    <p className={styles.warningTitle}>탈퇴 시 삭제되는 정보:</p>
                    <ul className={styles.warningList}>
                        <li>모든 챌린지 참여 정보</li>
                        <li>작성한 게시물 및 댓글</li>
                        <li>거래 내역 및 지갑 정보</li>
                    </ul>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        확인을 위해 "탈퇴"를 입력해주세요
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="탈퇴"
                    />
                </div>

                {hasPassword && (
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력해주세요"
                        />
                    </div>
                )}

                {errorMessage && (
                    <p className={styles.error} role="alert" aria-live="polite">
                        {errorMessage}
                    </p>
                )}

                <div className={styles.actions}>
                    <Button onClick={handleClose} variant="secondary">
                        취소
                    </Button>
                    <Button
                        className={styles.withdrawButton}
                        onClick={handleWithdraw}
                        disabled={confirmText !== '탈퇴' || (hasPassword && !password.trim()) || withdrawMutation.isPending}
                    >
                        {withdrawMutation.isPending ? '처리 중...' : '탈퇴하기'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
