import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  attendMeeting,
  completeMeeting,
  createMeeting,
  getChallengeMeetings,
  type MeetingStatusFilter,
  getMeeting,
  respondAttendance,
  updateMeeting,
  type CreateMeetingRequest,
  type UpdateMeetingRequest,
} from '@/lib/api/meeting';

/**
 * 단일 모임 상세 정보를 조회합니다.
 */
export function useMeeting(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['meeting', id],
    queryFn: () => getMeeting(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
}

/**
 * 챌린지의 모임 목록을 조회합니다.
 */
export function useChallengeMeetings(challengeId?: string, status?: MeetingStatusFilter) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['challenge', challengeId, 'meetings', status],
    queryFn: () => getChallengeMeetings(challengeId!, status),
    enabled: !!challengeId,
    staleTime: 1000 * 60 * 5,
  });

  return { data: data || [], isLoading, error };
}

/**
 * 참석/불참 응답 mutation입니다.
 * 성공 시 모임 상세와 챌린지 관련 쿼리를 함께 무효화합니다.
 */
export function useAttendMeeting() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ meetingId, status }: { meetingId: string; status: 'AGREE' | 'DISAGREE' }) =>
      attendMeeting(meetingId, status),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });

  const mutate = (meetingId: string, status: 'AGREE' | 'DISAGREE') => mutateAsync({ meetingId, status });

  return { mutate, isPending };
}

/**
 * 모임 생성 mutation입니다.
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingRequest) => createMeeting(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challenge', variables.challengeId, 'meetings'] });
    },
  });
}

/**
 * 모임 수정 mutation입니다.
 */
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

/**
 * 모임 완료 처리 mutation입니다.
 */
export function useCompleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      meetingId,
      actualAttendees,
      notes,
    }: {
      meetingId: string;
      actualAttendees: string[];
      notes?: string;
    }) => completeMeeting(meetingId, actualAttendees, notes),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },
  });
}

/**
 * 참석 상태 응답 mutation입니다.
 */
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

