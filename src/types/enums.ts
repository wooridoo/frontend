/**
 * 도메인 전역 enum 상수 모음입니다.
 * API 직렬화 값과 동일한 문자열 리터럴을 유지합니다.
 */

/**
 * 사용자 계정 상태입니다.
 */
export const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  WITHDRAWN: 'WITHDRAWN',
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

/**
 * 소셜 로그인 제공자입니다.
 */
export const SocialProvider = {
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
} as const;
export type SocialProvider = typeof SocialProvider[keyof typeof SocialProvider];

/**
 * 사용자 성별 코드입니다.
 */
export const Gender = {
  MALE: 'M',
  FEMALE: 'F',
  OTHER: 'O',
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

/**
 * 챌린지 카테고리 코드입니다.
 */
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

/**
 * 챌린지 진행 상태입니다.
 */
export const ChallengeStatus = {
  RECRUITING: 'RECRUITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;
export type ChallengeStatus = typeof ChallengeStatus[keyof typeof ChallengeStatus];

/**
 * 챌린지 내 사용자 역할입니다.
 */
export const ChallengeRole = {
  LEADER: 'LEADER',
  FOLLOWER: 'FOLLOWER',
} as const;
export type ChallengeRole = typeof ChallengeRole[keyof typeof ChallengeRole];

/**
 * 정기모임 상태입니다.
 */
export const MeetingStatus = {
  VOTING: 'VOTING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type MeetingStatus = typeof MeetingStatus[keyof typeof MeetingStatus];

/**
 * 투표 상태입니다.
 */
export const VoteStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
} as const;
export type VoteStatus = typeof VoteStatus[keyof typeof VoteStatus];

/**
 * 지출 항목의 승인 상태입니다.
 */
export const ExpenseStatus = {
  VOTING: 'VOTING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  USED: 'USED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;
export type ExpenseStatus = typeof ExpenseStatus[keyof typeof ExpenseStatus];

/**
 * 피드 게시글 분류입니다.
 */
export const PostCategory = {
  NOTICE: 'NOTICE',
  GENERAL: 'GENERAL',
  QUESTION: 'QUESTION',
} as const;
export type PostCategory = typeof PostCategory[keyof typeof PostCategory];

