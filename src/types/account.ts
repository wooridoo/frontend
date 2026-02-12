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
    type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'PAYMENT' | 'REFUND' | 'CHARGE' | 'SUPPORT' | 'SUPPORT_AUTO';
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
    paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT';
    returnUrl?: string;
}

export interface CreditChargeResponse {
    orderId: string;
    amount: number;
    paymentUrl?: string;
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

// --- Charge Callback (Toss 결제 후 콜백) ---

export interface ChargeCallbackRequest {
    orderId: string;
    paymentKey: string;
    amount: number;
}

export interface ChargeCallbackResponse {
    transactionId: string;
    amount: number;
    balance: number;
    status: 'SUCCESS' | 'FAILED';
}

// --- Support Payment ---

export interface SupportPaymentRequest {
    challengeId: string;
    amount: number;
}

export interface SupportPaymentResponse {
    transactionId: string;
    amount: number;
    balanceAfter: number;
    status: 'SUCCESS' | 'FAILED';
}
