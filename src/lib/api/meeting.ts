import type { Meeting } from '@/types/meeting';
import { client } from './client';
import { toApiChallengeId } from './challengeId';

interface BackendMeetingListItem {
  meetingId: string;
  challengeId?: string;
  title: string;
  description?: string;
  status: string;
  meetingDate: string;
  location: string;
  locationDetail?: string;
  attendance?: {
    confirmed: number;
    declined?: number;
    pending?: number;
    total: number;
  };
  myAttendance?: {
    status: string;
    respondedAt?: string;
  };
  members?: Array<{
    userId: string;
    nickname: string;
    profileImage?: string;
  }>;
  createdBy?: {
    userId: string;
    nickname: string;
  };
  createdAt?: string;
}

interface BackendMeetingListResponse {
  meetings?: BackendMeetingListItem[];
  content?: BackendMeetingListItem[];
}

interface BackendMeetingDetailResponse {
  meetingId: string;
  challengeId?: string;
  title: string;
  description?: string;
  status: string;
  meetingDate: string;
  location: string;
  locationDetail?: string;
  attendance?: {
    confirmed: number;
    declined: number;
    pending: number;
    total: number;
  };
  myAttendance?: {
    status: string;
    respondedAt?: string;
  };
  members?: Array<{
    userId: string;
    nickname: string;
    profileImage?: string;
  }>;
  createdBy?: {
    userId: string;
    nickname: string;
  };
  createdAt?: string;
}

type BackendMeetingResponse = BackendMeetingListItem;

const isOnlineLocation = (location?: string, locationDetail?: string) => {
  const locationValue = (location || '').toLowerCase();
  const detailValue = (locationDetail || '').toLowerCase();

  return locationValue === 'online'
    || locationValue.startsWith('http://')
    || locationValue.startsWith('https://')
    || detailValue.startsWith('http://')
    || detailValue.startsWith('https://');
};

const normalizeMeeting = (
  meeting: BackendMeetingResponse
): Meeting => {
  const location = meeting.location || '';
  const isAttendanceVoteSource = location === 'MEETING_ATTENDANCE';
  const isOnline = isOnlineLocation(location, meeting.locationDetail);
  const displayLocation = isAttendanceVoteSource
    ? '출석 투표 연동'
    : isOnline
      ? meeting.locationDetail || '온라인 모임'
      : location;

  return {
    meetingId: String(meeting.meetingId || ''),
    challengeId: meeting.challengeId,
    title: meeting.title || '',
    description: meeting.description || '',
    status: meeting.status || 'SCHEDULED',
    meetingDate: meeting.meetingDate || '',
    location,
    locationDetail: meeting.locationDetail,
    displayLocation,
    isAttendanceVoteSource,
    isOnline,
    attendance: meeting.attendance
      ? {
        confirmed: Number(meeting.attendance.confirmed || 0),
        declined: Number(meeting.attendance.declined || 0),
        pending: Number(meeting.attendance.pending || 0),
        total: Number(meeting.attendance.total || 0),
      }
      : undefined,
    myAttendance: meeting.myAttendance
      ? {
        status: meeting.myAttendance.status || 'NONE',
        respondedAt: meeting.myAttendance.respondedAt,
      }
      : undefined,
    members: meeting.members,
    createdBy: meeting.createdBy,
    createdAt: meeting.createdAt,
  };
};

export async function getMeeting(id: string): Promise<Meeting> {
  const meeting = await client.get<BackendMeetingDetailResponse>(`/meetings/${id}`);
  return normalizeMeeting(meeting);
}

export type MeetingStatusFilter = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'N';

export async function getChallengeMeetings(
  challengeId: string,
  status?: MeetingStatusFilter
): Promise<Meeting[]> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<BackendMeetingListResponse | BackendMeetingListItem[]>(
    `/challenges/${normalizedChallengeId}/meetings`,
    status ? { params: { status } } : undefined
  );

  if (Array.isArray(response)) {
    return response.map(normalizeMeeting);
  }

  const meetings = response.meetings || response.content || [];
  return meetings.map(normalizeMeeting);
}

export async function attendMeeting(meetingId: string, status: 'AGREE' | 'DISAGREE'): Promise<void> {
  await client.post(`/meetings/${meetingId}/attendance`, { choice: status, status });
}

export interface CreateMeetingRequest {
  challengeId: string;
  title: string;
  description?: string;
  meetingDate: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
  maxParticipants?: number;
}

export interface UpdateMeetingRequest {
  meetingId: string;
  title: string;
  description?: string;
  meetingDate: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
  maxParticipants?: number;
}

const mapMeetingPayload = (payload: {
  title: string;
  description?: string;
  meetingDate: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
}) => ({
  title: payload.title,
  description: payload.description,
  meetingDate: payload.meetingDate,
  location: payload.locationType === 'ONLINE' ? 'ONLINE' : payload.location,
  locationDetail: payload.locationType === 'ONLINE' ? payload.location : '',
});

export async function createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
  const normalizedChallengeId = toApiChallengeId(data.challengeId);
  const response = await client.post<BackendMeetingDetailResponse>(
    `/challenges/${normalizedChallengeId}/meetings`,
    mapMeetingPayload(data)
  );
  return normalizeMeeting(response);
}

export async function updateMeeting(data: UpdateMeetingRequest): Promise<Meeting> {
  const response = await client.put<BackendMeetingDetailResponse>(
    `/meetings/${data.meetingId}`,
    mapMeetingPayload(data)
  );
  return normalizeMeeting(response);
}

export async function completeMeeting(meetingId: string, actualAttendees: string[], notes = ''): Promise<void> {
  await client.post(`/meetings/${meetingId}/complete`, {
    actualAttendees,
    notes,
  });
}

export async function respondAttendance(meetingId: string, status: 'AGREE' | 'DISAGREE' | 'PENDING'): Promise<void> {
  await client.post(`/meetings/${meetingId}/attendance`, { choice: status, status });
}
