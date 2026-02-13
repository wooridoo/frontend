/**
 * Ledger (Challenge Account) API Module
 * 
 * Mock ↔ Spring 전환 가능 구조
 * API 정의서 028번: 챌린지 어카운트 조회
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import type { ChallengeAccount } from '@/types/ledger';

import { normalizeChallengeAccount } from '@/lib/utils/dataMappers';

/**
 * 챌린지 어카운트 조회 (028)
 */
export async function getChallengeAccount(challengeId: string): Promise<ChallengeAccount> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<ChallengeAccount>(`/challenges/${normalizedChallengeId}/account`);
  return normalizeChallengeAccount(response);
}

