export type NotificationType = 'CHALLENGE' | 'PAYMENT' | 'SOCIAL' | 'SYSTEM';

export interface NotificationQuery {
  page?: number;
  size?: number;
  type?: NotificationType | 'ALL';
  isRead?: boolean;
}

export interface NotificationData {
  subType?: string;
  targetId?: string;
  amount?: number;
  linkUrl?: string;
}

export interface Notification {
  notificationId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data: NotificationData;
  createdAt: string;
  readAt?: string;
}

export interface NotificationListResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  unreadCount: number;
}

export interface NotificationMarkReadResponse {
  notificationId: string;
  isRead: boolean;
  readAt?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  voteNotification: boolean;
  meetingNotification: boolean;
  expenseNotification: boolean;
  snsNotification: boolean;
  systemNotification: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
