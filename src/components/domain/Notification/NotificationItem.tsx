import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, CreditCard, Info, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/types/notification';
import { isSafeInternalPath } from '@/lib/utils/authNavigation';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

/**
 * 알림 목록 단일 아이템입니다.
 * 링크가 내부 경로면 SPA 라우팅으로, 외부 경로면 location.assign으로 이동합니다.
 */
export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick?.();
    const linkUrl = notification.data?.linkUrl;
    if (linkUrl && typeof linkUrl === 'string') {
      if (isSafeInternalPath(linkUrl)) {
        navigate(linkUrl);
      } else {
        window.location.assign(linkUrl);
      }
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
    <div
      className={clsx(styles.item, { [styles.unread]: !notification.isRead })}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
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
