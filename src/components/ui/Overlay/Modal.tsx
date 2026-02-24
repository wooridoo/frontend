import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '../IconButton';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // ?? ??
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogPortal>
        <DialogOverlay className={styles.overlay} />
        <DialogContent
          className={cn(
            styles.content,
            className
          )}
        >
          <DialogTitle className={styles.visuallyHidden}>대화상자</DialogTitle>
          <DialogDescription className={styles.visuallyHidden}>대화상자 내용</DialogDescription>
          {children}
          <IconButton
            aria-label="닫기"
            className={styles.closeButton}
            icon={<X size={16} />}
            onClick={onClose}
            size="sm"
            variant="ghost"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
