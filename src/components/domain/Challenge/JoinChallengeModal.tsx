import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useJoinModalStore } from '@/store/modal/useModalStore';
import { getChallenge, joinChallenge } from '@/lib/api/challenge';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button, SemanticIcon } from '@/components/ui';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './JoinChallengeModal.module.css';

export function JoinChallengeModal() {
  const navigate = useNavigate();
  const { isOpen, challengeId, onClose } = useJoinModalStore();
  const { syncParticipatingChallenges, updateUser } = useAuthStore();

  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: challenge } = useQuery({
    queryKey: ['challenge', challengeId, 'join-modal'],
    queryFn: () => getChallenge(challengeId || ''),
    enabled: Boolean(challengeId) && isOpen,
  });

  const depositAmount = challenge?.supportAmount ?? 10000;

  const handleJoin = async () => {
    if (!challengeId) return;

    setIsSubmitting(true);
    try {
      const { getMyProfile } = await import('@/lib/api/user');
      await joinChallenge(challengeId, depositAmount);

      const freshUser = await getMyProfile();
      updateUser(freshUser);
      await syncParticipatingChallenges();
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
    if (!challengeId) return;
    navigate(CHALLENGE_ROUTES.detail(challengeId, challenge?.title));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{step === 'confirm' ? '챌린지 참여하기' : '참여 완료!'}</h2>

        {step === 'confirm' ? (
          <div className={styles.stepContent}>
            <p className={styles.description}>
              이 챌린지에 참여하시겠습니까?
              <br />
              참여 보증금이 차감됩니다.
            </p>

            <div className={styles.balanceInfo}>
              <span>참여 보증금</span>
              <span className={styles.balance}>{depositAmount.toLocaleString()}원</span>
            </div>

            <div className={styles.actions}>
              <Button className={styles.payButton} disabled={isSubmitting} onClick={handleJoin}>
                {isSubmitting ? '처리 중...' : '보증금 결제하고 참여하기'}
              </Button>
              <Button className={styles.closeButton} onClick={handleClose} variant="ghost">
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>
              <SemanticIcon name="success" size={48} />
            </div>
            <p className={styles.successMessage}>챌린지 참여가 완료되었습니다.</p>
            <Button className={styles.nextButton} onClick={handleGoToChallenge}>
              챌린지 보러가기
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
