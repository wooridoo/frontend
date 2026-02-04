/**
 * Ledger Domain Types
 */
export type TransactionType = 'SUPPORT' | 'EXPENSE' | 'FEE' | 'DEPOSIT' | 'REFUND';

export interface Transaction {
    transactionId: number;
    type: TransactionType;
    amount: number;
    description: string;
    createdAt: string; // ISO Date
}

export interface ChallengeAccountStats {
    totalSupport: number;
    totalExpense: number;
    totalFee: number;
    monthlyAverage: {
        support: number;
        expense: number;
    };
}

export interface SupportStatus {
    thisMonth: {
        paid: number;
        unpaid: number;
        total: number;
    };
}

export interface ChallengeAccount {
    challengeId: number;
    balance: number;
    lockedDeposits: number;
    availableBalance: number;
    stats: ChallengeAccountStats;
    recentTransactions: Transaction[];
    supportStatus: SupportStatus;
}
