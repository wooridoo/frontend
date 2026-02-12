import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Button } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/store/useAuthStore';
import { requestWithdraw } from '@/lib/api/account';
import styles from './WithdrawPage.module.css';

export function WithdrawPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic schema based on user balance
  const withdrawSchema = z.object({
    bank: z.string().min(1, '은행을 선택해주세요'),
    accountNumber: z.string().min(10, '계좌번호를 입력해주세요').regex(/^\d+$/, '숫자만 입력해주세요'),
    amount: z.number()
      .min(1000, '최소 1,000원부터 출금 가능합니다')
      .max(user?.account?.availableBalance || 0, '출금 가능 금액을 초과했습니다'),
    password: z.string().min(4, '비밀번호를 입력해주세요'),
  });

  type WithdrawFormValues = z.infer<typeof withdrawSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: WithdrawFormValues) => {
    if (confirm(`${data.amount.toLocaleString()}원을 출금하시겠습니까?`)) {
      setIsSubmitting(true);
      try {
        await requestWithdraw({
          amount: data.amount,
          bankCode: data.bank,
          accountNumber: data.accountNumber,
        });
        alert('출금 신청이 완료되었습니다.');
        // Refresh user data
        await refreshUser();
        navigate(PATHS.WALLET.ROOT);
      } catch (error) {
        console.error(error);
        alert('출금 신청 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleMaxAmount = () => {
    if (user?.account?.availableBalance) {
      setValue('amount', user.account.availableBalance, { shouldValidate: true });
    }
  };

  return (
    <PageContainer>
      <PageHeader title="출금하기" showBack />

      <div className={styles.balanceSection}>
        <p className={styles.balanceLabel}>출금 가능 금액</p>
        <p className={styles.balanceValue}>
          {user?.account?.availableBalance?.toLocaleString() || 0}
          <span className={styles.currency}>Brix</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>입금 은행</label>
          <select className={styles.select} {...register('bank')}>
            <option value="">은행 선택</option>
            <option value="woori">우리은행</option>
            <option value="kb">국민은행</option>
            <option value="shinhan">신한은행</option>
            <option value="hana">하나은행</option>
            <option value="kakao">카카오뱅크</option>
            <option value="toss">토스뱅크</option>
          </select>
          {errors.bank && <p className={styles.error}>{errors.bank.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>계좌번호</label>
          <input
            className={styles.input}
            placeholder="- 없이 숫자만 입력"
            {...register('accountNumber')}
          />
          {errors.accountNumber && <p className={styles.error}>{errors.accountNumber.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>출금 금액</label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              className={styles.input}
              placeholder="0"
              {...register('amount', { valueAsNumber: true })}
            />
            <button type="button" className={styles.maxButton} onClick={handleMaxAmount}>
              전액
            </button>
          </div>
          {errors.amount && <p className={styles.error}>{errors.amount.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            className={styles.input}
            placeholder="비밀번호 입력"
            {...register('password')}
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <div className={styles.infoBox}>
          • 출금 신청 후 처리까지 영업일 기준 1-2일이 소요될 수 있습니다.<br />
          • 부정확한 계좌 정보로 인한 책임은 본인에게 있습니다.
        </div>

        <div className={styles.bottomAction}>
          <Button
            className={styles.submitButton}
            size="lg"
            type="submit"
            isLoading={isSubmitting}
            disabled={!user || (user?.account?.availableBalance || 0) === 0}
          >
            출금 신청하기
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
