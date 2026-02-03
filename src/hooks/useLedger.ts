import { useQuery } from '@tanstack/react-query';
import { getChallengeAccount } from '@/lib/api/ledger';

export function useChallengeAccount(challengeId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['challenge', challengeId, 'account'],
    queryFn: () => getChallengeAccount(challengeId!),
    enabled: !!challengeId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return { data, isLoading, error };
}
