import { client } from './client';
import { toApiChallengeId } from './challengeId';

export type ExpenseStatus = 'VOTING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'USED' | 'EXPIRED' | 'CANCELLED';
export type ExpenseCategory = 'MEETING' | 'FOOD' | 'SUPPLIES' | 'OTHER';

export interface ExpenseUser {
  userId: string;
  nickname: string;
  profileImage?: string;
}

export interface Expense {
  expenseId: string;
  challengeId: string;
  meetingId?: string;
  voteId?: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;
  requestedBy: ExpenseUser;
  receiptUrl?: string;
  paymentBarcodeNumber?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface ExpenseListPage {
  expenses: Expense[];
  totalAmount: number;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateExpenseInput {
  meetingId: string;
  title: string;
  description?: string;
  amount: number;
  category?: ExpenseCategory;
  receiptUrl?: string;
  deadline?: string;
}

interface ExpenseResponsePayload {
  expenseId: string;
  challengeId: string;
  meetingId?: string;
  voteId?: string;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  status: string;
  requestedBy?: ExpenseUser;
  receiptUrl?: string;
  paymentBarcodeNumber?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
}

interface ExpenseListResponsePayload {
  content: ExpenseResponsePayload[];
  totalAmount: number;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const normalizeStatus = (status: string): ExpenseStatus => {
  const value = status?.toUpperCase?.() || 'VOTING';
  if (
    value === 'VOTING' ||
    value === 'APPROVED' ||
    value === 'REJECTED' ||
    value === 'PAID' ||
    value === 'USED' ||
    value === 'EXPIRED' ||
    value === 'CANCELLED'
  ) {
    return value;
  }
  return 'VOTING';
};

const normalizeCategory = (category?: string): ExpenseCategory => {
  if (category === 'MEETING' || category === 'FOOD' || category === 'SUPPLIES' || category === 'OTHER') {
    return category;
  }
  return 'OTHER';
};

const adaptExpense = (raw: ExpenseResponsePayload): Expense => ({
  expenseId: raw.expenseId,
  challengeId: raw.challengeId,
  meetingId: raw.meetingId,
  voteId: raw.voteId,
  title: raw.title,
  description: raw.description,
  amount: Number(raw.amount || 0),
  category: normalizeCategory(raw.category),
  status: normalizeStatus(raw.status),
  requestedBy: raw.requestedBy || {
    userId: '',
    nickname: 'Unknown',
  },
  receiptUrl: raw.receiptUrl,
  paymentBarcodeNumber: raw.paymentBarcodeNumber,
  approvedAt: raw.approvedAt,
  paidAt: raw.paidAt,
  createdAt: raw.createdAt,
});

export async function getChallengeExpenses(
  challengeId: string,
  options?: {
    status?: ExpenseStatus;
    page?: number;
    size?: number;
  },
): Promise<ExpenseListPage> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<ExpenseListResponsePayload>(`/challenges/${normalizedChallengeId}/expenses`, {
    params: options,
  });

  return {
    expenses: (response.content || []).map(adaptExpense),
    totalAmount: Number(response.totalAmount || 0),
    totalElements: Number(response.totalElements || 0),
    totalPages: Number(response.totalPages || 0),
    number: Number(response.number || 0),
    size: Number(response.size || 20),
  };
}

export async function getExpense(challengeId: string, expenseId: string): Promise<Expense> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<ExpenseResponsePayload>(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`);
  return adaptExpense(response);
}

export async function createExpense(challengeId: string, data: CreateExpenseInput): Promise<Expense> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.post<ExpenseResponsePayload>(`/challenges/${normalizedChallengeId}/expenses`, data);
  return adaptExpense(response);
}

export async function approveExpense(
  challengeId: string,
  expenseId: string,
  approved: boolean,
  reason?: string,
): Promise<Expense> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.put<ExpenseResponsePayload>(
    `/challenges/${normalizedChallengeId}/expenses/${expenseId}/approve`,
    { approved, reason },
  );
  return adaptExpense(response);
}

export async function updateExpense(
  challengeId: string,
  expenseId: string,
  data: Partial<CreateExpenseInput>,
): Promise<Expense> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.put<ExpenseResponsePayload>(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`, data);
  return adaptExpense(response);
}

export async function deleteExpense(challengeId: string, expenseId: string): Promise<void> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  await client.delete(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`);
}
