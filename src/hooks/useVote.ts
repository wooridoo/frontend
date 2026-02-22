import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallengeVotes, getVoteDetail, getVoteResult, createVote, castVote } from '../lib/api/vote';
import type { VoteStatus, VoteOption, VoteType } from '../types/domain';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useVotes(challengeId: string, status?: VoteStatus) {
  return useQuery({
    queryKey: ['votes', challengeId, status],
    queryFn: () => getChallengeVotes(challengeId, status),
    enabled: !!challengeId,
  });
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useVoteDetail(voteId: string) {
  return useQuery({
    queryKey: ['vote', voteId],
    queryFn: () => getVoteDetail(voteId),
    enabled: !!voteId,
  });
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useVoteResult(voteId: string, enabled = true) {
  return useQuery({
    queryKey: ['vote', voteId, 'result'],
    queryFn: () => getVoteResult(voteId),
    enabled: !!voteId && enabled,
  });
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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
