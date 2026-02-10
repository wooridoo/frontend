// Notification Types
export type NotificationType = 'CHALLENGE' | 'PAYMENT' | 'SOCIAL' | 'SYSTEM';
export type NotificationSubType = 'MEETING_VOTE' | 'COMMENT' | 'LIKE';

export interface NotificationData {
    subType?: NotificationSubType;
    targetId?: string; // paymentId, challengeId etc
    amount?: number;
    voteOptions?: string[]; // ['참석', '불참']
}

export interface Notification {
    notificationId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    data: NotificationData;
    createdAt: string; // ISO Date string
}

export interface NotificationResponse {
    content: Notification[];
    totalElements: number;
    totalPages: number;
    unreadCount: number;
}
