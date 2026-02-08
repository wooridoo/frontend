/**
 * Challenge API Module
 * 챌린지 관련 핵심 API (Feed는 feed.ts로 분리됨)
 * 
 * Mock ↔ Spring 전환 가능 구조
 */
import { client, ApiError } from './client';
import { useAuthStore } from '@/store/useAuthStore';
import { ChallengeStatus, Category } from '@/types/enums';

// =====================
// Mock 전환 플래그
// =====================
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// =====================
// Types
// =====================
export interface ChallengeInfo {
  challengeId: number;
  title: string;
  description?: string;
  category: string;
  status: ChallengeStatus;
  memberCount: {
    current: number;
    max: number;
  };
  supportAmount: number;
  startDate: string;
  endDate: string;
  thumbnailUrl?: string; // API 스펙과 맞춤 (legacy: thumbnailUrl)
  certificationRate?: number; // Legacy 호환용
  leader: {
    userId: number;
    nickname: string;
    brix: number;
  };
}

// =====================
// Mock Data
// =====================
const MOCK_CHALLENGES_DATA: ChallengeInfo[] = [
  {
    challengeId: 1,
    title: '하루 물 2L 마시기',
    category: Category.EXERCISE,
    status: ChallengeStatus.IN_PROGRESS,
    memberCount: { current: 120, max: 500 },
    supportAmount: 0,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    thumbnailUrl: 'https://picsum.photos/seed/water/300/200',
    description: '매일 물 2L를 마시고 건강해지는 챌린지입니다. 물 마시기 알림과 함께해요!',
    certificationRate: 85,
    leader: { userId: 1, nickname: 'HealthGuru', brix: 4.5 }
  },
  {
    challengeId: 2,
    title: '영어 단어 50개 암기',
    category: Category.STUDY,
    status: ChallengeStatus.RECRUITING,
    memberCount: { current: 85, max: 100 },
    supportAmount: 0,
    startDate: '2025-02-01',
    endDate: '2025-03-01',
    thumbnailUrl: 'https://picsum.photos/seed/eng/300/200',
    description: '매일 영단어 50개를 외우고 시험보는 스터디입니다. 함께 성장해요.',
    certificationRate: 92,
    leader: { userId: 2, nickname: 'EngMaster', brix: 4.8 }
  },
  {
    challengeId: 3,
    title: '매일 1만원 저축하기',
    category: Category.SAVINGS,
    status: ChallengeStatus.IN_PROGRESS,
    memberCount: { current: 230, max: 300 },
    supportAmount: 1500000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    thumbnailUrl: 'https://picsum.photos/seed/money/300/200',
    description: '티끌 모아 태산! 하루 만원씩 저축하는 습관을 길러봅시다.',
    certificationRate: 78,
    leader: { userId: 3, nickname: 'RichDad', brix: 5.0 }
  },
  {
    challengeId: 4,
    title: '아침 6시 기상하기',
    category: Category.OTHER,
    status: ChallengeStatus.IN_PROGRESS,
    memberCount: { current: 50, max: 100 },
    supportAmount: 0,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    thumbnailUrl: 'https://picsum.photos/seed/morning/300/200',
    description: '미라클 모닝! 아침 시간을 활용해 하루를 알차게 시작해보세요.',
    certificationRate: 60,
    leader: { userId: 4, nickname: 'Miracle', brix: 3.9 }
  },
  {
    challengeId: 5,
    title: '매일 30분 독서',
    category: Category.STUDY,
    status: ChallengeStatus.IN_PROGRESS,
    memberCount: { current: 42, max: 50 },
    supportAmount: 0,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    thumbnailUrl: 'https://picsum.photos/seed/read/300/200',
    description: '하루 30분, 책 속의 지혜를 쌓는 시간입니다.',
    certificationRate: 88,
    leader: { userId: 5, nickname: 'BookWorm', brix: 4.2 }
  },
  {
    challengeId: 6,
    title: '주 3회 러닝',
    category: Category.EXERCISE,
    status: ChallengeStatus.RECRUITING,
    memberCount: { current: 156, max: 200 },
    supportAmount: 0,
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    thumbnailUrl: 'https://picsum.photos/seed/run/300/200',
    description: '건강한 신체에 건강한 정신이 깃듭니다. 주 3회 러닝 챌린지!',
    certificationRate: 75,
    leader: { userId: 6, nickname: 'Runner', brix: 4.6 }
  },
  {
    challengeId: 7,
    title: '가계부 쓰기',
    category: Category.SAVINGS,
    status: ChallengeStatus.IN_PROGRESS,
    memberCount: { current: 98, max: 150 },
    supportAmount: 0,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    thumbnailUrl: 'https://picsum.photos/seed/account/300/200',
    description: '내 돈 관리의 시작, 가계부 쓰기부터 시작해보세요.',
    certificationRate: 95,
    leader: { userId: 7, nickname: 'Saver', brix: 4.9 }
  },
  {
    challengeId: 8,
    title: '필사하기',
    category: Category.HOBBY,
    status: ChallengeStatus.COMPLETED,
    memberCount: { current: 34, max: 50 },
    supportAmount: 0,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    thumbnailUrl: 'https://picsum.photos/seed/write/300/200',
    description: '좋은 글귀를 손으로 적으며 마음을 정리하는 시간.',
    certificationRate: 100,
    leader: { userId: 8, nickname: 'Writer', brix: 4.7 }
  },
];

const MOCK_CHALLENGE_DETAIL: ChallengeInfo = {
  ...MOCK_CHALLENGES_DATA[0], // 기본은 첫 번째 챌린지로
  description: '매주 함께 책 읽고 토론하는 모임입니다. (상세 오버라이드)',
  leader: {
    userId: 1,
    nickname: '홍길동',
    brix: 85.5
  }
};

// =====================
// Mock Functions
// =====================
async function mockGetChallenge(challengeId: string): Promise<ChallengeInfo> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const id = Number(challengeId);

  if (id === 999) throw new ApiError('Challenge not found', 404);

  const found = MOCK_CHALLENGES_DATA.find(c => c.challengeId === id);
  return found || { ...MOCK_CHALLENGE_DETAIL, challengeId: id };
}

// =====================
// API Functions
// =====================

/**
 * 챌린지 상세 조회 (024)
 */
export async function getChallenge(challengeId: string): Promise<ChallengeInfo> {
  if (USE_MOCK) return mockGetChallenge(challengeId);

  // client.get returns the unwrapped data (ChallengeInfo)
  const challenge = await client.get<ChallengeInfo>(`/challenges/${challengeId}`);
  return challenge;
}

/**
 * 챌린지 목록 조회 (검색/탐색용)
 */
export async function getChallenges(params?: { query?: string; category?: string }): Promise<ChallengeInfo[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    let results = [...MOCK_CHALLENGES_DATA];

    if (params?.query) {
      const q = params.query.toLowerCase();
      results = results.filter(c => c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }

    if (params?.category && params.category !== '전체') {
      // 카테고리 매핑 로직 (UI string -> Enum) 필요 시 여기서 처리 또는 호출부에서 처리
      // 여기서는 호출부에서 정확한 Category Enum 값을 보낸다고 가정하거나, 단순 string 비교
      results = results.filter(c => c.category === params.category);
    }

    return results;
  }

  // client.get returns unwrapped data { content: ..., page: ... }
  const response = await client.get<{ content: ChallengeInfo[] }>('/challenges', { params });
  return response.content;
}

/**
 * 챌린지 참여 여부 확인 (Helper)
 */
export function isParticipant(challengeId: number): boolean {
  const { user } = useAuthStore.getState();
  return user?.participatingChallengeIds?.includes(challengeId) ?? false;
}

/**
 * 챌린지 접근 권한 검증 (Helper)
 */
export function validateChallengeAccess(challengeId: string): void {
  const { isLoggedIn, user } = useAuthStore.getState();
  if (!isLoggedIn || !user) throw new ApiError('로그인이 필요합니다.', 401);

  const targetId = parseInt(challengeId, 10);

  // Mock Check
  if (USE_MOCK) {
    // 모든 챌린지 허용 (Mock 데이터 확장됨)
  }

  if (!user.participatingChallengeIds?.includes(targetId)) {
    throw new ApiError('해당 챌린지에 참여하지 않았습니다.', 403);
  }
}

// --- Additional Challenge API Functions ---

export interface UpdateChallengeRequest {
  challengeId: number;
  title: string;
  description?: string;
  category: string;
  thumbnailUrl?: string;
  maxMembers: number;
}

export async function updateChallenge(data: UpdateChallengeRequest): Promise<ChallengeInfo> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('[Mock] Updated challenge:', data.challengeId);
    return { ...MOCK_CHALLENGES_DATA[0], ...data };
  }

  return client.put<ChallengeInfo>(`/challenges/${data.challengeId}`, data);
}

export async function deleteChallenge(challengeId: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock] Deleted challenge ${challengeId}`);
    return;
  }

  await client.delete(`/challenges/${challengeId}`);
}

export async function leaveChallenge(challengeId: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock] Left challenge ${challengeId}`);
    return;
  }

  await client.delete(`/challenges/${challengeId}/leave`);
}

