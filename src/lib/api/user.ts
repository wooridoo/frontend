/**
 * User API Module
 * 사용자 프로필 관련 API
 */
import { client } from './client';
import type { User } from '@/types/user';

/**
 * 현재 로그인한 사용자 프로필 조회
 */
import { normalizeUser } from '@/lib/utils/dataMappers';

/**
 * 현재 로그인한 사용자 프로필 조회
 */
export async function getMyProfile(): Promise<User> {
    const response = await client.get<User>('/users/me');
    return normalizeUser(response);
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
    return client.put<User>('/users/me', data);
}

/**
 * 닉네임 중복 확인
 */
export async function checkNickname(nickname: string): Promise<{ available: boolean }> {
    return client.get<{ available: boolean }>('/users/check-nickname', { params: { nickname } });
}

/**
 * 회원 탈퇴
 */
export async function withdrawAccount(data: { password: string; reason?: string }): Promise<void> {
    return client.delete('/users/me', { data });
}
