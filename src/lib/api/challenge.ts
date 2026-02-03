import { useAuthStore } from '@/store/useAuthStore';

export interface PostAuthor {
  name: string;
  avatar: string;
  role?: 'leader' | 'member';
}

export interface Post {
  id: number;
  author: PostAuthor;
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  isNotice?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: { name: '김철수', avatar: 'https://i.pravatar.cc/150?u=1', role: 'leader' },
    content: '📢 2월 정기모임 장소가 변경되었습니다!\n강남역 → 선릉역 스터디카페로 변경됩니다. 참석 여부 투표 부탁드려요~',
    createdAt: '1시간 전',
    likes: 8,
    comments: 3,
    isNotice: true,
  },
  {
    id: 2,
    author: { name: '이영희', avatar: 'https://i.pravatar.cc/150?u=2' },
    content: '이번 주 독서 인증합니다! 📚\n"클린 코드" 완독했어요. 다음 달 모임에서 후기 나눠요~',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    createdAt: '2시간 전',
    likes: 12,
    comments: 5,
  },
  {
    id: 3,
    author: { name: '박민수', avatar: 'https://i.pravatar.cc/150?u=3' },
    content: '다음 달에 읽을 책 추천받습니다!\n개발 관련 책이면 좋을 것 같아요. 어떤 책이 좋을까요?',
    createdAt: '5시간 전',
    likes: 6,
    comments: 14,
  }
];

// Error Types
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Strict Mock API: getChallengeFeed
 * Checks Auth Store state to simulate 401/403 errors.
 */
export async function getChallengeFeed(challengeId: string): Promise<Post[]> {
  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { isLoggedIn, user } = useAuthStore.getState();

  // 1. Check Login
  if (!isLoggedIn || !user) {
    throw new ApiError('로그인이 필요합니다.', 401);
  }

  // 2. Check Participation (Strict Guard)
  // Converting string challengeId to number for comparison with dummy data
  const targetId = parseInt(challengeId, 10);

  // Simple Mock Check: Only IDs 1 and 2 exist
  if (targetId !== 1 && targetId !== 2) {
    throw new ApiError('존재하지 않는 챌린지입니다.', 404);
  }

  const isParticipant = user.participatingChallengeIds?.includes(targetId);

  if (!isParticipant) {
    throw new ApiError('해당 챌린지에 참여하지 않았습니다.', 403);
  }

  // 3. Return Data
  return MOCK_POSTS;
}
