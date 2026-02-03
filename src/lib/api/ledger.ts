import type { ChallengeAccount } from '@/types/domain';

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
    },
    {
      transactionId: 102,
      type: 'FEE',
      amount: 500,
      description: '1월 운용 수수료',
      createdAt: '2026-01-31T23:59:00Z'
    },
    {
      transactionId: 101,
      type: 'EXPENSE',
      amount: 120000,
      description: '1월 정기모임 대관료',
      createdAt: '2026-01-20T19:00:00Z'
    }
  ]
};

export async function getChallengeAccount(challengeId: string): Promise<ChallengeAccount> {
  if (!challengeId) throw new Error('Challenge ID is required');

  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 600)); // Little bit slower for drama

  // In a real app, we would fetch by challengeId
  // if (challengeId !== '1') throw new Error('Account not found');

  return MOCK_ACCOUNT;
}
