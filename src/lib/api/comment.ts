/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import type { Comment, CommentAuthor, CreateCommentInput, UpdateCommentInput } from '@/types/comment';

interface BackendComment {
  id?: string;
  commentId?: string;
  content?: string;
  author?: CommentAuthor;
  createdBy?: CommentAuthor;
  likeCount?: number;
  isDeleted?: boolean;
  isLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  parentId?: string | null;
  replies?: BackendComment[];
}

interface CommentResponse {
  comments?: BackendComment[];
  content?: BackendComment[];
}

interface CreateCommentResponse {
  commentId?: string;
  id?: string;
}

interface UpdateCommentResponse {
  commentId?: string;
  id?: string;
  content: string;
  updatedAt?: string;
}

interface ToggleCommentLikeResponse {
  isLiked?: boolean;
  liked?: boolean;
  likeCount?: number;
}

const asDateString = (value?: string): string => {
  if (typeof value === 'string' && value.trim()) return value;
  return new Date().toISOString();
};

const resolveCommentId = (comment: BackendComment): string => {
  const id = comment.id || comment.commentId;
  return typeof id === 'string' ? id : '';
};

const normalizeComment = (comment: BackendComment): Comment => ({
  id: resolveCommentId(comment),
  createdBy: {
    userId: comment.author?.userId ?? comment.createdBy?.userId ?? 'unknown',
    nickname: comment.author?.nickname ?? comment.createdBy?.nickname ?? 'Unknown',
    profileImage: comment.author?.profileImage ?? comment.createdBy?.profileImage,
  },
  content: comment.content ?? '',
  parentId: comment.parentId ?? undefined,
  likeCount: comment.likeCount ?? 0,
  isDeleted: comment.isDeleted ?? false,
  isLiked: comment.isLiked ?? false,
  createdAt: asDateString(comment.createdAt),
  updatedAt: comment.updatedAt,
  replies: comment.replies?.map(normalizeComment) ?? [],
});

const flattenComments = (comments: Comment[]): Comment[] => {
  const flat: Comment[] = [];
  const stack = [...comments];

  while (stack.length > 0) {
    const current = stack.shift();
    if (!current || !current.id) continue;

    flat.push({
      ...current,
      replies: [],
    });

    if (current.replies && current.replies.length > 0) {
      stack.unshift(...current.replies);
    }
  }

  return flat;
};

const sortByCreatedAt = (a: Comment, b: Comment) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const buildCommentTree = (comments: Comment[]): Comment[] => {
  const flat = flattenComments(comments).sort(sortByCreatedAt);
  const map = new Map<string, Comment>();

  flat.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  const roots: Comment[] = [];
  map.forEach((comment) => {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId)!.replies!.push(comment);
      return;
    }
    roots.push(comment);
  });

  const sortTree = (nodes: Comment[]) => {
    nodes.sort(sortByCreatedAt);
    nodes.forEach((node) => {
      if (node.replies && node.replies.length > 0) {
        sortTree(node.replies);
      }
    });
  };

  sortTree(roots);
  return roots;
};

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

  const normalizedList = list
    .map(normalizeComment)
    .filter(comment => Boolean(comment.id));

  return buildCommentTree(normalizedList);
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

export async function toggleCommentLike(
  challengeId: string,
  postId: string,
  commentId: string,
): Promise<ToggleCommentLikeResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.post<ToggleCommentLikeResponse>(
    `/challenges/${normalizedChallengeId}/posts/${postId}/comments/${commentId}/like`,
  );
}
