/**
 * Member Hooks
 * Vote hooks 패턴 기반 구현
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChallengeMembers,
    getMember,
    delegateLeader,
} from '@/lib/api/member';
import type { MemberStatus } from '@/types/member';

/**
 * 멤버 목록 조회 훅
 */
export function useMembers(
    challengeId: string | undefined,
    status?: MemberStatus
) {
    return useQuery({
        queryKey: ['members', challengeId, status],
        queryFn: () => getChallengeMembers(challengeId!, status),
        enabled: !!challengeId,
    });
}

/**
 * 멤버 상세 조회 훅
 */
export function useMember(
    challengeId: string | undefined,
    memberId: number | undefined
) {
    return useQuery({
        queryKey: ['member', challengeId, memberId],
        queryFn: () => getMember(challengeId!, memberId!),
        enabled: !!challengeId && !!memberId,
    });
}

/**
 * 리더 위임 훅
 */
export function useDelegateLeader(challengeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (targetMemberId: number) =>
            delegateLeader(challengeId, targetMemberId),
        onSuccess: () => {
            // 멤버 목록 갱신 (역할 변경 반영)
            queryClient.invalidateQueries({ queryKey: ['members', challengeId] });
        },
    });
}
