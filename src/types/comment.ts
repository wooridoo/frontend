/**
 * Comment domain types
 */
export interface CommentAuthor {
  userId: string;
  nickname: string;
  profileImage?: string;
}

export interface Comment {
  id: string;
  postId?: string;
  createdBy: CommentAuthor;
  content: string;
  parentId?: string;
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface CreateCommentInput {
  content: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}
