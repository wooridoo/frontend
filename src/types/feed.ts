import { PostCategory } from './enums';
import type { User } from './user';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export interface Post {
    id: string; // ?? ??
    challengeId?: string;
    createdBy: User; // ?? ??
    title?: string;
    content: string;
    category: PostCategory;
    isNotice: boolean;
    isPinned: boolean;
    isLiked?: boolean;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    images?: string[]; // ?? ??
    createdAt: string;
}

export interface CreatePostInput {
    title: string;
    content: string;
    category?: string;
    imageUrls?: string[];
    images?: string[];
}

export interface PostLikeResponse {
    postId: string;
    liked: boolean;
    likeCount: number;
}

export interface PostPinResponse {
    postId: string;
    isPinned: boolean;
    pinnedAt?: string;
}
