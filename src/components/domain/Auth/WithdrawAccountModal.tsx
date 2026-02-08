import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useWithdrawAccountModalStore } from '@/store/useWithdrawAccountModalStore';
import { useWithdrawAccount } from '@/hooks/useUser';
import styles from './AuthModal.module.css';

export function WithdrawAccountModal() {
    const { isOpen, onClose } = useWithdrawAccountModalStore();
    const [confirmText, setConfirmText] = useState('');
    const withdrawMutation = useWithdrawAccount();

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    const handleWithdraw = async () => {
        if (confirmText !== '탈퇴') return;

        try {
            await withdrawMutation.mutateAsync();
            // Redirect to home or login page after withdrawal
            window.location.href = '/';
        } catch {
            // Error handled by mutation
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={styles.container}>
                <h2 className={styles.title} style={{ color: 'var(--color-error)' }}>
                    ⚠️ 회원 탈퇴
                </h2>

                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        정말 탈퇴하시겠습니까?<br />
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
                        탈퇴 시 삭제되는 정보:
                    </p>
                    <ul style={{ fontSize: 'var(--font-size-sm)', color: '#dc2626', margin: 'var(--spacing-xs) 0 0', paddingLeft: 'var(--spacing-lg)' }}>
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

                <div className={styles.actions}>
                    <Button onClick={handleClose} variant="secondary">
                        취소
                    </Button>
                    <Button
                        onClick={handleWithdraw}
                        disabled={confirmText !== '탈퇴' || withdrawMutation.isPending}
                        style={{ background: 'var(--color-error)' }}
                    >
                        {withdrawMutation.isPending ? '처리 중...' : '탈퇴하기'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
