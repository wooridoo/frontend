import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { Lock } from 'lucide-react';
import styles from './AccessDeniedModal.module.css';

interface AccessDeniedModalStore {
  isOpen: boolean;
  challengeId: string | null;
  onOpen: (challengeId: string) => void;
  onClose: () => void;
}

export const useAccessDeniedModalStore = create<AccessDeniedModalStore>((set) => ({
  isOpen: false,
  challengeId: null,
  onOpen: (challengeId) => set({ isOpen: true, challengeId }),
  onClose: () => set({ isOpen: false, challengeId: null }),
}));

export function AccessDeniedModal() {
  const { isOpen, onClose, challengeId } = useAccessDeniedModalStore();
  const navigate = useNavigate();

  const handleAction = () => {
    onClose();
    if (challengeId) {
      navigate(`/challenge/${challengeId}`);
    } else {
      navigate('/');
    }
  };

  const handleClose = () => {
    onClose();
    // Optional: Redirect to home if they close the modal without action?
    // For now, let's keep them on the current page (which is likely empty/broken) 
    // OR strictly redirect to intro as well.
    // Let's redirect to intro to be safe.
    if (challengeId) {
      navigate(`/challenge/${challengeId}`);
    } else {
      navigate('/');
    }
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
