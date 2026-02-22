import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  chargeCallback,
  getMyAccount,
  getTransactionHistory,
  requestCreditCharge,
  requestWithdraw,
  supportPayment,
} from '@/lib/api/account';
import { useAuthStore } from '@/store/useAuthStore';
import type {
  ChargeCallbackRequest,
  CreditChargeRequest,
  SupportPaymentRequest,
  TransactionHistoryParams,
  WithdrawRequest,
} from '@/types/account';

/**
 * 계정 도메인 React Query 키 모음입니다.
 */
export const accountKeys = {
  all: ['account'] as const,
  my: () => [...accountKeys.all, 'me'] as const,
  transactions: (filters: TransactionHistoryParams) => [...accountKeys.all, 'transactions', filters] as const,
};

/**
 * 내 계정(잔액/상태) 정보를 조회합니다.
 */
export function useMyAccount() {
  const { isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: accountKeys.my(),
    queryFn: getMyAccount,
    enabled: isLoggedIn,
  });
}

/**
 * 거래내역을 무한 스크롤 형태로 조회합니다.
 */
export function useTransactionHistoryInfinite(filters: TransactionHistoryParams = {}) {
  const { isLoggedIn } = useAuthStore();
  return useInfiniteQuery({
    queryKey: accountKeys.transactions(filters),
    queryFn: ({ pageParam }) => getTransactionHistory({ ...filters, page: pageParam as number, size: 20 }),
    getNextPageParam: lastPage =>
      (lastPage.currentPage + 1 < lastPage.totalPages) ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 0,
    enabled: isLoggedIn,
  });
}

/**
 * 크레딧 충전 요청 mutation입니다.
 */
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

/**
 * 출금 요청 mutation입니다.
 */
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

/**
 * 결제 콜백 반영 mutation입니다.
 */
export function useChargeCallback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChargeCallbackRequest) => chargeCallback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.my() });
      queryClient.invalidateQueries({ queryKey: accountKeys.transactions({}) });
    },
  });
}

/**
 * 챌린지 지원금 결제 mutation입니다.
 */
export function useSupportPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupportPaymentRequest) => supportPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.my() });
      queryClient.invalidateQueries({ queryKey: accountKeys.transactions({}) });
    },
  });
}

