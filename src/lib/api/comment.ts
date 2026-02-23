/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import type { Comment, CommentAuthor, CreateCommentInput, UpdateCommentInput } from '@/types/comment';

interface BackendComment {
  id: string;
  content: string;
  author?: CommentAuthor;
  likeCount?: number;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: BackendComment[];
}

interface CommentResponse {
  comments?: BackendComment[];
  content?: BackendComment[];
}

interface CreateCommentResponse {
  commentId: string;
}

interface UpdateCommentResponse {
  commentId: string;
  content: string;
  updatedAt?: string;
}

const normalizeComment = (comment: BackendComment): Comment => ({
  id: comment.id,
  createdBy: {
    userId: comment.author?.userId ?? 'unknown',
    nickname: comment.author?.nickname ?? 'Unknown',
    profileImage: comment.author?.profileImage,
  },
  content: comment.content,
  parentId: comment.parentId,
  likeCount: comment.likeCount ?? 0,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  replies: comment.replies?.map(normalizeComment),
});

export async function getComments(
  challengeId: string,
  postId: string,
  page = 0,
  size = 50,
): Promise<Comment[]> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<BackendComment[] | CommentResponse>(
    `/challenges/${normalizedChallengeId}/posts/${postId}/comments`,
    { params: { page, size } }
  );

  const list = Array.isArray(response)
    ? response
    : (response.comments || response.content || []);

  return list.map(normalizeComment);
}

export async function createComment(
  challengeId: string,
  postId: string,
  data: CreateCommentInput
): Promise<CreateCommentResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const payload = {
    content: data.content,
    parentId: data.parentId,
    parentCommentId: data.parentId,
  };
  return client.post<CreateCommentResponse>(
    `/challenges/${normalizedChallengeId}/posts/${postId}/comments`,
    payload
  );
}

export async function updateComment(
  challengeId: string,
  postId: string,
  commentId: string,
  data: UpdateCommentInput
): Promise<UpdateCommentResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.put<UpdateCommentResponse>(
    `/challenges/${normalizedChallengeId}/posts/${postId}/comments/${commentId}`,
    data
  );
}

export async function deleteComment(
  challengeId: string,
  postId: string,
  commentId: string
): Promise<void> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  await client.delete(`/challenges/${normalizedChallengeId}/posts/${postId}/comments/${commentId}`);
}
