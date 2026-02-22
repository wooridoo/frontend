import { useQuery } from '@tanstack/react-query';
import { getChallengeAccount } from '@/lib/api/ledger';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function useChallengeAccount(challengeId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['challenge', challengeId, 'account'],
    queryFn: () => getChallengeAccount(challengeId!),
    enabled: !!challengeId,
    staleTime: 1000 * 60 * 5, // ?? ??
  });

  return { data, isLoading, error };
}
