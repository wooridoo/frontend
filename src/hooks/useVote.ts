import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallengeVotes, getVoteDetail, getVoteResult, createVote, castVote } from '../lib/api/vote';
import type { VoteStatus, VoteOption, VoteType } from '../types/domain';

export function useVotes(challengeId: string, status?: VoteStatus) {
  return useQuery({
    queryKey: ['votes', challengeId, status],
    queryFn: () => getChallengeVotes(challengeId, status),
    enabled: !!challengeId,
  });
}

export function useVoteDetail(voteId: string) {
  return useQuery({
    queryKey: ['vote', voteId],
    queryFn: () => getVoteDetail(voteId),
    enabled: !!voteId,
  });
}

export function useVoteResult(voteId: string, enabled = true) {
  return useQuery({
    queryKey: ['vote', voteId, 'result'],
    queryFn: () => getVoteResult(voteId),
    enabled: !!voteId && enabled,
  });
}

export function useCreateVote(challengeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      type: VoteType;
      title: string;
      description?: string;
      targetId?: string;
      deadline: string;
      meetingId?: string;
      amount?: number;
      receiptUrl?: string;
    }) => createVote(challengeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', challengeId] });
    },
  });
}

export function useCastVote(voteId: string, challengeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (choice: VoteOption) => castVote(voteId, choice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vote', voteId] });
      queryClient.invalidateQueries({ queryKey: ['votes', challengeId] });
    },
  });
}
