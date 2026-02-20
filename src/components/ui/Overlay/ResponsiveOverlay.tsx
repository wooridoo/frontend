import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './ResponsiveOverlay.module.css';

interface ResponsiveOverlayProps {
    /** Trigger element (e.g., Button, Avatar) */
    trigger: React.ReactNode;
    /** Content to display inside the overlay */
    children: React.ReactNode;
    /** Dialog title for mobile view */
    title?: string;
    /** Controlled open state */
    open?: boolean;
    /** Controlled open change handler */
    onOpenChange?: (open: boolean) => void;
    /** Additional class name for desktop dropdown content */
    desktopContentClassName?: string;
    /** Additional class name for mobile modal content */
    mobileContentClassName?: string;
    /** Alignment for desktop dropdown */
    align?: 'start' | 'center' | 'end';
}

export function ResponsiveOverlay({
    trigger,
    children,
    title = '메뉴',
    open,
    onOpenChange,
    desktopContentClassName,
    mobileContentClassName,
    align = 'end',
}: ResponsiveOverlayProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) {
        return (
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Trigger asChild>
                    {trigger}
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.overlay} />
                    <Dialog.Content className={clsx(styles.modalContent, mobileContentClassName)}>
                        <div className={styles.modalHeader}>
                            <Dialog.Title className={styles.modalTitle}>{title}</Dialog.Title>
                            <Dialog.Close className={styles.closeButton}>
                                <X size={24} />
                            </Dialog.Close>
                        </div>
                        {children}
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
                    className={clsx(styles.dropdownContent, desktopContentClassName)}
                    sideOffset={5}
                    align={align}
                >
                    {children}
                    <DropdownMenu.Arrow className={styles.arrow} />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
