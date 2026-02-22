/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChallenge,
    updateChallenge,
    deleteChallenge,
    leaveChallenge,
    updateSupportSettings,
    createChallenge,
    type UpdateChallengeRequest,
    type CreateChallengeRequest,
} from '@/lib/api/challenge';

/**
 * 챌린지 상세 정보 조회 훅
 */
export function useChallengeDetail(challengeId: string | undefined) {
    return useQuery({
        queryKey: ['challenge', challengeId, 'detail'],
        queryFn: () => getChallenge(challengeId!),
        enabled: !!challengeId,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * 챌린지 생성 훅
 */
export function useCreateChallenge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChallengeRequest) => createChallenge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
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

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useUpdateSupportSettings(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { autoPayEnabled: boolean }) => updateSupportSettings(challengeId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenge', challengeId, 'detail'] });
            queryClient.invalidateQueries({ queryKey: ['challenge', challengeId, 'account'] });
        },
    });
}

