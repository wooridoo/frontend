import { type Vote, type VoteOption, type VoteType, VoteStatus } from '../../types/domain';
import { client } from './client';

export async function getChallengeVotes(
  challengeId: string,
  status?: VoteStatus
): Promise<Vote[]> {
  const params: any = {};
  if (status) params.status = status;

  const response = await client.get<{ content: Vote[] }>(`/challenges/${challengeId}/votes`, { params });
  return response?.content || [];
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
  return client.post<Vote>(`/challenges/${challengeId}/votes`, data);
}

export async function castVote(voteId: string, choice: VoteOption): Promise<Vote> {
  return client.put<Vote>(`/votes/${voteId}/cast`, { choice });
}
