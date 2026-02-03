import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, CreditCard, MessageCircle, Info } from 'lucide-react';
import clsx from 'clsx';
import type { Notification } from '@/types/domain';
import { useVoteMeeting, useApprovePayment } from '@/lib/api/notification';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { mutate: voteMeeting } = useVoteMeeting();
  const { mutate: approvePayment } = useApprovePayment();

  const handleVote = (vote: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.data.targetId) {
      voteMeeting({ meetingId: notification.data.targetId, vote });
    }
  };

  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.data.targetId) {
      approvePayment(notification.data.targetId);
    }
  };

  // Icon Logic
  const getIcon = () => {
    switch (notification.type) {
      case 'CHALLENGE': return <Calendar size={18} />;
      case 'PAYMENT': return <CreditCard size={18} />;
      case 'SOCIAL': return <MessageCircle size={18} />;
      default: return <Info size={18} />;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div
      className={clsx(styles.item, { [styles.unread]: !notification.isRead })}
      onClick={onClick}
    >
      {!notification.isRead && <span className={styles.dot} />}

      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {getIcon()}
        </div>
        <div className={styles.content}>
          <span className={styles.title}>{notification.title}</span>
          <p className={styles.message}>{notification.message}</p>
          <span className={styles.time}>{timeAgo}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {notification.data.subType === 'MEETING_VOTE' && (
        <div className={styles.actions}>
          <button
            className={clsx(styles.actionBtn, styles.primary)}
            onClick={(e) => handleVote('ATTEND', e)}
          >
            참석
          </button>
          <button
            className={styles.actionBtn}
            onClick={(e) => handleVote('ABSENT', e)}
          >
            불참
          </button>
        </div>
      )}

      {notification.type === 'PAYMENT' && notification.data.amount && (
        <div className={styles.actions}>
          <button
            className={clsx(styles.actionBtn, styles.primary)}
            onClick={handlePayment}
          >
            {notification.data.amount.toLocaleString()}원 결제 승인
          </button>
        </div>
      )}
    </div>
  );
}
