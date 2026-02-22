/**
    * 동작 설명은 추후 세분화 예정입니다.
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
