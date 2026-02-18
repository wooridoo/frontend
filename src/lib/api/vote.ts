import type { Vote, VoteCount, VoteOption, VoteResult, VoteType } from '@/types/vote';
import { VoteStatus } from '@/types/vote';
import { client } from './client';
import { toApiChallengeId } from './challengeId';

interface VoteCreator {
  userId: string;
  nickname: string;
  profileImage?: string;
}

interface VoteCountResponse {
  agree: number;
  disagree: number;
  total: number;
}

interface VoteListItemResponse {
  voteId: string;
  type: VoteType;
  title: string;
  status: string;
  createdBy: VoteCreator;
  voteCount: VoteCountResponse;
  deadline: string;
  createdAt: string;
}

interface VoteListResponse {
  content: VoteListItemResponse[];
}

interface VoteDetailResponse {
  voteId: string;
  challengeId: string;
  type: VoteType;
  title: string;
  description?: string;
  status: string;
  createdBy: VoteCreator;
  targetInfo?: Record<string, unknown>;
  voteCount: VoteCountResponse;
  myVote?: VoteOption;
  eligibleVoters: number;
  requiredApproval: number;
  deadline: string;
  createdAt: string;
}

interface VoteResultResponse {
  voteId: string;
  type: VoteType;
  status: string;
  voteCount: VoteCountResponse;
  eligibleVoters: number;
  requiredApproval: number;
  passed: boolean;
  approvalRate: number;
}

interface CastVoteResponse {
  voteId: string;
  myVote: VoteOption;
  voteCount: VoteCountResponse;
  votedAt: string;
  message?: string;
}

const normalizeVoteStatus = (status: string): VoteStatus => {
  const normalized = status?.toUpperCase?.() || '';
  if (normalized === 'OPEN' || normalized === 'IN_PROGRESS') return VoteStatus.PENDING;
  if (normalized === 'APPROVED') return VoteStatus.APPROVED;
  if (normalized === 'REJECTED') return VoteStatus.REJECTED;
  if (normalized === 'EXPIRED' || normalized === 'CANCELLED' || normalized === 'COMPLETED') return VoteStatus.EXPIRED;
  return VoteStatus.PENDING;
};

const toVoteCount = (voteCount?: VoteCountResponse): VoteCount => {
  const agree = Number(voteCount?.agree || 0);
  const disagree = Number(voteCount?.disagree || 0);
  const total = Number(voteCount?.total || 0);
  return {
    agree,
    disagree,
    total,
    abstain: 0,
    notVoted: Math.max(total - (agree + disagree), 0),
  };
};

const mapListItem = (challengeId: string, item: VoteListItemResponse): Vote => ({
  voteId: item.voteId,
  challengeId,
  type: item.type,
  title: item.title,
  status: normalizeVoteStatus(item.status),
  createdBy: item.createdBy,
  voteCount: toVoteCount(item.voteCount),
  eligibleVoters: Number(item.voteCount?.total || 0),
  requiredApproval: 0,
  deadline: item.deadline,
  createdAt: item.createdAt,
});

const mapDetail = (detail: VoteDetailResponse): Vote => ({
  voteId: detail.voteId,
  challengeId: detail.challengeId,
  type: detail.type,
  title: detail.title,
  description: detail.description,
  status: normalizeVoteStatus(detail.status),
  createdBy: detail.createdBy,
  targetInfo: detail.targetInfo as Vote['targetInfo'],
  voteCount: toVoteCount(detail.voteCount),
  myVote: detail.myVote,
  eligibleVoters: Number(detail.eligibleVoters || 0),
  requiredApproval: Number(detail.requiredApproval || 0),
  deadline: detail.deadline,
  createdAt: detail.createdAt,
});

const mapResult = (result: VoteResultResponse): VoteResult => ({
  passed: Boolean(result.passed),
  voteCount: toVoteCount(result.voteCount),
  requiredApproval: Number(result.requiredApproval || 0),
  approvalRate: Number(result.approvalRate || 0),
});

export async function getChallengeVotes(challengeId: string, status?: VoteStatus): Promise<Vote[]> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const params: Record<string, string> = {};
  if (status) params.status = status;

  const response = await client.get<VoteListResponse>(`/challenges/${normalizedChallengeId}/votes`, { params });
  const content = response?.content || [];
  return content.map((item) => mapListItem(normalizedChallengeId, item));
}

export async function getVoteDetail(voteId: string): Promise<Vote> {
  const response = await client.get<VoteDetailResponse>(`/votes/${voteId}`);
  return mapDetail(response);
}

export async function getVoteResult(voteId: string): Promise<VoteResult> {
  const response = await client.get<VoteResultResponse>(`/votes/${voteId}/result`);
  return mapResult(response);
}

export async function createVote(
  challengeId: string,
  data: {
    type: VoteType;
    title: string;
    description?: string;
    targetId?: string;
    deadline: string;
    meetingId?: string;
    amount?: number;
    receiptUrl?: string;
  },
): Promise<Vote> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.post<VoteListItemResponse>(`/challenges/${normalizedChallengeId}/votes`, data);
  return mapListItem(normalizedChallengeId, response);
}

export async function castVote(voteId: string, choice: VoteOption): Promise<CastVoteResponse> {
  return client.put<CastVoteResponse>(`/votes/${voteId}/cast`, { choice });
}
