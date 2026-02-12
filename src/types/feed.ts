import { PostCategory } from './enums';
import type { User } from './user';

/**
 * SNS Domain Types
 */
export interface Post {
    id: string; // UUID
    challengeId?: string;
    createdBy: User; // or just userId? Typically expanded in frontend
    title?: string;
    content: string;
    category: PostCategory;
    isNotice: boolean;
    isPinned: boolean;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    images?: string[]; // Simplified for now
    createdAt: string;
}

export interface CreatePostInput {
    title: string;
    content: string;
    category?: string;
    images?: string[];
}
