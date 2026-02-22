import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '../IconButton';

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
        <DialogOverlay className="fixed inset-0 z-[1300] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent
          className={cn(
            "fixed left-[50%] top-[50%] z-[1300] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/20 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
            className
          )}
        >
          <DialogTitle className="sr-only">대화상자</DialogTitle>
          <DialogDescription className="sr-only">대화상자 내용</DialogDescription>
          {children}
          <IconButton
            aria-label="닫기"
            className="absolute right-4 top-4"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            size="sm"
            variant="ghost"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
