/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */

// 보조 처리

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
    createdAt: string; // ?? ??
}

// 보조 처리

export interface Transaction {
    transactionId: string;
    type:
        | 'CHARGE'
        | 'WITHDRAW'
        | 'LOCK'
        | 'UNLOCK'
        | 'SUPPORT'
        | 'ENTRY_FEE'
        | 'REFUND'
        | 'DEPOSIT'
        | 'TRANSFER'
        | 'PAYMENT'
        | 'SUPPORT_AUTO';
    amount: number;
    balanceAfter: number;
    description: string;
    param?: string; // ?? ??
    createdAt: string;
}

export interface TransactionHistoryResponse {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    summary?: {
        totalIncome: number;
        totalExpense: number;
        period?: {
            startDate?: string;
            endDate?: string;
        };
    };
}

// 보조 처리

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
    bankCode?: string; // ?? ??
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

// 보조 처리

export interface ChargeCallbackRequest {
    orderId: string;
    paymentKey: string;
    amount: number;
    status: string;
}

export interface ChargeCallbackResponse {
    transactionId: string;
    amount: number;
    balance: number;
    status: 'SUCCESS' | 'FAILED';
}

// 보조 처리

export interface SupportPaymentRequest {
    challengeId: string;
    amount?: number;
}

export interface SupportPaymentResponse {
    transactionId: string;
    challengeId: string;
    challengeName?: string;
    amount: number;
    balanceAfter: number;
    challengeBalanceAfter?: number;
    isFirstSupport?: boolean;
    createdAt?: string;
}
