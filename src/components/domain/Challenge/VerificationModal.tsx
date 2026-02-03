import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useVerificationModalStore } from '@/store/useVerificationModalStore';
import styles from './VerificationModal.module.css';
import { Upload, CheckCircle } from 'lucide-react';

export function VerificationModal() {
  const { isOpen, onClose } = useVerificationModalStore();
  const [step, setStep] = useState<'upload' | 'success'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    // Simulate API Upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('success');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <h2 className={styles.title}>인증하기</h2>

      {step === 'upload' && (
        <div className={styles.stepContent}>
          <p className={styles.description}>
            오늘의 챌린지 활동을<br />사진으로 인증해주세요!
          </p>

          <label className={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className={styles.previewImage}
              />
            ) : (
              <>
                <Upload className={styles.uploadIcon} color="var(--color-grey-400)" />
                <span className={styles.uploadText}>사진 업로드 터치</span>
              </>
            )}
          </label>

          <Button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            isLoading={isLoading}
            className={styles.submitButton}
          >
            인증 제출하기
          </Button>
        </div>
      )}

      {step === 'success' && (
        <div className={styles.stepContent}>
          <div className={styles.successIcon}>
            <CheckCircle size={48} color="var(--color-primary)" />
          </div>
          <p className={styles.successMessage}>
            인증이 완료되었습니다!<br />
            10 Brix를 획득했어요.
          </p>
          <Button onClick={handleClose} className={styles.submitButton}>
            확인
          </Button>
        </div>
      )}
    </Modal>
  );
}
