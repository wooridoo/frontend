import { Category, ChallengeStatus } from './enums';

/**
 * Challenge Domain Types
 */
export interface Challenge {
    id: string; // UUID
    name: string;
    category: Category;
    thumbnailUrl?: string; // Added for UI
    description?: string; // Added for UI
    certificationRate?: number; // Added for UI (0-100)
    currentMembers: number;
    minMembers: number;
    maxMembers: number;
    // Add other fields as needed
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
    thumbnailUrl?: string; // API 스펙과 맞춤 (legacy: thumbnailUrl)
    certificationRate?: number; // Legacy 호환용
    leader: {
        userId: string;
        nickname: string;
        brix: number;
    };
}
