/**
 * User Hooks
 * 사용자 프로필 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile, checkNickname, withdrawAccount } from '@/lib/api/user';
import type { UpdateProfileRequest } from '@/lib/api/user';

export const userKeys = {
    all: ['user'] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    nicknameCheck: (nickname: string) => [...userKeys.all, 'nickname', nickname] as const,
};

/**
 * 내 프로필 조회
 */
export function useMyProfile() {
    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: getMyProfile,
        staleTime: 1000 * 60 * 5, // 5분
    });
}

/**
 * 프로필 수정
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => updateMyProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
    });
}

/**
 * 닉네임 중복 확인
 */
export function useCheckNickname(nickname: string) {
    return useQuery({
        queryKey: userKeys.nicknameCheck(nickname),
        queryFn: () => checkNickname(nickname),
        enabled: nickname.length >= 2,
        staleTime: 1000 * 60, // 1분
    });
}

/**
 * 회원 탈퇴
 */
export function useWithdrawAccount() {
    return useMutation({
        mutationFn: withdrawAccount,
    });
}
