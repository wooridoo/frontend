import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCreditChargeModalStore } from '@/store/useCreditChargeModalStore';
import { useRequestCreditCharge } from '@/hooks/useAccount';
import { formatCurrency } from '@/lib/utils';
import styles from './ChargeWithdrawModal.module.css';

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000, 200000, 500000];

export function CreditChargeModal() {
    const { isOpen, onClose } = useCreditChargeModalStore();
    const [amount, setAmount] = useState<number>(50000);
    const [step, setStep] = useState<'select' | 'success'>('select');

    const chargeMutation = useRequestCreditCharge();

    const handleClose = () => {
        setStep('select');
        setAmount(50000);
        onClose();
    };

    const handleAmountSelect = (value: number) => {
        setAmount(value);
    };

    const handleCharge = async () => {
        try {
            await chargeMutation.mutateAsync({ amount, method: 'CARD' });
            setStep('success');
        } catch {
            // Error handled by mutation
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>크레딧 충전</h2>

                {step === 'select' && (
                    <>
                        <div className={styles.amountSection}>
                            <label className={styles.label}>충전 금액 선택</label>
                            <div className={styles.amountGrid}>
                                {PRESET_AMOUNTS.map((preset) => (
                                    <button
                                        key={preset}
                                        className={`${styles.amountButton} ${amount === preset ? styles.selected : ''}`}
                                        onClick={() => handleAmountSelect(preset)}
                                    >
                                        {(preset / 10000).toLocaleString()}만원
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className={styles.customInput}
                                placeholder="직접 입력"
                                min={10000}
                                step={1000}
                            />
                        </div>

                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>충전 금액</span>
                                <span className={styles.summaryValue}>{formatCurrency(amount)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>결제 금액</span>
                                <span className={`${styles.summaryValue} ${styles.total}`}>
                                    {formatCurrency(amount)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button
                                onClick={handleCharge}
                                className={styles.submitButton}
                                disabled={amount < 10000 || chargeMutation.isPending}
                            >
                                {chargeMutation.isPending ? '처리 중...' : '충전하기'}
                            </Button>
                        </div>
                    </>
                )}

                {step === 'success' && (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>✅</div>
                        <p className={styles.successMessage}>충전이 완료되었습니다!</p>
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
