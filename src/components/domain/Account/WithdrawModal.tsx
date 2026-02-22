import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useWithdrawModalStore } from '@/store/modal/useModalStore';
import { useMyAccount, useRequestWithdraw } from '@/hooks/useAccount';
import { formatCurrency } from '@/lib/utils';
import styles from './ChargeWithdrawModal.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function WithdrawModal() {
    const { isOpen, onClose } = useWithdrawModalStore();
    const { data: account } = useMyAccount();
    const [amount, setAmount] = useState<number>(0);
    const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');

    const withdrawMutation = useRequestWithdraw();

    // 보조 처리
    const availableBalance = account?.availableBalance || 0;

    const handleClose = () => {
        setStep('form');
        setAmount(0);
        onClose();
    };

    const handleNext = () => {
        if (amount > 0 && amount <= availableBalance) {
            setStep('confirm');
        }
    };

    const handleWithdraw = async () => {
        try {
            await withdrawMutation.mutateAsync({ amount });
            setStep('success');
        } catch {
            // 보조 처리
        }
    };

    const handleMaxAmount = () => {
        setAmount(availableBalance);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>출금 신청</h2>

                {step === 'form' && (
                    <>
                        <div className={styles.bankInfo}>
                            <div className={styles.bankRow}>
                                <span className={styles.bankLabel}>출금 가능 금액</span>
                                <span className={styles.bankValue}>{formatCurrency(availableBalance)}</span>
                            </div>
                        </div>

                        <div className={styles.amountSection}>
                            <label className={styles.label}>출금 금액</label>
                            <div className={styles.amountRow}>
                                <input
                                    type="number"
                                    value={amount || ''}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className={styles.customInput}
                                    placeholder="출금할 금액 입력"
                                    max={availableBalance}
                                    min={0}
                                />
                                <Button onClick={handleMaxAmount} className={styles.cancelButton}>
                                    전액
                                </Button>
                            </div>
                        </div>

                        {amount > availableBalance && (
                            <div className={styles.warning}>
                                ⚠️ 출금 가능 금액을 초과했습니다
                            </div>
                        )}

                        <div className={styles.actions}>
                            <Button onClick={handleClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button
                                onClick={handleNext}
                                className={styles.submitButton}
                                disabled={amount <= 0 || amount > availableBalance}
                            >
                                다음
                            </Button>
                        </div>
                    </>
                )}

                {step === 'confirm' && (
                    <>
                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>출금 금액</span>
                                <span className={`${styles.summaryValue} ${styles.total}`}>
                                    {formatCurrency(amount)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.warning}>
                            ⚠️ 출금은 영업일 기준 1-2일 이내에 처리됩니다
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={() => setStep('form')} className={styles.cancelButton}>
                                수정
                            </Button>
                            <Button
                                onClick={handleWithdraw}
                                className={styles.submitButton}
                                disabled={withdrawMutation.isPending}
                            >
                                {withdrawMutation.isPending ? '처리 중...' : '출금 신청'}
                            </Button>
                        </div>
                    </>
                )}

                {step === 'success' && (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>✅</div>
                        <p className={styles.successMessage}>출금 신청이 완료되었습니다!</p>
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
