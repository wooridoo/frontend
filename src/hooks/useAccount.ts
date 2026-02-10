/**
 * Account Hooks
 * 계좌 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import {
    getMyAccount,
    getTransactionHistory,
    requestCreditCharge,
    requestWithdraw
} from '@/lib/api/account';
import type {
    CreditChargeRequest,
    WithdrawRequest,
    TransactionHistoryParams
} from '@/types/account';

// Query Keys
export const accountKeys = {
    all: ['account'] as const,
    my: () => [...accountKeys.all, 'me'] as const,
    transactions: (filters: TransactionHistoryParams) => [...accountKeys.all, 'transactions', filters] as const,
};

// GET My Account
export function useMyAccount() {
    const { isLoggedIn } = useAuthStore();
    return useQuery({
        queryKey: accountKeys.my(),
        queryFn: getMyAccount,
        enabled: isLoggedIn,
    });
}

// GET Transaction History (Infinite)
export function useTransactionHistoryInfinite(filters: TransactionHistoryParams = {}) {
    const { isLoggedIn } = useAuthStore();
    return useInfiniteQuery({
        queryKey: accountKeys.transactions(filters),
        queryFn: ({ pageParam }) =>
            getTransactionHistory({ ...filters, page: pageParam as number, size: 20 }),
        getNextPageParam: (lastPage) => {
            const data = lastPage.data;
            return (data.currentPage + 1 < data.totalPages) ? data.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
        enabled: isLoggedIn,
    });
}

// POST Charge Credit
export function useRequestCreditCharge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreditChargeRequest) => requestCreditCharge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: accountKeys.my() });
            queryClient.invalidateQueries({ queryKey: accountKeys.transactions({}) });
        },
    });
}

// POST Withdraw
export function useRequestWithdraw() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: WithdrawRequest) => requestWithdraw(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: accountKeys.my() });
            queryClient.invalidateQueries({ queryKey: accountKeys.transactions({}) });
        },
    });
}
