/**
 * Feed API Module
 * Vote 패턴 기반 구현
 */
import { ChallengeRole } from '@/types/enums';
import { useAuthStore } from '@/store/useAuthStore';

// =====================
// Types
// =====================
export interface PostAuthor {
    userId?: number;
    name: string;
    avatar: string;
    role?: typeof ChallengeRole[keyof typeof ChallengeRole];
}

export interface Comment {
    commentId: number;
    author: PostAuthor;
    content: string;
    createdAt: string;
}

export interface Post {
    id: number;
    challengeId: number;
    author: PostAuthor;
    content: string;
    images?: string[];
    createdAt: string;
    likes: number;
    comments: number;
    isNotice?: boolean;
    isLikedByMe?: boolean;
}

export interface CreatePostInput {
    content: string;
    images?: string[];
    isNotice?: boolean;
}

// =====================
// Mock Data
// =====================
const MOCK_POSTS: Post[] = [
    {
        id: 1,
        challengeId: 1,
        author: { userId: 1, name: '김철수', avatar: 'https://i.pravatar.cc/150?u=1', role: ChallengeRole.LEADER },
        content: '📢 2월 정기모임 장소가 변경되었습니다!\n강남역 → 선릉역 스터디카페로 변경됩니다. 참석 여부 투표 부탁드려요~',
        createdAt: '1시간 전',
        likes: 8,
        comments: 3,
        isNotice: true,
        isLikedByMe: false,
    },
    {
        id: 2,
        challengeId: 1,
        author: { userId: 2, name: '이영희', avatar: 'https://i.pravatar.cc/150?u=2', role: ChallengeRole.FOLLOWER },
        content: '이번 주 독서 인증합니다! 📚\n"클린 코드" 완독했어요. 다음 달 모임에서 후기 나눠요~',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
        createdAt: '2시간 전',
        likes: 12,
        comments: 5,
        isLikedByMe: true,
    },
    {
        id: 3,
        challengeId: 1,
        author: { userId: 3, name: '박민수', avatar: 'https://i.pravatar.cc/150?u=3', role: ChallengeRole.FOLLOWER },
        content: '다음 달에 읽을 책 추천받습니다!\n개발 관련 책이면 좋을 것 같아요. 어떤 책이 좋을까요?',
        createdAt: '5시간 전',
        likes: 6,
        comments: 14,
        isLikedByMe: false,
    }
];

// =====================
// Error Types (Vote 패턴 동일)
// =====================
export class FeedApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// =====================
// API Functions
// =====================

/**
 * 피드 목록 조회
 */
export async function getFeed(challengeId: string): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const { isLoggedIn, user } = useAuthStore.getState();

    if (!isLoggedIn || !user) {
        throw new FeedApiError('로그인이 필요합니다.', 401);
    }

    const targetId = parseInt(challengeId, 10);
    const isParticipant = user.participatingChallengeIds?.includes(targetId);

    if (!isParticipant) {
        throw new FeedApiError('해당 챌린지에 참여하지 않았습니다.', 403);
    }

    return MOCK_POSTS.filter(p => p.challengeId === targetId);
}

/**
 * 게시글 상세 조회
 */
export async function getPost(postId: number): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const post = MOCK_POSTS.find(p => p.id === postId);
    if (!post) {
        throw new FeedApiError('게시글을 찾을 수 없습니다.', 404);
    }

    return post;
}

/**
 * 게시글 작성
 */
export async function createPost(challengeId: string, data: CreatePostInput): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const { user } = useAuthStore.getState();

    const newPost: Post = {
        id: Date.now(),
        challengeId: Number(challengeId),
        author: {
            userId: user?.userId,
            name: user?.nickname || 'Unknown',
            avatar: user?.profileImage || 'https://i.pravatar.cc/150?u=default',
            role: ChallengeRole.FOLLOWER
        },
        content: data.content,
        images: data.images,
        createdAt: '방금 전',
        likes: 0,
        comments: 0,
        isNotice: data.isNotice,
        isLikedByMe: false,
    };

    MOCK_POSTS.unshift(newPost);
    return newPost;
}

/**
 * 게시글 수정
 */
export async function updatePost(postId: number, data: Partial<CreatePostInput>): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const postIndex = MOCK_POSTS.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        throw new FeedApiError('게시글을 찾을 수 없습니다.', 404);
    }

    MOCK_POSTS[postIndex] = {
        ...MOCK_POSTS[postIndex],
        ...data,
    };

    return MOCK_POSTS[postIndex];
}

/**
 * 게시글 삭제
 */
export async function deletePost(postId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const postIndex = MOCK_POSTS.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        throw new FeedApiError('게시글을 찾을 수 없습니다.', 404);
    }

    MOCK_POSTS.splice(postIndex, 1);
}

/**
 * 좋아요 토글
 */
export async function toggleLike(postId: number): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const postIndex = MOCK_POSTS.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        throw new FeedApiError('게시글을 찾을 수 없습니다.', 404);
    }

    const post = MOCK_POSTS[postIndex];
    const newLikedState = !post.isLikedByMe;

    MOCK_POSTS[postIndex] = {
        ...post,
        isLikedByMe: newLikedState,
        likes: newLikedState ? post.likes + 1 : post.likes - 1,
    };

    return MOCK_POSTS[postIndex];
}
