import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useSupportPaymentModalStore } from '@/store/useSupportPaymentModalStore';
import { useMyAccount, useSupportPayment } from '@/hooks/useAccount';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import styles from '../Account/ChargeWithdrawModal.module.css';

export function SupportPaymentModal() {
    const { isOpen, challengeId, amount, onClose } = useSupportPaymentModalStore();
    const { data: account } = useMyAccount();
    const supportMutation = useSupportPayment();
    const [step, setStep] = useState<'confirm' | 'success'>('confirm');

    const availableBalance = account?.availableBalance || 0;
    const hasEnoughBalance = availableBalance >= amount;

    const handleClose = () => {
        setStep('confirm');
        supportMutation.reset();
        onClose();
    };

    const handlePayment = async () => {
        if (!challengeId) return;

        try {
            await supportMutation.mutateAsync({
                challengeId,
                amount,
            });
            setStep('success');
            toast.success('서포트 결제가 완료되었습니다!');
        } catch {
            toast.error('서포트 결제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>서포트 결제</h2>

                {step === 'confirm' && (
                    <>
                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>서포트 금액</span>
                                <span className={`${styles.summaryValue} ${styles.total}`}>
                                    {formatCurrency(amount)}
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>현재 잔액</span>
                                <span className={styles.summaryValue}>
                                    {formatCurrency(availableBalance)}
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>결제 후 잔액</span>
                                <span className={styles.summaryValue}>
                                    {formatCurrency(Math.max(0, availableBalance - amount))}
                                </span>
                            </div>
                        </div>

                        {!hasEnoughBalance && (
                            <div className={styles.warning}>
                                ⚠️ 잔액이 부족합니다. 충전 후 다시 시도해주세요.
                            </div>
                        )}

                        <div className={styles.actions}>
                            <Button onClick={handleClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button
                                onClick={handlePayment}
                                className={styles.submitButton}
                                disabled={!hasEnoughBalance || supportMutation.isPending}
                            >
                                {supportMutation.isPending ? '결제 중...' : '결제하기'}
                            </Button>
                        </div>
                    </>
                )}

                {step === 'success' && (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>✅</div>
                        <p className={styles.successMessage}>서포트 결제 완료!</p>
                        <p className={styles.successAmount}>{formatCurrency(amount)}</p>
                        <Button onClick={handleClose} className={styles.submitButton}>
                            확인
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
