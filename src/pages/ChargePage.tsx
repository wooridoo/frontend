import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Button } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import styles from './ChargePage.module.css';

const PRESET_AMOUNTS = [5000, 10000, 30000, 50000, 100000];

export function ChargePage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setAmount(Number(value));
  };

  const handlePresetClick = (value: number) => {
    setAmount(value);
  };

  const handleCharge = async () => {
    if (amount < 1000) {
      alert('최소 충전 금액은 1,000원입니다.');
      return;
    }

    if (confirm(`${amount.toLocaleString()}원을 충전하시겠습니까?`)) {
      setIsSubmitting(true);
      try {
        // Mock Payment API
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert('충전이 완료되었습니다.');
        navigate(PATHS.WALLET.ROOT);
      } catch (error) {
        console.error(error);
        alert('충전 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Brix 충전" showBack />

      <div className={styles.titleSection}>
        <p className={styles.currentBalance}>현재 잔액</p>
        <p className={styles.balanceValue}>12,500 Brix</p>
      </div>

      <div className={styles.amountGrid}>
        {PRESET_AMOUNTS.map((value) => (
          <button
            key={value}
            className={`${styles.amountButton} ${amount === value ? styles.selected : ''}`}
            onClick={() => handlePresetClick(value)}
          >
            {value.toLocaleString()}
          </button>
        ))}
        <button
          className={`${styles.amountButton} ${!PRESET_AMOUNTS.includes(amount) && amount > 0 ? styles.selected : ''}`}
          onClick={() => setAmount(0)}
        >
          직접 입력
        </button>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>충전 금액</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            value={amount > 0 ? amount.toLocaleString() : ''}
            onChange={handleAmountChange}
            placeholder="0"
          />
          <span className={styles.unit}>원</span>
        </div>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span>충전 금액</span>
          <span>{amount.toLocaleString()}원</span>
        </div>
        <div className={styles.infoRow}>
          <span>수수료 (0%)</span>
          <span>0원</span>
        </div>
        <div className={`${styles.infoRow} ${styles.totalRow}`}>
          <span>결제 금액</span>
          <span>{amount.toLocaleString()}원</span>
        </div>
      </div>

      <div className={styles.bottomAction}>
        <Button
          className={styles.submitButton}
          size="lg"
          onClick={handleCharge}
          disabled={amount < 1000}
          isLoading={isSubmitting}
        >
          {amount > 0 ? `${amount.toLocaleString()}원 결제하기` : '금액을 선택해주세요'}
        </Button>
      </div>
    </PageContainer>
  );
}
