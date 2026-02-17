/**
 * Ledger Domain Types
 */
export type TransactionType = 'SUPPORT' | 'EXPENSE' | 'FEE' | 'DEPOSIT' | 'REFUND' | 'ENTRY_FEE' | string;

export interface Transaction {
    transactionId: string;
    type: TransactionType;
    amount: number;
    description: string;
    createdAt: string;
}

export interface ChallengeAccountStats {
    totalSupport: number;
    totalExpense: number;
    totalFee: number;
    monthlyAverage: number;
}

export interface SupportStatus {
    paid: number;
    unpaid: number;
    total: number;
}

export interface ChallengeAccount {
    challengeId: string;
    balance: number;
    lockedDeposits: number;
    availableBalance: number;
    stats: ChallengeAccountStats;
    recentTransactions: Transaction[];
    supportStatus: SupportStatus;
}
