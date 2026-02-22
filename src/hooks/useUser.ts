/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { getMyProfile, updateMyProfile, checkNickname, withdrawAccount } from '@/lib/api/user';
import type { UpdateProfileRequest } from '@/lib/api/user';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const userKeys = {
    all: ['user'] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    nicknameCheck: (nickname: string) => [...userKeys.all, 'nickname', nickname] as const,
};

/**
 * 내 프로필 조회
 */
export function useMyProfile() {
    const { isLoggedIn } = useAuthStore();
    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: getMyProfile,
        staleTime: 1000 * 60 * 5, // ?? ??
        enabled: isLoggedIn, // ?? ??
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
        staleTime: 1000 * 60, // ?? ??
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
