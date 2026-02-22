import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './ResponsiveOverlay.module.css';

interface ResponsiveOverlayProps {
  /* 공통 설명 */
  trigger: React.ReactNode;
  /* 공통 설명 */
  children: React.ReactNode;
  /* 공통 설명 */
  title?: string;
  /* 공통 설명 */
  open?: boolean;
  /* 공통 설명 */
  onOpenChange?: (open: boolean) => void;
  /* 공통 설명 */
  desktopContentClassName?: string;
  /* 공통 설명 */
  mobileContentClassName?: string;
  /* 공통 설명 */
  align?: 'start' | 'center' | 'end';
  /* 공통 설명 */
  mobilePresentation?: 'modal' | 'sheet';
  /* 공통 설명 */
  headerMode?: 'auto' | 'always' | 'none';
  /* 공통 설명 */
  headerAction?: React.ReactNode;
  /* 공통 설명 */
  showCloseButton?: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ResponsiveOverlay({
  trigger,
  children,
  title = '메뉴',
  open,
  onOpenChange,
  desktopContentClassName,
  mobileContentClassName,
  align = 'end',
  mobilePresentation = 'modal',
  headerMode = 'auto',
  headerAction,
  showCloseButton,
}: ResponsiveOverlayProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const shouldRenderHeader = headerMode === 'always' || (headerMode === 'auto' && isMobile);
  const shouldShowCloseButton = showCloseButton ?? isMobile;
  const isSheet = isMobile && mobilePresentation === 'sheet';

  if (isMobile) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={clsx(isSheet ? styles.sheetContent : styles.modalContent, mobileContentClassName)}>
            {shouldRenderHeader ? (
              <div className={isSheet ? styles.sheetHeader : styles.modalHeader}>
                <Dialog.Title className={styles.modalTitle}>{title}</Dialog.Title>
                <div className={styles.headerActionArea}>
                  {headerAction}
                  {shouldShowCloseButton ? (
                    <Dialog.Close aria-label="닫기" className={styles.closeButton}>
                      <X size={22} />
                    </Dialog.Close>
                  ) : null}
                </div>
              </div>
            ) : (
              <Dialog.Title className={styles.visuallyHidden}>{title}</Dialog.Title>
            )}
            <div className={isSheet ? styles.sheetBody : styles.modalBody}>
              {children}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          className={clsx(styles.dropdownContent, desktopContentClassName)}
          sideOffset={5}
        >
          {shouldRenderHeader ? (
            <div className={styles.dropdownHeader}>
              <span className={styles.modalTitle}>{title}</span>
              <div className={styles.headerActionArea}>
                {headerAction}
                {shouldShowCloseButton ? (
                  <button
                    aria-label="닫기"
                    className={styles.closeButton}
                    onClick={() => onOpenChange?.(false)}
                    type="button"
                  >
                    <X size={20} />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className={shouldRenderHeader ? styles.dropdownBody : undefined}>
            {children}
          </div>
          <DropdownMenu.Arrow className={styles.arrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
