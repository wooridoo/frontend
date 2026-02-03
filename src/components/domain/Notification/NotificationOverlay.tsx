import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { Bell, BellOff, X } from 'lucide-react';
import { useNotifications, useMarkAsRead } from '@/lib/api/notification';
import { NotificationItem } from './NotificationItem';
import styles from './NotificationOverlay.module.css';

interface NotificationOverlayProps {
  children?: React.ReactNode;
}

export function NotificationOverlay({ children }: NotificationOverlayProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.content || [];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleItemClick = (id: number) => {
    markAsRead(id);
  };

  const Content = () => (
    <>
      <div className={styles.header}>
        <span className={styles.title}>알림</span>
        <button className={styles.markReadBtn}>모두 읽음</button>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.emptyState}>로딩 중...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notificationId}
              notification={notification}
              onClick={() => handleItemClick(notification.notificationId)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <BellOff size={32} />
            <p>새로운 알림이 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );

  const Trigger = children || (
    <button className={styles.trigger} aria-label="알림">
      <Bell size={20} />
      {unreadCount > 0 && <span className={styles.badge} />}
    </button>
  );

  if (isMobile) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          {Trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <Dialog.Title className={styles.modalTitle}>알림</Dialog.Title>
              <Dialog.Close className={styles.closeButton}>
                <X size={24} />
              </Dialog.Close>
            </div>
            <div className={styles.list}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.notificationId}
                    notification={notification}
                    onClick={() => handleItemClick(notification.notificationId)}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <BellOff size={32} />
                  <p>새로운 알림이 없습니다.</p>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        {Trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} sideOffset={5} align="end">
          <Content />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
