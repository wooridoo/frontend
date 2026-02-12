/**
 * Challenge API Module
 * 챌린지 관련 핵심 API (Feed는 feed.ts로 분리됨)
 * 
 * Mock ↔ Spring 전환 가능 구조
 */
import { client } from './client';

import type { ChallengeInfo } from '@/types/challenge';
export type { ChallengeInfo };

// =====================
// Types (Imported from @/types/challenge)
// =====================

// =====================
// API Functions
// =====================

/**
 * 챌린지 상세 조회 (024)
 */
import { normalizeChallenge } from '@/lib/utils/dataMappers';

/**
 * 챌린지 상세 조회 (024)
 */
export async function getChallenge(challengeId: string): Promise<ChallengeInfo> {
  // client.get returns the unwrapped data (ChallengeInfo)
  const challenge = await client.get<ChallengeInfo>(`/challenges/${challengeId}`);
  return normalizeChallenge(challenge);
}


interface ChallengeResponse {
  challenges?: ChallengeInfo[];
  content?: ChallengeInfo[];
}

/**
 * 챌린지 목록 조회 (검색/탐색용)
 */
export async function getChallenges(params?: { query?: string; category?: string; sort?: string; size?: number }): Promise<ChallengeInfo[]> {
  const response = await client.get<ChallengeInfo[] | ChallengeResponse>('/challenges', { params });

  const list = Array.isArray(response)
    ? response
    : (response.challenges || response.content || []);

  return list.map(normalizeChallenge);
}

/**
 * 내 챌린지 목록 조회 (027)
 */
export async function getMyChallenges(status?: 'participating' | 'completed'): Promise<ChallengeInfo[]> {
  const response = await client.get<ChallengeInfo[] | ChallengeResponse>('/challenges/me', { params: { status } });

  const list = Array.isArray(response)
    ? response
    : (response.challenges || response.content || []);

  return list.map(normalizeChallenge);
}


// Helpers moved to @/lib/utils/challengeUtils.ts

// --- Additional Challenge API Functions ---

export interface UpdateChallengeRequest {
  challengeId: string;
  name: string;
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

export async function joinChallenge(challengeId: string, depositAmount: number): Promise<void> {
  await client.post(`/challenges/${challengeId}/join`, { depositAmount });
}

/**
 * 챌린지 생성 (P0)
 */
export interface CreateChallengeRequest {
  category: string;
  name: string;
  description: string;
  startDate: string;
  maxMembers: number;
  supportAmount: number;
  depositAmount: number;
  supportDay: number;
  rules?: string;
}

export async function createChallenge(data: CreateChallengeRequest): Promise<ChallengeInfo> {
  return client.post<ChallengeInfo>('/challenges', data);
}
