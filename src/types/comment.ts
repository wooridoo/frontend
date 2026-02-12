import type { User } from './user';

/**
 * 댓글 (Comment) Domain Types
 */
export interface Comment {
  id: string;
  postId: string;
  createdBy: User;
  content: string;
  parentId?: string;     // 대댓글용
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];   // 서버에서 nested 제공 시
}

export interface CreateCommentInput {
  content: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}
