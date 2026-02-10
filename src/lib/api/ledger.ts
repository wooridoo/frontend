/**
 * Ledger (Challenge Account) API Module
 * 
 * Mock ↔ Spring 전환 가능 구조
 * API 정의서 028번: 챌린지 어카운트 조회
 */
import { client } from './client';
import type { ChallengeAccount } from '@/types/ledger';

/**
 * 챌린지 어카운트 조회 (028)
 */
export async function getChallengeAccount(challengeId: string): Promise<ChallengeAccount> {
  const { data } = await client.get<{ data: ChallengeAccount }>(
    `/challenges/${challengeId}/account`
  );
  return data;
}

