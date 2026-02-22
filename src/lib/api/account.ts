
import { client } from './client';
import type {
    Account,
    TransactionHistoryResponse,
    Transaction,
    CreditChargeRequest,
    CreditChargeResponse,
    WithdrawRequest,
    WithdrawResponse,
    TransactionHistoryParams,
    ChargeCallbackRequest,
    ChargeCallbackResponse,
    SupportPaymentRequest,
    SupportPaymentResponse,
} from '@/types/account';

const BASE_URL = '/accounts';

interface BackendTransactionHistoryItem {
    transactionId: string | number;
    type: string;
    amount: number;
    balance: number;
    description: string;
    createdAt: string;
}

interface BackendTransactionHistoryResponse {
    content?: BackendTransactionHistoryItem[];
    page?: {
        number?: number;
        totalElements?: number;
        totalPages?: number;
    };
    summary?: {
        totalIncome?: number;
        totalExpense?: number;
        period?: {
            startDate?: string;
            endDate?: string;
        };
    };
}

interface BackendSupportPaymentResponse {
    transactionId?: string | number;
    challengeId?: string;
    challengeName?: string;
    amount?: number;
    newBalance?: number;
    newChallengeBalance?: number;
    isFirstSupport?: boolean;
    createdAt?: string;
}

const normalizeTransactionType = (type: string): Transaction['type'] => {
    switch (type) {
        case 'CHARGE':
        case 'WITHDRAW':
        case 'LOCK':
        case 'UNLOCK':
        case 'SUPPORT':
        case 'ENTRY_FEE':
        case 'REFUND':
        case 'DEPOSIT':
        case 'TRANSFER':
        case 'PAYMENT':
        case 'SUPPORT_AUTO':
            return type;
        default:
            return 'SUPPORT';
    }
};

const mapTransactionHistory = (
    response: BackendTransactionHistoryResponse
): TransactionHistoryResponse => {
    const content = response.content || [];
    const page = response.page || {};
    const summary = response.summary || {};

    return {
        transactions: content.map(item => ({
            transactionId: String(item.transactionId),
            type: normalizeTransactionType(item.type),
            amount: item.amount || 0,
            balanceAfter: item.balance || 0,
            description: item.description || '',
            createdAt: item.createdAt || '',
        })),
        totalCount: page.totalElements || 0,
        totalPages: page.totalPages || 0,
        currentPage: page.number || 0,
        summary: {
            totalIncome: summary.totalIncome || 0,
            totalExpense: summary.totalExpense || 0,
            period: summary.period,
        },
    };
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const getMyAccount = async () => {
    return client.get<Account>(`${BASE_URL}/me`);
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const getTransactionHistory = async (params?: TransactionHistoryParams) => {
    const response = await client.get<BackendTransactionHistoryResponse>(`${BASE_URL}/me/transactions`, { params });
    return mapTransactionHistory(response);
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const requestCreditCharge = async (data: CreditChargeRequest) => {
    return client.post<CreditChargeResponse>(`${BASE_URL}/charge`, data);
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const requestWithdraw = async (data: WithdrawRequest) => {
    return client.post<WithdrawResponse>(`${BASE_URL}/withdraw`, data);
};

/**
 * 결제 콜백 처리
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const chargeCallback = async (data: ChargeCallbackRequest) => {
    return client.post<ChargeCallbackResponse>(`${BASE_URL}/charge/callback`, data);
};

/**
 * 서포트 결제
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const supportPayment = async (data: SupportPaymentRequest) => {
    const response = await client.post<BackendSupportPaymentResponse>(`${BASE_URL}/support`, {
        challengeId: data.challengeId,
    });

    return {
        transactionId: String(response.transactionId || ''),
        challengeId: response.challengeId || data.challengeId,
        challengeName: response.challengeName,
        amount: response.amount || data.amount || 0,
        balanceAfter: response.newBalance || 0,
        challengeBalanceAfter: response.newChallengeBalance,
        isFirstSupport: response.isFirstSupport,
        createdAt: response.createdAt,
    } satisfies SupportPaymentResponse;
};
