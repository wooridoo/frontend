/**
 * Feed API Module
 * Vote 패턴 기반 구현
 */
import { client } from './client';
import type { Post, PostLikeResponse } from '@/types/feed';

// =====================
// Types
// =====================
export interface CreatePostInput {
    title: string;
    content: string;
    category?: string; // e.g. 'NOTICE', 'GENERAL'
    images?: string[];
}

// =====================
// API Functions
// =====================


interface FeedResponse {
    posts?: Post[];
    content?: Post[];
}

/**
 * 피드 목록 조회
 */
import { normalizePost } from '@/lib/utils/dataMappers';

/**
 * 피드 목록 조회
 */
export async function getFeed(challengeId: string): Promise<Post[]> {
    const response = await client.get<Post[] | FeedResponse>(`/challenges/${challengeId}/posts`);

    const list = Array.isArray(response)
        ? response
        : (response.posts || response.content || []);

    return list.map(normalizePost);
}

/**
 * 게시글 상세 조회
 */
export async function getPost(postId: string): Promise<Post> {
    const post = await client.get<Post>(`/posts/${postId}`);
    return normalizePost(post);
}

/**
 * 게시글 작성
 */
export async function createPost(challengeId: string, data: CreatePostInput): Promise<Post> {
    return client.post<Post>(`/challenges/${challengeId}/posts`, data);
}

/**
 * 게시글 수정
 */
export async function updatePost(challengeId: string, postId: string, data: Partial<CreatePostInput>): Promise<Post> {
    // Signature change from (postId, data) to (challengeId, postId, data) to match likely URL structure?
    // Previous mock: updatePost(postId, data)
    // Backend likely: PUT /challenges/{id}/posts/{id}
    return client.put<Post>(`/challenges/${challengeId}/posts/${postId}`, data);
}

/**
 * 게시글 삭제
 */
export async function deletePost(challengeId: string, postId: string): Promise<void> {
    await client.delete(`/challenges/${challengeId}/posts/${postId}`);
}

/**
 * 좋아요 토글
 */
export async function toggleLike(challengeId: string, postId: string): Promise<PostLikeResponse> {
    return client.post<PostLikeResponse>(`/challenges/${challengeId}/posts/${postId}/like`);
}
