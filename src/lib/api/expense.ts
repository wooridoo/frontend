/**
 * Expense API Module
 * Vote 패턴 기반 구현
 * API 정의서 046-051번 기반
 */

// =====================
// Types (API 정의서 기반)
// =====================
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type ExpenseCategory = 'MEETING' | 'FOOD' | 'SUPPLIES' | 'OTHER';

export interface ExpenseUser {
    userId: number;
    nickname: string;
    profileImage?: string;
}

export interface Expense {
    expenseId: number;
    challengeId: number;
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
// Mock Data
// =====================
const MOCK_EXPENSES: Expense[] = [
    {
        expenseId: 1,
        challengeId: 1,
        title: '1월 정기모임 장소 대여비',
        description: '강남역 스터디카페 3시간 대여',
        amount: 50000,
        category: 'MEETING',
        status: 'PAID',
        requestedBy: { userId: 2, nickname: '김철수', profileImage: 'https://i.pravatar.cc/150?u=2' },
        receiptUrl: 'https://cdn.woorido.com/receipts/exp_001.jpg',
        approvedBy: { userId: 1, nickname: '홍길동' },
        approvedAt: '2026-01-11T10:00:00Z',
        paidAt: '2026-01-12T15:00:00Z',
        createdAt: '2026-01-10T14:00:00Z',
    },
    {
        expenseId: 2,
        challengeId: 1,
        title: '2월 정기모임 다과비',
        description: '커피 10잔, 케이크 2개',
        amount: 45000,
        category: 'FOOD',
        status: 'APPROVED',
        requestedBy: { userId: 3, nickname: '박민수', profileImage: 'https://i.pravatar.cc/150?u=3' },
        receiptUrl: 'https://cdn.woorido.com/receipts/exp_002.jpg',
        approvedBy: { userId: 1, nickname: '홍길동' },
        approvedAt: '2026-02-10T10:00:00Z',
        createdAt: '2026-02-08T14:00:00Z',
    },
    {
        expenseId: 3,
        challengeId: 1,
        title: '학습 자료 구매비',
        description: '온라인 강의 공동 구매',
        amount: 120000,
        category: 'SUPPLIES',
        status: 'PENDING',
        requestedBy: { userId: 2, nickname: '김철수' },
        createdAt: '2026-02-12T09:00:00Z',
    },
];

// =====================
// Error Types
// =====================
export class ExpenseApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// =====================
// API Functions (API 정의서 046-051)
// =====================

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
): Promise<{ content: Expense[]; totalAmount: number }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    let expenses = MOCK_EXPENSES.filter(e => e.challengeId === Number(challengeId));

    if (options?.status) {
        expenses = expenses.filter(e => e.status === options.status);
    }
    if (options?.category) {
        expenses = expenses.filter(e => e.category === options.category);
    }

    const totalAmount = expenses
        .filter(e => e.status === 'PAID' || e.status === 'APPROVED')
        .reduce((sum, e) => sum + e.amount, 0);

    return { content: expenses, totalAmount };
}

/**
 * 지출 내역 상세 조회 (047)
 */
export async function getExpense(challengeId: string, expenseId: number): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const expense = MOCK_EXPENSES.find(
        e => e.challengeId === Number(challengeId) && e.expenseId === expenseId
    );

    if (!expense) {
        throw new ExpenseApiError('지출 내역을 찾을 수 없습니다.', 404);
    }

    return expense;
}

/**
 * 지출 내역 등록 (048)
 */
export async function createExpense(challengeId: string, data: CreateExpenseInput): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newExpense: Expense = {
        expenseId: Date.now(),
        challengeId: Number(challengeId),
        title: data.title,
        description: data.description,
        amount: data.amount,
        category: data.category,
        status: 'PENDING',
        requestedBy: { userId: 1, nickname: '현재 사용자' }, // Mock
        receiptUrl: data.receiptUrl,
        createdAt: new Date().toISOString(),
    };

    MOCK_EXPENSES.unshift(newExpense);
    return newExpense;
}

/**
 * 지출 승인/거절 (049)
 */
export async function approveExpense(
    challengeId: string,
    expenseId: number,
    approved: boolean,
    _reason?: string
): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const expenseIndex = MOCK_EXPENSES.findIndex(
        e => e.challengeId === Number(challengeId) && e.expenseId === expenseId
    );

    if (expenseIndex === -1) {
        throw new ExpenseApiError('지출 내역을 찾을 수 없습니다.', 404);
    }

    const expense = MOCK_EXPENSES[expenseIndex];

    if (expense.status !== 'PENDING') {
        throw new ExpenseApiError('이미 처리된 지출입니다.', 400);
    }

    const updatedExpense: Expense = {
        ...expense,
        status: approved ? 'APPROVED' : 'REJECTED',
        approvedBy: { userId: 1, nickname: '홍길동' },
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    MOCK_EXPENSES[expenseIndex] = updatedExpense;
    return updatedExpense;
}

/**
 * 지출 수정 (050)
 */
export async function updateExpense(
    challengeId: string,
    expenseId: number,
    data: Partial<CreateExpenseInput>
): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const expenseIndex = MOCK_EXPENSES.findIndex(
        e => e.challengeId === Number(challengeId) && e.expenseId === expenseId
    );

    if (expenseIndex === -1) {
        throw new ExpenseApiError('지출 내역을 찾을 수 없습니다.', 404);
    }

    const expense = MOCK_EXPENSES[expenseIndex];

    if (expense.status !== 'PENDING') {
        throw new ExpenseApiError('승인 후에는 수정할 수 없습니다.', 400);
    }

    const updatedExpense: Expense = {
        ...expense,
        ...data,
        updatedAt: new Date().toISOString(),
    };

    MOCK_EXPENSES[expenseIndex] = updatedExpense;
    return updatedExpense;
}

/**
 * 지출 삭제 (051)
 */
export async function deleteExpense(challengeId: string, expenseId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const expenseIndex = MOCK_EXPENSES.findIndex(
        e => e.challengeId === Number(challengeId) && e.expenseId === expenseId
    );

    if (expenseIndex === -1) {
        throw new ExpenseApiError('지출 내역을 찾을 수 없습니다.', 404);
    }

    const expense = MOCK_EXPENSES[expenseIndex];

    if (expense.status === 'PAID') {
        throw new ExpenseApiError('지급 완료 후에는 삭제할 수 없습니다.', 400);
    }

    MOCK_EXPENSES.splice(expenseIndex, 1);
}
