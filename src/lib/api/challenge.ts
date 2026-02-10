/**
 * Challenge API Module
 * 챌린지 관련 핵심 API (Feed는 feed.ts로 분리됨)
 * 
 * Mock ↔ Spring 전환 가능 구조
 */
import { client, ApiError } from './client';
import { useAuthStore } from '@/store/useAuthStore';
import { ChallengeStatus } from '@/types/enums';



// =====================
// Types
// =====================
export interface ChallengeInfo {
  challengeId: string;
  title: string;
  description?: string;
  category: string;
  status: ChallengeStatus;
  memberCount: {
    current: number;
    max: number;
  };
  supportAmount: number;
  startDate: string;
  endDate: string;
  thumbnailUrl?: string; // API 스펙과 맞춤 (legacy: thumbnailUrl)
  certificationRate?: number; // Legacy 호환용
  leader: {
    userId: string;
    nickname: string;
    brix: number;
  };
}

// =====================
// API Functions
// =====================

/**
 * 챌린지 상세 조회 (024)
 */
export async function getChallenge(challengeId: string): Promise<ChallengeInfo> {
  // client.get returns the unwrapped data (ChallengeInfo)
  const challenge = await client.get<ChallengeInfo>(`/challenges/${challengeId}`);
  return challenge;
}

/**
 * 챌린지 목록 조회 (검색/탐색용)
 */
export async function getChallenges(params?: { query?: string; category?: string; sort?: string; size?: number }): Promise<ChallengeInfo[]> {
  // client.get returns unwrapped data { content: ..., page: ... }
  const response = await client.get<{ content: ChallengeInfo[] }>('/challenges', { params });
  return response.content;
}

/**
 * 챌린지 참여 여부 확인 (Helper)
 */
export function isParticipant(challengeId: string): boolean {
  const { user } = useAuthStore.getState();
  return user?.participatingChallengeIds?.includes(challengeId) ?? false;
}

/**
 * 챌린지 접근 권한 검증 (Helper)
 */
export function validateChallengeAccess(challengeId: string): void {
  const { isLoggedIn, user } = useAuthStore.getState();
  if (!isLoggedIn || !user) throw new ApiError('로그인이 필요합니다.', 401);

  if (!user.participatingChallengeIds?.includes(challengeId)) {
    throw new ApiError('해당 챌린지에 참여하지 않았습니다.', 403);
  }
}

// --- Additional Challenge API Functions ---

export interface UpdateChallengeRequest {
  challengeId: string;
  title: string;
  description?: string;
  category: string;
  thumbnailUrl?: string;
  maxMembers: number;
}

export async function updateChallenge(data: UpdateChallengeRequest): Promise<ChallengeInfo> {
  return client.put<ChallengeInfo>(`/challenges/${data.challengeId}`, data);
}

export async function deleteChallenge(challengeId: string): Promise<void> {
  await client.delete(`/challenges/${challengeId}`);
}

export async function leaveChallenge(challengeId: string): Promise<void> {
  await client.delete(`/challenges/${challengeId}/leave`);
}

