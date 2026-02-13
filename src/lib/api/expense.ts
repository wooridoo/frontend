/**
 * Expense API Module
 * API 정의서 046-051번 기반 — 실제 백엔드 연동
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';

// =====================
// Types (API 정의서 기반)
// =====================
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type ExpenseCategory = 'MEETING' | 'FOOD' | 'SUPPLIES' | 'OTHER';

export interface ExpenseUser {
    userId: string;
    nickname: string;
    profileImage?: string;
}

export interface Expense {
    expenseId: string;
    challengeId: string;
    title: string;
    description?: string;
    amount: number;
    category: ExpenseCategory;
    status: ExpenseStatus;
    requestedBy: ExpenseUser;
    receiptUrl?: string;
    approvedBy?: ExpenseUser;
    approvedAt?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateExpenseInput {
    title: string;
    description?: string;
    amount: number;
    category: ExpenseCategory;
    receiptUrl?: string;
}

// =====================
// API Functions (실제 백엔드 호출)
// =====================

/**
 * 지출 내역 목록 조회 (046)
 */

interface ExpenseResponse {
    expenses?: Expense[];
    content?: Expense[];
    totalAmount?: number;
}

/**
 * 지출 내역 목록 조회 (046)
 */
export async function getChallengeExpenses(
    challengeId: string,
    options?: {
        status?: ExpenseStatus;
        category?: ExpenseCategory;
        page?: number;
        size?: number;
    }
): Promise<{ expenses: Expense[]; totalAmount: number }> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const response = await client.get<Expense[] | ExpenseResponse>(
        `/challenges/${normalizedChallengeId}/expenses`,
        { params: options }
    );

    // interceptor가 data를 unwrap함. 유연한 파싱
    if (Array.isArray(response)) {
        return { expenses: response, totalAmount: 0 };
    }
    return {
        expenses: response?.expenses || response?.content || [],
        totalAmount: response?.totalAmount || 0,
    };
}

/**
 * 지출 내역 상세 조회 (047)
 */
export async function getExpense(challengeId: string, expenseId: string): Promise<Expense> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.get<Expense>(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`);
}

/**
 * 지출 내역 등록 (048)
 */
export async function createExpense(challengeId: string, data: CreateExpenseInput): Promise<Expense> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.post<Expense>(`/challenges/${normalizedChallengeId}/expenses`, data);
}

/**
 * 지출 승인/거절 (049)
 */
export async function approveExpense(
    challengeId: string,
    expenseId: string,
    approved: boolean,
    reason?: string
): Promise<Expense> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.put<Expense>(
        `/challenges/${normalizedChallengeId}/expenses/${expenseId}/approve`,
        { approved, reason }
    );
}

/**
 * 지출 수정 (050)
 */
export async function updateExpense(
    challengeId: string,
    expenseId: string,
    data: Partial<CreateExpenseInput>
): Promise<Expense> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.put<Expense>(
        `/challenges/${normalizedChallengeId}/expenses/${expenseId}`,
        data
    );
}

/**
 * 지출 삭제 (051)
 */
export async function deleteExpense(challengeId: string, expenseId: string): Promise<void> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    await client.delete(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`);
}
