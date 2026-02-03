/**
 * WooriDo Enum Definitions
 * Based on DB_Schema_1.0.0.md
 * Enforced Strict Contract with Backend
 * using 'as const' pattern for better transpilation support
 */

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  WITHDRAWN: 'WITHDRAWN',
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export const SocialProvider = {
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
} as const;
export type SocialProvider = typeof SocialProvider[keyof typeof SocialProvider];

export const Gender = {
  MALE: 'M',
  FEMALE: 'F',
  OTHER: 'O',
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export const Category = {
  HOBBY: 'HOBBY',
  STUDY: 'STUDY',
  EXERCISE: 'EXERCISE',
  SAVINGS: 'SAVINGS',
  TRAVEL: 'TRAVEL',
  FOOD: 'FOOD',
  CULTURE: 'CULTURE',
  OTHER: 'OTHER',
} as const;
export type Category = typeof Category[keyof typeof Category];

export const ChallengeStatus = {
  RECRUITING: 'RECRUITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;
export type ChallengeStatus = typeof ChallengeStatus[keyof typeof ChallengeStatus];

export const ChallengeRole = {
  LEADER: 'LEADER',
  FOLLOWER: 'FOLLOWER',
} as const;
export type ChallengeRole = typeof ChallengeRole[keyof typeof ChallengeRole];

export const MeetingStatus = {
  VOTING: 'VOTING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type MeetingStatus = typeof MeetingStatus[keyof typeof MeetingStatus];

export const VoteStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
} as const;
export type VoteStatus = typeof VoteStatus[keyof typeof VoteStatus];

export const ExpenseStatus = {
  VOTING: 'VOTING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  USED: 'USED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;
export type ExpenseStatus = typeof ExpenseStatus[keyof typeof ExpenseStatus];

export const PostCategory = {
  NOTICE: 'NOTICE',
  GENERAL: 'GENERAL',
  QUESTION: 'QUESTION',
} as const;
export type PostCategory = typeof PostCategory[keyof typeof PostCategory];
