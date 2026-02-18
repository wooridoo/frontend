import { BellOff } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/types/notification';

import styles from './NotificationOverlay.module.css';

interface NotificationListProps {
    notifications: Notification[];
    isLoading: boolean;
    onItemClick: (id: string) => void;
    onMarkAllRead?: () => void;
}

export function NotificationList({ notifications, isLoading, onItemClick, onMarkAllRead }: NotificationListProps) {
    return (
        <>
            <div className={styles.header}>
                <span className={styles.title}>알림</span>
                <button className={styles.markReadBtn} onClick={onMarkAllRead}>모두 읽음</button>
            </div>

            <div className={styles.list}>
                {isLoading ? (
                    <div className={styles.emptyState}>로딩 중...</div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.notificationId}
                            notification={notification}
                            onClick={() => onItemClick(notification.notificationId)}
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
}
