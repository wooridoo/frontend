/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { client } from './client';
import type { User } from '@/types/user';
import type { SocialOnboardingPayload } from '@/types/auth';

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

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export async function changeMyPassword(data: ChangePasswordRequest): Promise<{ passwordChanged: boolean }> {
    return client.put<{ passwordChanged: boolean }>('/users/me/password', data);
}

export async function getUserProfile(userId: string): Promise<{
    userId: string;
    nickname: string;
    profileImage?: string;
}> {
    return client.get<{
        userId: string;
        nickname: string;
        profileImage?: string;
    }>(`/users/${userId}`);
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
export async function withdrawAccount(data: { password?: string; reason?: string }): Promise<void> {
    return client.delete('/users/me', { data });
}

interface SocialOnboardingCompleteApiResponse {
    completed: boolean;
    user: User;
}

export interface SocialOnboardingCompleteResponse {
    completed: boolean;
    user: User;
}

/**
 * 소셜 신규가입 사용자의 필수 온보딩 정보를 저장합니다.
 */
export async function completeSocialOnboarding(
    data: SocialOnboardingPayload
): Promise<SocialOnboardingCompleteResponse> {
    const response = await client.put<SocialOnboardingCompleteApiResponse>('/users/me/social-onboarding', data, {
        silentError: true,
    });

    return {
        completed: response.completed,
        user: normalizeUser(response.user),
    };
}
