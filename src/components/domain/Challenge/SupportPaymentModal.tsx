import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useSupportPaymentModalStore } from '@/store/useSupportPaymentModalStore';
import { useMyAccount } from '@/hooks/useAccount';
import { formatCurrency } from '@/lib/utils';
import styles from '../Account/ChargeWithdrawModal.module.css';

export function SupportPaymentModal() {
    const { isOpen, amount, onClose } = useSupportPaymentModalStore();
    const { data: account } = useMyAccount();
    const [step, setStep] = useState<'confirm' | 'success'>('confirm');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const accountData = account && typeof account === 'object' && 'data' in account ? account.data : account;
    const availableBalance = accountData?.availableBalance || 0;
    const hasEnoughBalance = availableBalance >= amount;

    const handleClose = () => {
        setStep('confirm');
        onClose();
    };

    const handlePayment = async () => {
        setIsSubmitting(true);
        // API call would go here
        await new Promise(r => setTimeout(r, 1000));
        setIsSubmitting(false);
        setStep('success');
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
                                disabled={!hasEnoughBalance || isSubmitting}
                            >
                                {isSubmitting ? '결제 중...' : '결제하기'}
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
