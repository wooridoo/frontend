/**
    * 동작 설명은 추후 세분화 예정입니다.
 * 
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import type { ChallengeAccount, ChallengeAccountGraph } from '@/types/ledger';

import { normalizeChallengeAccount } from '@/lib/utils/dataMappers';

/**
 * 챌린지 어카운트 조회 (028)
 */
export async function getChallengeAccount(challengeId: string): Promise<ChallengeAccount> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<ChallengeAccount>(`/challenges/${normalizedChallengeId}/account`);
  return normalizeChallengeAccount(response);
}

export async function getChallengeAccountGraph(
  challengeId: string,
  months?: number,
): Promise<ChallengeAccountGraph> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<ChallengeAccountGraph>(
    `/challenges/${normalizedChallengeId}/account/graph`,
    {
      params: months ? { months } : undefined,
    },
  );

  return {
    challengeId: response.challengeId || normalizedChallengeId,
    months: Number(response.months || months || 6),
    calculatedAt: response.calculatedAt,
    monthlyExpenses: (response.monthlyExpenses || []).map((point) => ({
      month: point.month,
      expense: Number(point.expense || 0),
    })),
    monthlyBalances: (response.monthlyBalances || []).map((point) => ({
      month: point.month,
      balance: point.balance === null || point.balance === undefined ? null : Number(point.balance),
    })),
  };
}

