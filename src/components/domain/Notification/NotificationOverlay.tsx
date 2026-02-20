import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/lib/api/notification';
import { capabilities } from '@/lib/api/capabilities';
import { ResponsiveOverlay } from '@/components/ui/Overlay/ResponsiveOverlay';
import { Button, IconButton } from '@/components/ui';
import { NotificationList } from './NotificationList';
import styles from './NotificationOverlay.module.css';

interface NotificationOverlayProps {
  children?: React.ReactNode;
}

export function NotificationOverlay({ children }: NotificationOverlayProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.content || [];

  const handleItemClick = (id: string) => {
    markAsRead(id);
  };

  const Trigger = children || (
    <IconButton aria-label="알림" className={styles.trigger} icon={<Bell size={20} />} size="md" variant="ghost">
      {unreadCount > 0 && <span className={styles.badge} />}
    </IconButton>
  );

  const headerAction = capabilities.notificationReadAll ? (
    <Button
      className={styles.markReadBtn}
      disabled={unreadCount === 0}
      onClick={() => markAllAsRead()}
      size="xs"
      variant="text"
    >
      모두 읽음
    </Button>
  ) : undefined;

  return (
    <ResponsiveOverlay
      desktopContentClassName={styles.notificationPanel}
      headerAction={headerAction}
      headerMode="always"
      mobileContentClassName={styles.notificationModal}
      mobilePresentation="modal"
      onOpenChange={setOpen}
      open={open}
      title="알림"
      trigger={Trigger}
    >
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onItemClick={handleItemClick}
      />
    </ResponsiveOverlay>
  );
}
