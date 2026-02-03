import type { Meeting } from '@/types/domain';

// Mock Data
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
  }
];

export async function getMeeting(id: string): Promise<Meeting> {
  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const found = MOCK_MEETINGS.find(m => m.id === id);
  if (!found) {
    throw new Error('Meeting not found');
  }
  return found;
}

export async function getChallengeMeetings(challengeId: string): Promise<Meeting[]> {
  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return MOCK_MEETINGS.filter(m => m.challengeId === challengeId);
}

export async function attendMeeting(meetingId: string, status: 'ATTENDING' | 'ABSENT'): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Updated meeting ${meetingId} status to ${status}`);
}
