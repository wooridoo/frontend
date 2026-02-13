import { type Vote, type VoteOption, type VoteType, VoteStatus } from '../../types/domain';
import { client } from './client';
import { toApiChallengeId } from './challengeId';


interface VoteResponse {
  votes?: Vote[];
  content?: Vote[];
}

export async function getChallengeVotes(
  challengeId: string,
  status?: VoteStatus
): Promise<Vote[]> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const params: Record<string, string> = {};
  if (status) params.status = status;

  const response = await client.get<Vote[] | VoteResponse>(`/challenges/${normalizedChallengeId}/votes`, { params });

  if (Array.isArray(response)) {
    return response;
  }
  return response.votes || response.content || [];
}

export async function getVoteDetail(voteId: string): Promise<Vote> {
  const vote = await client.get<Vote>(`/votes/${voteId}`);
  return vote;
}

export async function createVote(
  challengeId: string,
  data: {
    type: VoteType;
    title: string;
    description?: string;
    targetId?: string;
    deadline: string;
    meetingId?: string; // Added meetingId support
  }
): Promise<Vote> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.post<Vote>(`/challenges/${normalizedChallengeId}/votes`, data);
}

export async function castVote(voteId: string, choice: VoteOption): Promise<Vote> {
  return client.put<Vote>(`/votes/${voteId}/cast`, { choice });
}
