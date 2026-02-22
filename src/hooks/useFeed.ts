/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeed, getPost, createPost, updatePost, deletePost, toggleLike, setPostPinned } from '@/lib/api/feed';
import type { Post, CreatePostInput } from '@/types/feed';

/**
 * 피드 목록 조회 훅
 */
export function useFeed(challengeId: string | undefined) {
    return useQuery({
        queryKey: ['feed', challengeId],
        queryFn: () => getFeed(challengeId!),
        enabled: !!challengeId,
        retry: false,
    });
}

/**
 * 게시글 상세 조회 훅
 */
/**
 * 게시글 상세 조회 훅
 */
export function usePost(challengeId: string | undefined, postId: string | undefined) {
    return useQuery({
        queryKey: ['post', challengeId, postId],
        queryFn: () => getPost(challengeId!, postId!),
        enabled: !!challengeId && !!postId,
    });
}

/**
 * 게시글 작성 훅
 */
export function useCreatePost(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostInput) => createPost(challengeId, data),
        onSuccess: () => {
            // 피드 목록 갱신
            queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
        },
    });
}

/**
 * 게시글 수정 훅
 */
export function useUpdatePost(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: Partial<CreatePostInput> }) =>
            updatePost(challengeId, postId, data),
        onSuccess: (updatedPost) => {
            // 피드 목록 갱신
            queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
            // 개별 게시글 캐시 업데이트
            queryClient.setQueryData(['post', challengeId, updatedPost.id], updatedPost);
        },
    });
}

/**
 * 게시글 삭제 훅
 */
export function useDeletePost(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => deletePost(challengeId, postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
        },
    });
}

/**
 * 좋아요 토글 훅
 */
export function useToggleLike(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => toggleLike(challengeId, postId),
        onSuccess: (response) => {
            // 보조 처리
            queryClient.setQueryData<Post[]>(['feed', challengeId], (oldPosts) => {
                if (!oldPosts) return oldPosts;
                return oldPosts.map(post =>
                    post.id === response.postId ? {
                        ...post,
                        isLiked: response.liked,
                        likeCount: response.likeCount
                    } : post
                );
            });
        },
    });
}

/**
 * 게시글 고정/해제 훅
 */
export function useSetPostPinned(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, pinned }: { postId: string; pinned: boolean }) =>
            setPostPinned(challengeId, postId, pinned),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
        },
    });
}
