
import { client } from './client';
import type {
    Account,
    TransactionHistoryResponse,
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

export const getMyAccount = async () => {
    return client.get<Account>(`${BASE_URL}/me`);
};

export const getTransactionHistory = async (params?: TransactionHistoryParams) => {
    return client.get<TransactionHistoryResponse>(`${BASE_URL}/me/transactions`, { params });
};

export const requestCreditCharge = async (data: CreditChargeRequest) => {
    return client.post<CreditChargeResponse>(`${BASE_URL}/charge`, data);
};

export const requestWithdraw = async (data: WithdrawRequest) => {
    return client.post<WithdrawResponse>(`${BASE_URL}/withdraw`, data);
};

/**
 * 결제 콜백 처리
 * POST /accounts/charge/callback — Toss 결제 완료 후 서버에 결과 전달
 */
export const chargeCallback = async (data: ChargeCallbackRequest) => {
    return client.post<ChargeCallbackResponse>(`${BASE_URL}/charge/callback`, data);
};

/**
 * 서포트 결제
 * POST /accounts/support — 챌린지 서포트 금액 결제
 */
export const supportPayment = async (data: SupportPaymentRequest) => {
    return client.post<SupportPaymentResponse>(`${BASE_URL}/support`, data);
};
