/**
 * Challenge Hooks
 * 챌린지 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChallenge,
    updateChallenge,
    deleteChallenge,
    leaveChallenge,
    type UpdateChallengeRequest,
} from '@/lib/api/challenge';

/**
 * 챌린지 상세 정보 조회 훅
 */
export function useChallengeDetail(challengeId: string | undefined) {
    return useQuery({
        queryKey: ['challenge', challengeId, 'detail'],
        queryFn: () => getChallenge(challengeId!),
        enabled: !!challengeId,
        staleTime: 1000 * 60 * 10, // 10분 캐시 (자주 변하지 않음)
    });
}

/**
 * 챌린지 수정 훅
 */
export function useUpdateChallenge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateChallengeRequest) => updateChallenge(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['challenge', String(variables.challengeId)] });
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });
}

/**
 * 챌린지 삭제 훅
 */
export function useDeleteChallenge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (challengeId: string) => deleteChallenge(challengeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });
}

/**
 * 챌린지 나가기 훅
 */
export function useLeaveChallenge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (challengeId: string) => leaveChallenge(challengeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
}

