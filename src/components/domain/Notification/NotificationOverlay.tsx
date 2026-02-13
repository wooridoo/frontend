import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications, useMarkAsRead } from '@/lib/api/notification';
import { ResponsiveOverlay } from '@/components/ui/Overlay/ResponsiveOverlay';
import { NotificationList } from './NotificationList';
import styles from './NotificationOverlay.module.css';

interface NotificationOverlayProps {
  children?: React.ReactNode;
}

export function NotificationOverlay({ children }: NotificationOverlayProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.content || [];

  const handleItemClick = (id: string) => {
    markAsRead(id);
  };

  const Trigger = children || (
    <button className={styles.trigger} aria-label="알림">
      <Bell size={20} />
      {unreadCount > 0 && <span className={styles.badge} />}
    </button>
  );

  return (
    <ResponsiveOverlay
      trigger={Trigger}
      open={open}
      onOpenChange={setOpen}
      title="알림"
      desktopContentClassName={styles.notificationWidth}
    >
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onItemClick={handleItemClick}
      />
    </ResponsiveOverlay>
  );
}
