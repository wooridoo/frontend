import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallengeVotes, getVoteDetail, createVote, castVote } from '../lib/api/vote';
import type { VoteStatus, VoteOption } from '../types/domain';

export function useVotes(challengeId: string, status?: VoteStatus) {
  return useQuery({
    queryKey: ['votes', challengeId, status],
    queryFn: () => getChallengeVotes(challengeId, status),
    enabled: !!challengeId,
  });
}

export function useVoteDetail(voteId: number) {
  return useQuery({
    queryKey: ['vote', voteId],
    queryFn: () => getVoteDetail(voteId),
    enabled: !!voteId,
  });
}

export function useCreateVote(challengeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      type: 'EXPENSE' | 'KICK' | 'LEADER_KICK' | 'DISSOLVE';
      title: string;
      description?: string;
      targetId?: number;
      deadline: string;
    }) => createVote(challengeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', challengeId] });
    },
  });
}

export function useCastVote(voteId: number, challengeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (choice: VoteOption) => castVote(voteId, choice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vote', voteId] });
      queryClient.invalidateQueries({ queryKey: ['votes', challengeId] });
    },
  });
}
