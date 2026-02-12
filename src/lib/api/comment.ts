/**
 * Comment API Module
 * 게시글 댓글 CRUD
 */
import { client } from './client';
import type { Comment, CreateCommentInput, UpdateCommentInput } from '@/types/comment';


interface CommentResponse {
  comments?: Comment[];
  content?: Comment[];
}

/**
 * 댓글 목록 조회
 */
export async function getComments(postId: string): Promise<Comment[]> {
  const response = await client.get<Comment[] | CommentResponse>(`/posts/${postId}/comments`);

  if (Array.isArray(response)) {
    return response;
  }
  return response.comments || response.content || [];
}

/**
 * 댓글 작성
 */
export async function createComment(postId: string, data: CreateCommentInput): Promise<Comment> {
  return client.post<Comment>(`/posts/${postId}/comments`, data);
}

/**
 * 댓글 수정
 */
export async function updateComment(postId: string, commentId: string, data: UpdateCommentInput): Promise<Comment> {
  return client.put<Comment>(`/posts/${postId}/comments/${commentId}`, data);
}

/**
 * 댓글 삭제
 */
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await client.delete(`/posts/${postId}/comments/${commentId}`);
}
