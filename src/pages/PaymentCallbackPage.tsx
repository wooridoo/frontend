import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { Button } from '@/components/ui';
import { useChargeCallback } from '@/hooks/useAccount';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import styles from './PaymentCallbackPage.module.css';

type CallbackStatus = 'processing' | 'success' | 'failed';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chargeCallbackMutation = useChargeCallback();
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [chargedAmount, setChargedAmount] = useState(0);

  const orderId = searchParams.get('orderId');
  const paymentKey = searchParams.get('paymentKey');
  const amount = Number(searchParams.get('amount') || 0);

  useEffect(() => {
    if (!orderId || !paymentKey || !amount) {
      setStatus('failed');
      return;
    }

    chargeCallbackMutation.mutate(
      { orderId, paymentKey, amount, status: 'SUCCESS' },
      {
        onSuccess: (data) => {
          setChargedAmount(data.amount);
          setStatus('success');
          // 충전 후 유저 프로필 갱신 (상단 네비 보유금 반영)
          refreshUser();
        },
        onError: () => {
          setStatus('failed');
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, paymentKey, amount]);

  return (
    <PageContainer variant="content" contentWidth="sm">
      <PageHeader title="결제 결과" showBack={false} />

      <div className={styles.content}>
        {status === 'processing' && (
          <div className={styles.statusCard}>
            <div className={styles.spinner} />
            <h2 className={styles.statusTitle}>결제 처리 중...</h2>
            <p className={styles.statusDesc}>
              잠시만 기다려주세요. 결제를 확인하고 있습니다.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.statusCard}>
            <div className={styles.successIcon}>✅</div>
            <h2 className={styles.statusTitle}>충전 완료!</h2>
            <p className={styles.chargedAmount}>
              {formatCurrency(chargedAmount)}
            </p>
            <p className={styles.statusDesc}>
              크레딧이 정상적으로 충전되었습니다.
            </p>
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => navigate(PATHS.MY.LEDGER)}
              >
                지갑으로 이동
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(PATHS.HOME)}
              >
                홈으로
              </Button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className={styles.statusCard}>
            <div className={styles.failedIcon}>❌</div>
            <h2 className={styles.statusTitle}>충전 실패</h2>
            <p className={styles.statusDesc}>
              결제 처리 중 문제가 발생했습니다.
              <br />
              다시 시도하거나 고객센터에 문의해주세요.
            </p>
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => navigate(PATHS.MY.LEDGER)}
              >
                지갑으로 돌아가기
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
