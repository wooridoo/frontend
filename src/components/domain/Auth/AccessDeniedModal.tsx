import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import styles from './AccessDeniedModal.module.css';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useAccessDeniedModalStore } from '@/store/modal/useModalStore';
import { getChallenge } from '@/lib/api/challenge';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function AccessDeniedModal() {
  const { isOpen, onClose, challengeId } = useAccessDeniedModalStore();
  const navigate = useNavigate();

  const navigateToChallenge = async () => {
    onClose();
    if (!challengeId) {
      navigate(PATHS.HOME);
      return;
    }

    try {
      const challenge = await getChallenge(challengeId);
      navigate(CHALLENGE_ROUTES.detail(challengeId, challenge.title));
    } catch {
      navigate(PATHS.EXPLORE);
    }
  };

  const handleAction = () => {
    void navigateToChallenge();
  };

  const handleClose = () => {
    void navigateToChallenge();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <Lock size={48} className={styles.icon} />
        </div>
        <h2 className={styles.title}>접근 권한이 없습니다</h2>
        <p className={styles.description}>
          이 챌린지는 <strong>참여자만</strong> 볼 수 있어요.<br />
          참여 후 인증에 도전해보세요!
        </p>
        <div className={styles.actions}>
          <Button onClick={handleAction} className={styles.actionButton} size="lg">
            챌린지 구경하러 가기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
