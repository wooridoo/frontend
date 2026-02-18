import { capabilities } from './capabilities';
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import { castVote, createVote, getChallengeVotes, getVoteDetail, toLocalDateTimeString } from './vote';
import type { Vote } from '@/types/vote';

export type ExpenseStatus = 'VOTING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'USED' | 'EXPIRED' | 'CANCELLED';
export type ExpenseCategory = 'MEETING' | 'FOOD' | 'SUPPLIES' | 'OTHER';

export interface ExpenseUser {
  userId: string;
  nickname: string;
  profileImage?: string;
}

export interface Expense {
  // Vote-driven flow: expenseId is UI alias of voteId.
  expenseId: string;
  voteId: string;
  challengeId: string;
  meetingId?: string;
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

interface LegacyExpenseResponsePayload {
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

const normalizeExpenseStatus = (status?: string): ExpenseStatus => {
  const value = status?.toUpperCase?.() || 'VOTING';
  if (value === 'PENDING' || value === 'OPEN' || value === 'IN_PROGRESS') return 'VOTING';
  if (value === 'APPROVED') return 'APPROVED';
  if (value === 'REJECTED') return 'REJECTED';
  if (value === 'PAID') return 'PAID';
  if (value === 'USED') return 'USED';
  if (value === 'EXPIRED') return 'EXPIRED';
  if (value === 'CANCELLED') return 'CANCELLED';
  return 'VOTING';
};

const normalizeCategory = (category?: string): ExpenseCategory => {
  if (category === 'MEETING' || category === 'FOOD' || category === 'SUPPLIES' || category === 'OTHER') {
    return category;
  }
  return 'OTHER';
};

const asNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  return undefined;
};

const toExpenseFromVote = (vote: Vote): Expense => {
  const targetInfo = vote.targetInfo || {};
  const amount = asNumber(targetInfo.amount, 0);
  const meetingId = asString(targetInfo.meetingId);
  const receiptUrl = asString(targetInfo.receiptUrl);
  const barcodeNumber = asString((targetInfo as Record<string, unknown>).barcodeNumber);
  const status = normalizeExpenseStatus(vote.status);

  return {
    expenseId: vote.voteId,
    voteId: vote.voteId,
    challengeId: vote.challengeId,
    meetingId,
    title: vote.title,
    description: vote.description,
    amount,
    category: normalizeCategory(asString(targetInfo.category)),
    status,
    requestedBy: {
      userId: vote.createdBy.userId,
      nickname: vote.createdBy.nickname,
      profileImage: vote.createdBy.profileImage,
    },
    receiptUrl,
    paymentBarcodeNumber: barcodeNumber,
    approvedAt: status === 'APPROVED' ? vote.createdAt : undefined,
    createdAt: vote.createdAt,
  };
};

const adaptLegacyExpense = (raw: LegacyExpenseResponsePayload): Expense => ({
  expenseId: raw.expenseId,
  voteId: raw.voteId || raw.expenseId,
  challengeId: raw.challengeId,
  meetingId: raw.meetingId,
  title: raw.title,
  description: raw.description,
  amount: Number(raw.amount || 0),
  category: normalizeCategory(raw.category),
  status: normalizeExpenseStatus(raw.status),
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

const getDefaultExpenseDeadline = (): string => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return toLocalDateTimeString(date);
};

const assertLegacyCrudEnabled = () => {
  if (!capabilities.expenseCrud || !capabilities.legacyExpenseApi) {
    throw new Error('EXPENSE_001:현재 서버에서는 지출 수정/삭제를 지원하지 않습니다.');
  }
};

export async function getChallengeExpenses(
  challengeId: string,
  options?: {
    status?: ExpenseStatus;
    page?: number;
    size?: number;
  },
): Promise<ExpenseListPage> {
  if (capabilities.legacyExpenseApi) {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const response = await client.get<{
      content: LegacyExpenseResponsePayload[];
      totalAmount: number;
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    }>(`/challenges/${normalizedChallengeId}/expenses`, {
      params: options,
    });

    return {
      expenses: (response.content || []).map(adaptLegacyExpense),
      totalAmount: Number(response.totalAmount || 0),
      totalElements: Number(response.totalElements || 0),
      totalPages: Number(response.totalPages || 0),
      number: Number(response.number || 0),
      size: Number(response.size || 20),
    };
  }

  const votes = await getChallengeVotes(challengeId, undefined, 'EXPENSE');
  const detailedVotes = await Promise.all(
    votes.map(async (vote) => {
      try {
        return await getVoteDetail(vote.voteId);
      } catch {
        return vote;
      }
    }),
  );

  const mapped = detailedVotes.map(toExpenseFromVote);
  const filtered = options?.status ? mapped.filter((expense) => expense.status === options.status) : mapped;

  const page = Math.max(options?.page || 0, 0);
  const size = Math.max(options?.size || 20, 1);
  const start = page * size;
  const paged = filtered.slice(start, start + size);
  const totalAmount = filtered.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    expenses: paged,
    totalAmount,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    number: page,
    size,
  };
}

export async function getExpense(challengeId: string, expenseId: string): Promise<Expense> {
  if (capabilities.legacyExpenseApi) {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const response = await client.get<LegacyExpenseResponsePayload>(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`);
    return adaptLegacyExpense(response);
  }

  const vote = await getVoteDetail(expenseId);
  if (vote.type !== 'EXPENSE') {
    throw new Error('EXPENSE_001:지출 투표를 찾을 수 없습니다.');
  }
  return toExpenseFromVote(vote);
}

export async function createExpense(challengeId: string, data: CreateExpenseInput): Promise<Expense> {
  if (capabilities.legacyExpenseApi) {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const response = await client.post<LegacyExpenseResponsePayload>(`/challenges/${normalizedChallengeId}/expenses`, data);
    return adaptLegacyExpense(response);
  }

  const created = await createVote(challengeId, {
    type: 'EXPENSE',
    title: data.title,
    description: data.description,
    meetingId: data.meetingId,
    amount: data.amount,
    receiptUrl: data.receiptUrl,
    deadline: data.deadline || getDefaultExpenseDeadline(),
  });
  return getExpense(challengeId, created.voteId);
}

export async function approveExpense(
  challengeId: string,
  expenseId: string,
  approved: boolean,
  reason?: string,
): Promise<Expense> {
  if (capabilities.legacyExpenseApi) {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const response = await client.put<LegacyExpenseResponsePayload>(
      `/challenges/${normalizedChallengeId}/expenses/${expenseId}/approve`,
      { approved, reason },
    );
    return adaptLegacyExpense(response);
  }

  await castVote(expenseId, approved ? 'AGREE' : 'DISAGREE');
  return getExpense(challengeId, expenseId);
}

export async function updateExpense(
  challengeId: string,
  expenseId: string,
  data: Partial<CreateExpenseInput>,
): Promise<Expense> {
  assertLegacyCrudEnabled();
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.put<LegacyExpenseResponsePayload>(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`, data);
  return adaptLegacyExpense(response);
}

export async function deleteExpense(challengeId: string, expenseId: string): Promise<void> {
  assertLegacyCrudEnabled();
  const normalizedChallengeId = toApiChallengeId(challengeId);
  await client.delete(`/challenges/${normalizedChallengeId}/expenses/${expenseId}`);
}
