/**
 * Ledger (Challenge Account) API Module
 * 
 * Mock ↔ Spring 전환 가능 구조
 * API 정의서 028번: 챌린지 어카운트 조회
 */
import { client } from './client';
import type { ChallengeAccount } from '@/types/ledger';

// =====================
// Mock 전환 플래그
// =====================
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// =====================
// Mock Data (028 Response)
// =====================
const MOCK_ACCOUNT: ChallengeAccount = {
  challengeId: 1,
  balance: 5000000,
  lockedDeposits: 2000000,
  availableBalance: 3000000,
  stats: {
    totalSupport: 12500000,
    totalExpense: 7500000,
    totalFee: 150000,
    monthlyAverage: {
      support: 1000000,
      expense: 500000
    }
  },
  supportStatus: {
    thisMonth: {
      paid: 8,
      unpaid: 2,
      total: 10
    }
  },
  recentTransactions: [
    {
      transactionId: 105,
      type: 'EXPENSE',
      amount: 45000,
      description: '2월 정기모임 다과비',
      createdAt: '2026-02-12T14:30:00Z'
    },
    {
      transactionId: 104,
      type: 'SUPPORT',
      amount: 100000,
      description: '김철수 2월 서포트 납입',
      createdAt: '2026-02-01T10:15:00Z'
    },
    {
      transactionId: 103,
      type: 'SUPPORT',
      amount: 100000,
      description: '이영희 2월 서포트 납입',
      createdAt: '2026-02-01T09:30:00Z'
    }
  ]
};

// =====================
// Mock Functions
// =====================
async function mockGetChallengeAccount(challengeId: string): Promise<ChallengeAccount> {
  await new Promise(resolve => setTimeout(resolve, 600));

  // 간단한 ID 체크
  if (challengeId === '999') {
    throw new Error('Challenge not found');
  }

  return { ...MOCK_ACCOUNT, challengeId: Number(challengeId) };
}

// =====================
// API Functions
// =====================

/**
 * 챌린지 어카운트 조회 (028)
 */
export async function getChallengeAccount(challengeId: string): Promise<ChallengeAccount> {
  if (USE_MOCK) {
    return mockGetChallengeAccount(challengeId);
  }

  const { data } = await client.get<{ data: ChallengeAccount }>(
    `/challenges/${challengeId}/account`
  );
  return data;
}
