/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, updateComment, deleteComment, toggleCommentLike } from '@/lib/api/comment';
import type { CreateCommentInput, UpdateCommentInput } from '@/types/comment';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useComments(
  challengeId: string | undefined,
  postId: string | undefined,
  options?: {
    page?: number;
    size?: number;
    enabled?: boolean;
  },
) {
  const page = options?.page ?? 0;
  const size = options?.size ?? 50;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ['comments', challengeId, postId, page, size],
    queryFn: () => getComments(challengeId!, postId!, page, size),
    enabled: !!challengeId && !!postId && enabled,
  });
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useToggleCommentLike(challengeId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => toggleCommentLike(challengeId, postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', challengeId, postId] });
      queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
    },
  });
}
