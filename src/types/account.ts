/**
 * Account Type Definitions
 * Based on backend DTOs: MyAccountResponse, TransactionHistoryResponse, etc.
 */

// --- Base Types ---

export interface AccountLimits {
    dailyWithdrawLimit: number;
    monthlyWithdrawLimit: number;
    usedToday: number;
    usedThisMonth: number;
}

export interface LinkedBankAccount {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    isVerified: boolean;
}

export interface Account {
    accountId: string;
    userId: string;
    balance: number;
    availableBalance: number;
    lockedBalance: number;
    limits: AccountLimits;
    linkedBankAccount?: LinkedBankAccount;
    createdAt: string; // ISO 8601
}

// --- Transaction Types ---

export interface Transaction {
    transactionId: string;
    type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'PAYMENT' | 'REFUND'; // Adjust based on backend enum
    amount: number;
    balanceAfter: number;
    description: string;
    param?: string; // Additional info
    createdAt: string;
}

export interface TransactionHistoryResponse {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

// --- Request/Response DTOs ---

export interface CreditChargeRequest {
    amount: number;
    method: 'CARD' | 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT';
    // Add other fields from CreditChargeRequest.java if needed
}

export interface CreditChargeResponse {
    chargeId: string;
    redirectUrl?: string; // If PG integration requires redirect
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface WithdrawRequest {
    amount: number;
    bankCode?: string; // Optional if using linked account
    accountNumber?: string;
}

export interface WithdrawResponse {
    withdrawId: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    fee: number;
}

export interface TransactionHistoryParams {
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}
