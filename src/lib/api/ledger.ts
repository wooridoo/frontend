/**
    * 동작 설명은 추후 세분화 예정입니다.
 * 
    * 동작 설명은 추후 세분화 예정입니다.
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

