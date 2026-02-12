/**
 * Expense Hooks
 * Vote hooks 패턴 기반 구현
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChallengeExpenses,
    getExpense,
    createExpense,
    approveExpense,
    updateExpense,
    deleteExpense,
} from '@/lib/api/expense';
import type {
    ExpenseStatus,
    ExpenseCategory,
    CreateExpenseInput,
} from '@/lib/api/expense';

/**
 * 지출 목록 조회 훅
 */
export function useExpenses(
    challengeId: string | undefined,
    options?: {
        status?: ExpenseStatus;
        category?: ExpenseCategory;
    }
) {
    return useQuery({
        queryKey: ['expenses', challengeId, options],
        queryFn: () => getChallengeExpenses(challengeId!, options),
        enabled: !!challengeId,
    });
}

/**
 * 지출 상세 조회 훅
 */
export function useExpense(challengeId: string | undefined, expenseId: string | undefined) {
    return useQuery({
        queryKey: ['expense', challengeId, expenseId],
        queryFn: () => getExpense(challengeId!, expenseId!),
        enabled: !!challengeId && !!expenseId,
    });
}

/**
 * 지출 등록 훅
 */
export function useCreateExpense(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExpenseInput) => createExpense(challengeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['ledger', challengeId] });
        },
    });
}

/**
 * 지출 승인/거절 훅
 */
export function useApproveExpense(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ expenseId, approved, reason }: {
            expenseId: string;
            approved: boolean;
            reason?: string;
        }) => approveExpense(challengeId, expenseId, approved, reason),
        onSuccess: (updatedExpense) => {
            queryClient.invalidateQueries({ queryKey: ['expenses', challengeId] });
            queryClient.setQueryData(['expense', challengeId, updatedExpense.expenseId], updatedExpense);
            queryClient.invalidateQueries({ queryKey: ['ledger', challengeId] });
        },
    });
}

/**
 * 지출 수정 훅
 */
export function useUpdateExpense(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ expenseId, data }: { expenseId: string; data: Partial<CreateExpenseInput> }) =>
            updateExpense(challengeId, expenseId, data),
        onSuccess: (updatedExpense) => {
            queryClient.invalidateQueries({ queryKey: ['expenses', challengeId] });
            queryClient.setQueryData(['expense', challengeId, updatedExpense.expenseId], updatedExpense);
        },
    });
}

/**
 * 지출 삭제 훅
 */
export function useDeleteExpense(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (expenseId: string) => deleteExpense(challengeId, expenseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', challengeId] });
            queryClient.invalidateQueries({ queryKey: ['ledger', challengeId] });
        },
    });
}
