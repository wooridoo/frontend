/**
 * Feed API Module
 * Vote 패턴 기반 구현
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import type { Post, PostLikeResponse, PostPinResponse } from '@/types/feed';

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
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const response = await client.get<Post[] | FeedResponse>(`/challenges/${normalizedChallengeId}/posts`);

    const list = Array.isArray(response)
        ? response
        : (response.posts || response.content || []);

    return list.map(normalizePost);
}

/**
 * 게시글 상세 조회
 */
export async function getPost(challengeId: string, postId: string): Promise<Post> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    const post = await client.get<Post>(`/challenges/${normalizedChallengeId}/posts/${postId}`);
    return normalizePost(post);
}

/**
 * 게시글 작성
 */
export async function createPost(challengeId: string, data: CreatePostInput): Promise<Post> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.post<Post>(`/challenges/${normalizedChallengeId}/posts`, data);
}

/**
 * 게시글 수정
 */
export async function updatePost(challengeId: string, postId: string, data: Partial<CreatePostInput>): Promise<Post> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.put<Post>(`/challenges/${normalizedChallengeId}/posts/${postId}`, data);
}

/**
 * 게시글 삭제
 */
export async function deletePost(challengeId: string, postId: string): Promise<void> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    await client.delete(`/challenges/${normalizedChallengeId}/posts/${postId}`);
}

/**
 * 좋아요 토글
 */
export async function toggleLike(challengeId: string, postId: string): Promise<PostLikeResponse> {
    const normalizedChallengeId = toApiChallengeId(challengeId);
    return client.post<PostLikeResponse>(`/challenges/${normalizedChallengeId}/posts/${postId}/like`);
}

/**
 * 공지 고정/해제
 */
export async function setPostPinned(
  challengeId: string,
  postId: string,
  pinned: boolean,
): Promise<PostPinResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.put<PostPinResponse>(`/challenges/${normalizedChallengeId}/posts/${postId}/pin`, { pinned });
}
