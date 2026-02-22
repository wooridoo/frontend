import { Button } from '@/components/ui/Button';
import { Modal } from './Modal';
import { useConfirmDialogStore } from '@/store/modal/useConfirmDialogStore';
import { useShallow } from 'zustand/react/shallow';
import styles from './ConfirmDialog.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ConfirmDialog() {
  const { isOpen, title, description, confirmText, cancelText, variant, close, resolve } =
    useConfirmDialogStore(
      useShallow(state => ({
        isOpen: state.isOpen,
        title: state.title,
        description: state.description,
        confirmText: state.confirmText,
        cancelText: state.cancelText,
        variant: state.variant,
        close: state.close,
        resolve: state.resolve,
      }))
    );

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
        <div className={styles.actions}>
          <Button onClick={() => resolve(false)} variant="secondary">
            {cancelText || '취소'}
          </Button>
          <Button onClick={() => resolve(true)} variant={variant === 'danger' ? 'danger' : 'primary'}>
            {confirmText || '확인'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
