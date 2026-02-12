/**
 * Comment Hooks
 * 댓글 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, updateComment, deleteComment } from '@/lib/api/comment';
import type { CreateCommentInput, UpdateCommentInput } from '@/types/comment';

/**
 * 댓글 목록 조회 훅
 */
export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId!),
    enabled: !!postId,
  });
}

/**
 * 댓글 작성 훅
 */
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      // 게시글의 commentCount도 갱신
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

/**
 * 댓글 수정 훅
 */
export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentInput }) =>
      updateComment(postId, commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

/**
 * 댓글 삭제 훅
 */
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
