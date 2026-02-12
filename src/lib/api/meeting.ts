import type { Meeting } from '@/types/meeting';
import { client } from './client';

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
  const response = await client.get<Meeting[] | MeetingResponse>(`/challenges/${challengeId}/meetings`);

  if (Array.isArray(response)) {
    return response;
  }
  return response.meetings || response.content || [];
}

export async function attendMeeting(meetingId: string, status: 'ATTENDING' | 'ABSENT'): Promise<void> {
  await client.post(`/meetings/${meetingId}/attendance`, { status });
}

// --- Additional Meeting API Functions ---

export interface CreateMeetingRequest {
  challengeId: string;
  title: string;
  description?: string;
  meetingDateTime: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
  maxParticipants: number;
}

export interface UpdateMeetingRequest {
  meetingId: string;
  title: string;
  description?: string;
  meetingDateTime: string;
  locationType: 'OFFLINE' | 'ONLINE';
  location: string;
  maxParticipants: number;
}

export async function createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
  return client.post<Meeting>(`/challenges/${data.challengeId}/meetings`, data);
}

export async function updateMeeting(data: UpdateMeetingRequest): Promise<Meeting> {
  return client.put<Meeting>(`/meetings/${data.meetingId}`, data);
}

export async function completeMeeting(meetingId: string): Promise<void> {
  await client.post(`/meetings/${meetingId}/complete`);
}

export async function respondAttendance(meetingId: string, status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'): Promise<void> {
  await client.post(`/meetings/${meetingId}/attendance`, { status });
}

