/**
 * User Domain Types
 * Based on API_SPECIFICATION_1.0.0.md and DB_Schema_1.0.0.md
 */

export interface Account {
  accountId: number;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
}

export interface UserStats {
  challengeCount: number;
  completedChallenges: number;
  totalSupportAmount: number;
}

export interface User {
  userId: number;
  email: string;
  name: string; // Added missing name field
  nickname: string;
  profileImage?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
  brix: number;
  account?: Account;
  stats?: UserStats;
}

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
  notificationId: number;
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


/**
 * Challenge Domain Types
 */
export interface Challenge {
  id: string; // UUID
  name: string;
  category: string;
  currentMembers: number;
  minMembers: number;
  maxMembers: number;
  // Add other fields as needed
}

/**
 * Brix System Types
 */
export type BrixGrade = 'HONEY' | 'GRAPE' | 'APPLE' | 'TANGERINE' | 'TOMATO' | 'BITTER';

export interface BrixConfig {
  label: string;
  emoji: string;
  brixVariant: 'honey' | 'grape' | 'apple' | 'mandarin' | 'tomato' | 'bitter';
}
