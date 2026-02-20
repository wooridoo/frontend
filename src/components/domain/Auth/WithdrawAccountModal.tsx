import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useWithdrawAccountModalStore } from '@/store/modal/useModalStore';
import { useWithdrawAccount } from '@/hooks/useUser';
import { PATHS } from '@/routes/paths';
import styles from './WithdrawAccountModal.module.css';

export function WithdrawAccountModal() {
    const { isOpen, onClose } = useWithdrawAccountModalStore();
    const [confirmText, setConfirmText] = useState('');
    const [password, setPassword] = useState('');
    const withdrawMutation = useWithdrawAccount();
    const navigate = useNavigate();

    const handleClose = () => {
        setConfirmText('');
        setPassword('');
        onClose();
    };

    const handleWithdraw = async () => {
        if (confirmText !== '탈퇴' || !password.trim()) return;

        try {
            await withdrawMutation.mutateAsync({ password: password.trim(), reason: 'USER_REQUEST' });
            navigate(PATHS.HOME, { replace: true });
        } catch {
            // Error handled by mutation
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    ⚠️ 회원 탈퇴
                </h2>

                <div className={styles.descriptionBox}>
                    <p className={styles.description}>
                        정말 탈퇴하시겠습니까?<br />
                        <strong className={styles.descriptionStrong}>이 작업은 되돌릴 수 없습니다.</strong>
                    </p>
                </div>

                <div className={styles.warningPanel}>
                    <p className={styles.warningTitle}>
                        탈퇴 시 삭제되는 정보:
                    </p>
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

                <div className={styles.actions}>
                    <Button onClick={handleClose} variant="secondary">
                        취소
                    </Button>
                    <Button
                        className={styles.withdrawButton}
                        onClick={handleWithdraw}
                        disabled={confirmText !== '탈퇴' || !password.trim() || withdrawMutation.isPending}
                    >
                        {withdrawMutation.isPending ? '처리 중...' : '탈퇴하기'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
