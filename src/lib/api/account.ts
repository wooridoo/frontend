
import { client } from './client';
import type {
    Account,
    TransactionHistoryResponse,
    CreditChargeRequest,
    CreditChargeResponse,
    WithdrawRequest,
    WithdrawResponse,
    TransactionHistoryParams
} from '@/types/account';
import type { ApiResponse } from '@/types/api';

const BASE_URL = '/accounts';

export const getMyAccount = async () => {
    return client.get<ApiResponse<Account>>(`${BASE_URL}/me`);
};

export const getTransactionHistory = async (params?: TransactionHistoryParams) => {
    return client.get<ApiResponse<TransactionHistoryResponse>>(`${BASE_URL}/me/transactions`, { params });
};

export const requestCreditCharge = async (data: CreditChargeRequest) => {
    return client.post<ApiResponse<CreditChargeResponse>>(`${BASE_URL}/charge`, data);
};

export const requestWithdraw = async (data: WithdrawRequest) => {
    return client.post<ApiResponse<WithdrawResponse>>(`${BASE_URL}/withdraw`, data);
};
