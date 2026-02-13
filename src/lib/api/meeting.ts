import type { Meeting } from '@/types/meeting';
import { client } from './client';
import { toApiChallengeId } from './challengeId';

// Default to MOCK if not explicitly disabled
// const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // REMOVED

export async function getMeeting(id: string): Promise<Meeting> {
  // client.get returns the unwrapped 'data' object from the API response
  const meeting = await client.get<Meeting>(`/meetings/${id}`);
  return meeting;
}


interface MeetingResponse {
  meetings?: Meeting[];
  content?: Meeting[];
}

export async function getChallengeMeetings(challengeId: string): Promise<Meeting[]> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const response = await client.get<Meeting[] | MeetingResponse>(`/challenges/${normalizedChallengeId}/meetings`);

  if (Array.isArray(response)) {
    return response;
  }
  return response.meetings || response.content || [];
}

export async function attendMeeting(meetingId: string, status: 'AGREE' | 'DISAGREE'): Promise<void> {
  await client.post(`/meetings/${meetingId}/attendance`, { status });
}

// --- Additional Meeting API Functions ---

export interface CreateMeetingRequest {
  challengeId: string;
  title: string;
  description?: string;
  meetingDate: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
  maxParticipants: number;
}

export interface UpdateMeetingRequest {
  meetingId: string;
  title: string;
  description?: string;
  meetingDate: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
  maxParticipants: number;
}

export async function createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
  const normalizedChallengeId = toApiChallengeId(data.challengeId);
  return client.post<Meeting>(`/challenges/${normalizedChallengeId}/meetings`, data);
}

export async function updateMeeting(data: UpdateMeetingRequest): Promise<Meeting> {
  return client.put<Meeting>(`/meetings/${data.meetingId}`, data);
}

export async function completeMeeting(meetingId: string): Promise<void> {
  await client.post(`/meetings/${meetingId}/complete`);
}

export async function respondAttendance(meetingId: string, status: 'AGREE' | 'DISAGREE' | 'PENDING'): Promise<void> {
  await client.post(`/meetings/${meetingId}/attendance`, { status });
}

