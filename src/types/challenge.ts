import { Category, ChallengeStatus } from './enums';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export interface Challenge {
    id: string; // ?? ??
    name: string;
    category: Category;
    thumbnailUrl?: string; // ?? ??
    bannerUrl?: string;
    description?: string; // ?? ??
    certificationRate?: number; // ?? ??
    currentMembers: number;
    minMembers: number;
    maxMembers: number;
    // 보조 처리
}

export interface ChallengeInfo {
    challengeId: string;
    title: string;
    description?: string;
    category: string;
    status: ChallengeStatus;
    memberCount: {
        current: number;
        max: number;
    };
    supportAmount: number;
    startDate?: string;
    endDate?: string;
    startedAt?: string;
    createdAt?: string;
    myMembership?: {
        memberId: string;
        role: string;
        joinedAt: string;
        status: string;
    };
    thumbnailUrl?: string; // ?? ??
    bannerUrl?: string;
    certificationRate?: number; // ?? ??
    leader: {
        userId: string;
        nickname: string;
        brix: number;
    };
}
