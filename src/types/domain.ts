import { UserStatus, Category } from './enums';

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
  // ... other stats
}

export interface User {
  userId: number;
  email: string;
  name: string;
  nickname: string;
  profileImage?: string;
  status: UserStatus;
  brix: number;
  participatingChallengeIds?: number[];
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
  category: Category;
  thumbnailUrl?: string; // Added for UI
  description?: string; // Added for UI
  certificationRate?: number; // Added for UI (0-100)
  currentMembers: number;
  minMembers: number;
  maxMembers: number;
  // Add other fields as needed
}

/**
 * SNS Domain Types
 */
export interface Post {
  id: string; // UUID
  challengeId?: string;
  createdBy: User; // or just userId? Typically expanded in frontend
  title?: string;
  content: string;
  category: import('./enums').PostCategory;
  isNotice: boolean;
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  images?: string[]; // Simplified for now
  createdAt: string;
}

export type BrixGrade = 'HONEY' | 'GRAPE' | 'APPLE' | 'TANGERINE' | 'TOMATO' | 'BITTER';

export interface BrixConfig {
  label: string;
  emoji: string;
  brixVariant: 'honey' | 'grape' | 'apple' | 'mandarin' | 'tomato' | 'bitter';
}

/**
 * Meeting Domain Types
 */
export interface MeetingMember {
  userId: number;
  nickname: string;
  profileImage?: string;
  status: 'ATTENDING' | 'ABSENT' | 'PENDING';
  joinedAt?: string;
}

export interface Meeting {
  id: string; // UUID
  challengeId: string;
  title: string;
  description: string;
  date: string; // ISO Date
  location: string;
  locationUrl?: string; // Map link
  isOnline: boolean;
  meetingUrl?: string; // Online meeting link (Added based on API specs commonly having this for online meetings)
  maxMembers: number;
  currentMembers: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  members?: MeetingMember[];
  myStatus?: 'ATTENDING' | 'ABSENT' | 'PENDING' | 'NONE';
}

/**
 * Ledger Domain Types
 */
export type TransactionType = 'SUPPORT' | 'EXPENSE' | 'FEE' | 'DEPOSIT' | 'REFUND';

export interface Transaction {
  transactionId: number;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string; // ISO Date
}

export interface ChallengeAccountStats {
  totalSupport: number;
  totalExpense: number;
  totalFee: number;
  monthlyAverage: {
    support: number;
    expense: number;
  };
}

export interface SupportStatus {
  thisMonth: {
    paid: number;
    unpaid: number;
    total: number;
  };
}

export interface ChallengeAccount {
  challengeId: number;
  balance: number;
  lockedDeposits: number;
  availableBalance: number;
  stats: ChallengeAccountStats;
  recentTransactions: Transaction[];
  supportStatus: SupportStatus;
}

/**
 * Vote Domain Types
 */
export type VoteType = 'EXPENSE' | 'KICK' | 'LEADER_KICK' | 'DISSOLVE';
export type VoteStatus = 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'DISMISSED';
export type VoteOption = 'AGREE' | 'DISAGREE' | 'ABSTAIN';

export interface VoteCount {
  agree: number;
  disagree: number;
  abstain: number;
  notVoted: number;
  total: number;
}

export interface VoteResult {
  passed: boolean;
  agree: number;
  disagree: number;
  abstain: number;
  notVoted: number;
  total: number;
  requiredApproval: number;
  approvalRate: number;
}

export interface Vote {
  voteId: number;
  challengeId: number;
  type: VoteType;
  title: string;
  description?: string;
  status: VoteStatus;
  createdBy: {
    userId: number;
    nickname: string;
    profileImage?: string;
  };
  targetInfo?: {
    targetId: number;
    amount?: number;
    category?: string;
  };
  voteCount: VoteCount;
  myVote?: VoteOption;
  eligibleVoters: number;
  requiredApproval: number; // e.g. 7
  deadline: string; // ISO Date
  createdAt: string; // ISO Date
  result?: VoteResult; // Only when status !== IN_PROGRESS
}
