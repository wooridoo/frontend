import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, CreditCard, Info, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import type { Notification } from '@/types/notification';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const handleClick = () => {
    onClick?.();
    const linkUrl = notification.data?.linkUrl;
    if (linkUrl && typeof linkUrl === 'string') {
      window.location.href = linkUrl;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'CHALLENGE':
        return <Calendar size={18} />;
      case 'PAYMENT':
        return <CreditCard size={18} />;
      case 'SOCIAL':
        return <MessageCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div className={clsx(styles.item, { [styles.unread]: !notification.isRead })} onClick={handleClick}>
      {!notification.isRead ? <span className={styles.dot} /> : null}
      <div className={styles.header}>
        <div className={styles.iconWrapper}>{getIcon()}</div>
        <div className={styles.content}>
          <span className={styles.title}>{notification.title}</span>
          <p className={styles.message}>{notification.message}</p>
          <span className={styles.time}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}
