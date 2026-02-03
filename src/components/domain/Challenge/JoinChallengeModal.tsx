import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useJoinModalStore } from '@/store/useJoinModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/utils';
import styles from './JoinChallengeModal.module.css';
import { PATHS } from '@/routes/paths';

export function JoinChallengeModal() {
  const { isOpen, onClose } = useJoinModalStore();
  const { user, joinChallenge } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleClose = () => {
    setStep('info');
    onClose();
    if (step === 'success') {
      navigate(PATHS.CHALLENGE.FEED(1));
    }
  };

  const handleNext = async () => {
    if (step === 'info') {
      setStep('payment');
    } else if (step === 'payment') {
      setIsLoading(true);
      // Simulate Payment API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update Store: User joined Challenge #1
      joinChallenge(1);

      // Invalidate Query to ensure FeedPage re-fetches with new permissions
      await queryClient.invalidateQueries({ queryKey: ['challenge', '1'] });

      setIsLoading(false);
      setStep('success');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>챌린지 참여하기</h2>

        {step === 'info' && (
          <div className={styles.stepContent}>
            <p className={styles.description}>
              <strong>{user?.name}</strong>님, 챌린지에 참여하시겠습니까?<br />
              보증금 <strong>10,000원</strong>이 차감됩니다.
            </p>
            <div className={styles.balanceInfo}>
              <span>현재 보유 크레딧</span>
              <span className={styles.balance}>{formatCurrency(user?.account?.balance || 0)}</span>
            </div>
            <Button onClick={handleNext} className={styles.nextButton}>다음</Button>
          </div>
        )}

        {step === 'payment' && (
          <div className={styles.stepContent}>
            <p className={styles.description}>
              보증금 결제를 진행합니다.<br />
              성공 시 챌린지가 시작됩니다.
            </p>
            <Button onClick={handleNext} isLoading={isLoading} className={styles.payButton}>
              10,000원 결제하기
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>🎉</div>
            <p className={styles.successMessage}>
              참여가 완료되었습니다!<br />
              내일부터 인증을 시작해보세요.
            </p>
            <Button onClick={handleClose} className={styles.closeButton}>확인</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
