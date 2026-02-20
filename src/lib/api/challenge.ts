/**
 * Challenge API Module
 * 챌린지 관련 핵심 API (Feed는 feed.ts로 분리됨)
 * 
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';

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
  const normalizedChallengeId = toApiChallengeId(challengeId);
  // client.get returns the unwrapped data (ChallengeInfo)
  const challenge = await client.get<ChallengeInfo>(`/challenges/${normalizedChallengeId}`);
  return normalizeChallenge(challenge);
}


interface ChallengeResponse {
  challenges?: ChallengeInfo[];
  content?: ChallengeInfo[];
}

export interface GetChallengesParams {
  query?: string;
  category?: string;
  sort?: string;
  size?: number;
}

const toSearchable = (value: string | undefined) => (value || '').trim().toLowerCase();

const matchesChallengeQuery = (challenge: ChallengeInfo, query: string) => {
  const normalizedQuery = toSearchable(query);
  if (!normalizedQuery) return true;

  return (
    toSearchable(challenge.title).includes(normalizedQuery) ||
    toSearchable(challenge.description).includes(normalizedQuery) ||
    toSearchable(challenge.category).includes(normalizedQuery)
  );
};

/**
 * 챌린지 목록 조회 (검색/탐색용)
 */
export async function getChallenges(params?: GetChallengesParams): Promise<ChallengeInfo[]> {
  const { query, ...apiParams } = params || {};
  const filteredApiParams = Object.fromEntries(
    Object.entries(apiParams).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

  const response = await client.get<ChallengeInfo[] | ChallengeResponse>('/challenges', {
    params: filteredApiParams,
  });

  const list = Array.isArray(response)
    ? response
    : (response.challenges || response.content || []);

  const normalizedChallenges = list.map(normalizeChallenge);

  if (!query) {
    return normalizedChallenges;
  }

  return normalizedChallenges.filter((challenge) => matchesChallengeQuery(challenge, query));
}

/**
 * 내 챌린지 목록 조회 (027)
 */
type MyChallengeStatus = 'ACTIVE' | 'CLOSED' | 'participating' | 'completed';

const normalizeMyChallengeStatus = (status?: MyChallengeStatus): 'ACTIVE' | 'CLOSED' | undefined => {
  if (!status) return undefined;
  if (status === 'participating') return 'ACTIVE';
  if (status === 'completed') return 'CLOSED';
  return status;
};

export async function getMyChallenges(status?: MyChallengeStatus): Promise<ChallengeInfo[]> {
  const normalizedStatus = normalizeMyChallengeStatus(status);
  const response = await client.get<ChallengeInfo[] | ChallengeResponse>('/challenges/me', {
    params: { status: normalizedStatus },
  });

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
  category?: string;
  thumbnailImage?: string;
  thumbnailUrl?: string;
  maxMembers?: number;
  rules?: string;
}

export async function updateChallenge(data: UpdateChallengeRequest): Promise<ChallengeInfo> {
  const normalizedChallengeId = toApiChallengeId(data.challengeId);
  return client.put<ChallengeInfo>(`/challenges/${normalizedChallengeId}`, {
    name: data.name,
    description: data.description,
    thumbnailImage: data.thumbnailImage ?? data.thumbnailUrl,
    maxMembers: data.maxMembers,
    rules: data.rules,
  });
}

export async function deleteChallenge(challengeId: string): Promise<void> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  await client.delete(`/challenges/${normalizedChallengeId}`);
}

export async function leaveChallenge(challengeId: string): Promise<void> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  await client.delete(`/challenges/${normalizedChallengeId}/leave`);
}

export async function joinChallenge(challengeId: string, _depositAmount?: number): Promise<void> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  void _depositAmount;
  await client.post(`/challenges/${normalizedChallengeId}/join`);
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
  supportDay?: number;
  rules?: string;
}

export async function createChallenge(data: CreateChallengeRequest): Promise<ChallengeInfo> {
  return client.post<ChallengeInfo>('/challenges', data);
}

export interface UpdateSupportSettingsResponse {
  challengeId: string;
  autoPayEnabled: boolean;
  nextPaymentDate: string;
  amount: number;
}

export async function updateSupportSettings(
  challengeId: string,
  payload: { autoPayEnabled: boolean },
): Promise<UpdateSupportSettingsResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.put<UpdateSupportSettingsResponse>(
    `/challenges/${normalizedChallengeId}/support/settings`,
    payload,
  );
}
