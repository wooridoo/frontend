/**
 * User API Module
 * 사용자 프로필 관련 API
 */
import { client } from './client';
import type { User } from '@/types/user';

// Mock 전환 플래그
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Mock 데이터
const MOCK_USER: User = {
    userId: 1,
    email: 'user@example.com',
    name: '홍길동',
    nickname: '찐개발자',
    profileImage: 'https://picsum.photos/seed/user1/200/200',
    status: 'ACTIVE',
    brix: 4.5,
    participatingChallengeIds: [1, 2, 3],
    account: {
        accountId: 1,
        balance: 150000,
        availableBalance: 120000,
        lockedBalance: 30000,
    },
    stats: {
        challengeCount: 5,
        completedChallenges: 3,
        totalSupportAmount: 450000,
    },
};

/**
 * 현재 로그인한 사용자 프로필 조회
 */
export async function getMyProfile(): Promise<User> {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_USER;
    }
    return client.get<User>('/users/me');
}

/**
 * 사용자 프로필 수정
 */
export interface UpdateProfileRequest {
    nickname?: string;
    profileImage?: string;
    phone?: string;
}

export async function updateMyProfile(data: UpdateProfileRequest): Promise<User> {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...MOCK_USER, ...data };
    }
    return client.put<User>('/users/me', data);
}

/**
 * 닉네임 중복 확인
 */
export async function checkNickname(nickname: string): Promise<{ available: boolean }> {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { available: nickname !== '사용중인닉네임' };
    }
    return client.get<{ available: boolean }>('/users/check-nickname', { params: { nickname } });
}

/**
 * 회원 탈퇴
 */
export async function withdrawAccount(): Promise<void> {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
    }
    return client.delete('/users/me');
}
