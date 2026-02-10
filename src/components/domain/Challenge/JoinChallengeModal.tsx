import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useJoinModalStore } from '@/store/useJoinModalStore';
import { joinChallenge } from '@/lib/api/challenge';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui'; // Correct import from index
import { toast } from 'sonner';
import styles from './JoinChallengeModal.module.css';

export function JoinChallengeModal() {
  const navigate = useNavigate();
  const { isOpen, challengeId, onClose } = useJoinModalStore();
  const { syncParticipatingChallenges } = useAuthStore();

  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded deposit amount as per requirement or fetch from challenge detail?
  const depositAmount = 10000;

  const handleJoin = async () => {
    if (!challengeId) return;

    setIsSubmitting(true);
    try {
      await joinChallenge(challengeId, depositAmount);
      await syncParticipatingChallenges(); // Update user's participation list
      setStep('success');
    } catch (error) {
      console.error(error);
      toast.error('챌린지 참여에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const handleGoToChallenge = () => {
    handleClose();
    if (challengeId) {
      navigate(`/challenge/${challengeId}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {step === 'confirm' ? '챌린지 참여하기' : '참여 완료!'}
        </h2>

        {step === 'confirm' ? (
          <div className={styles.stepContent}>
            <p className={styles.description}>
              이 챌린지에 참여하시겠습니까?<br />
              참여 보증금이 차감됩니다.
            </p>

            <div className={styles.balanceInfo}>
              <span>참여 보증금</span>
              <span className={styles.balance}>{depositAmount.toLocaleString()}원</span>
            </div>

            <div className={styles.actions}>
              <Button
                className={styles.payButton}
                onClick={handleJoin}
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '보증금 결제하고 참여하기'}
              </Button>
              <Button
                variant="ghost"
                className={styles.closeButton}
                onClick={handleClose}
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>🎉</div>
            <p className={styles.successMessage}>
              챌린지 참여가 완료되었습니다!
            </p>
            <Button
              className={styles.nextButton}
              onClick={handleGoToChallenge}
            >
              챌린지 보러가기
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
