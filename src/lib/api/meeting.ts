import type { Meeting } from '@/types/domain';
import { client } from './client';

// Default to MOCK if not explicitly disabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Mock Data (Moved from inline or separate file if needed, keeping inline for now as per plan)
const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    challengeId: '1',
    title: '1차 정기모임: 오리엔테이션',
    description: '챌린지 시작을 알리는 오리엔테이션입니다. 서로 인사하고 목표를 공유해요!',
    date: '2026-02-10T19:00:00',
    location: '강남구 테헤란로 123 스타벅스',
    isOnline: false,
    maxMembers: 20,
    currentMembers: 5,
    status: 'SCHEDULED',
    myStatus: 'ATTENDING',
    members: [
      { userId: 1, nickname: '김철수', status: 'ATTENDING', profileImage: 'https://i.pravatar.cc/150?u=1' },
      { userId: 2, nickname: '이영희', status: 'ATTENDING', profileImage: 'https://i.pravatar.cc/150?u=2' },
      { userId: 3, nickname: '박민수', status: 'PENDING', profileImage: 'https://i.pravatar.cc/150?u=3' },
    ]
  },
  {
    id: '2',
    challengeId: '1',
    title: '2차 정기모임: 중간 점검',
    description: '벌써 절반이 지났습니다. 중간 점검을 통해 서로를 격려합시다.',
    date: '2026-02-24T19:00:00',
    location: 'Zoom (링크 추후 공지)',
    isOnline: true,
    maxMembers: 20,
    currentMembers: 0,
    status: 'SCHEDULED',
    myStatus: 'NONE'
  },
  {
    id: '3',
    challengeId: '2',
    title: '영어 회화 스터디 1회차',
    description: '기본적인 자기소개와 프리토킹 시간을 가집니다.',
    date: '2026-02-15T20:00:00',
    location: '강남구 역삼동 스터디룸',
    isOnline: false,
    maxMembers: 10,
    currentMembers: 3,
    status: 'SCHEDULED',
    myStatus: 'NONE',
    members: [
      { userId: 5, nickname: 'David', status: 'ATTENDING', profileImage: 'https://i.pravatar.cc/150?u=5' }
    ]
  }
];

export async function getMeeting(id: string): Promise<Meeting> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const found = MOCK_MEETINGS.find(m => m.id === id);
    if (!found) throw new Error('Meeting not found');
    return found;
  }

  // client.get returns the unwrapped 'data' object from the API response
  const meeting = await client.get<Meeting>(`/meetings/${id}`);
  return meeting;
}

export async function getChallengeMeetings(challengeId: string): Promise<Meeting[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_MEETINGS.filter(m => m.challengeId === challengeId);
  }

  // API returns { content: Meeting[], page: ... }
  const response = await client.get<{ content: Meeting[] }>(`/challenges/${challengeId}/meetings`);

  // Checking for content existence to avoid undefined return
  return response?.content || [];
}

export async function attendMeeting(meetingId: string, status: 'ATTENDING' | 'ABSENT'): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock] Updated meeting ${meetingId} status to ${status}`);
    return;
  }

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
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMeeting: Meeting = {
      id: String(Date.now()),
      challengeId: data.challengeId,
      title: data.title,
      description: data.description || '',
      date: data.meetingDateTime,
      location: data.location,
      isOnline: data.locationType === 'ONLINE',
      maxMembers: data.maxParticipants,
      currentMembers: 0,
      status: 'SCHEDULED',
      myStatus: 'ATTENDING',
    };
    console.log('[Mock] Created meeting:', newMeeting);
    return newMeeting;
  }

  return client.post<Meeting>(`/challenges/${data.challengeId}/meetings`, data);
}

export async function updateMeeting(data: UpdateMeetingRequest): Promise<Meeting> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('[Mock] Updated meeting:', data.meetingId);
    return MOCK_MEETINGS[0];
  }

  return client.put<Meeting>(`/meetings/${data.meetingId}`, data);
}

export async function completeMeeting(meetingId: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock] Completed meeting ${meetingId}`);
    return;
  }

  await client.post(`/meetings/${meetingId}/complete`);
}

export async function respondAttendance(meetingId: string, status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock] Responded to meeting ${meetingId} with ${status}`);
    return;
  }

  await client.post(`/meetings/${meetingId}/attendance`, { status });
}

