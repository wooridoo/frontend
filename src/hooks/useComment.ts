/**
 * Comment hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, updateComment, deleteComment } from '@/lib/api/comment';
import type { CreateCommentInput, UpdateCommentInput } from '@/types/comment';

export function useComments(challengeId: string | undefined, postId: string | undefined) {
  return useQuery({
    queryKey: ['comments', challengeId, postId],
    queryFn: () => getComments(challengeId!, postId!),
    enabled: !!challengeId && !!postId,
  });
}

export function useCreateComment(challengeId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createComment(challengeId, postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', challengeId, postId] });
      queryClient.invalidateQueries({ queryKey: ['post', challengeId, postId] });
      queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
    },
  });
}

export function useUpdateComment(challengeId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentInput }) =>
      updateComment(challengeId, postId, commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', challengeId, postId] });
    },
  });
}

export function useDeleteComment(challengeId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(challengeId, postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', challengeId, postId] });
      queryClient.invalidateQueries({ queryKey: ['post', challengeId, postId] });
      queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
    },
  });
}
