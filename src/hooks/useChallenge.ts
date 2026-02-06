/**
 * Challenge Hooks
 * 챌린지 관련 React Query 훅
 */
import { useQuery } from '@tanstack/react-query';
import { getChallenge } from '@/lib/api/challenge';

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
