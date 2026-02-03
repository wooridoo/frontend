import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallengeMeetings, getMeeting, attendMeeting } from '@/lib/api/meeting';

export function useMeeting(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['meeting', id],
    queryFn: () => getMeeting(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return { data, isLoading, error };
}

export function useChallengeMeetings(challengeId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['challenge', challengeId, 'meetings'],
    queryFn: () => getChallengeMeetings(challengeId!),
    enabled: !!challengeId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Provide fallback empty array to match previous API behavior
  return { data: data || [], isLoading, error };
}

export function useAttendMeeting() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ meetingId, status }: { meetingId: string; status: 'ATTENDING' | 'ABSENT' }) =>
      attendMeeting(meetingId, status),
    onSuccess: (_, { meetingId }) => {
      // Invalidate meeting detail and challenge meetings list
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    }
  });

  // Wrapper to match previous signature (approx) or easier usage
  const mutate = (meetingId: string, status: 'ATTENDING' | 'ABSENT') =>
    mutateAsync({ meetingId, status });

  return { mutate, isPending };
}
