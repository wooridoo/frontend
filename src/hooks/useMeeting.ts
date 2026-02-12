import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChallengeMeetings,
  getMeeting,
  attendMeeting,
  createMeeting,
  updateMeeting,
  completeMeeting,
  respondAttendance,
  type CreateMeetingRequest,
  type UpdateMeetingRequest,
} from '@/lib/api/meeting';

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
    mutationFn: ({ meetingId, status }: { meetingId: string; status: 'AGREE' | 'DISAGREE' }) =>
      attendMeeting(meetingId, status),
    onSuccess: (_, { meetingId }) => {
      // Invalidate meeting detail and challenge meetings list
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    }
  });

  // Wrapper to match previous signature (approx) or easier usage
  const mutate = (meetingId: string, status: 'AGREE' | 'DISAGREE') =>
    mutateAsync({ meetingId, status });

  return { mutate, isPending };
}

// --- Additional Meeting Hooks ---

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingRequest) => createMeeting(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challenge', variables.challengeId, 'meetings'] });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMeetingRequest) => updateMeeting(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.meetingId] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });
}

export function useCompleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => completeMeeting(meetingId),
    onSuccess: (_, meetingId) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });
}

export function useRespondAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, status }: { meetingId: string; status: 'AGREE' | 'DISAGREE' | 'PENDING' }) =>
      respondAttendance(meetingId, status),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
    },
  });
}

