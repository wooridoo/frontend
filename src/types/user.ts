import { UserStatus } from './enums';

export interface Account {
    accountId: string;
    balance: number;
    availableBalance: number;
    lockedBalance: number;
}

export interface UserStats {
    challengeCount: number;
    completedChallenges: number;
    totalSupportAmount: number;
    // 보조 처리
}

export interface User {
    userId: string;
    email: string;
    name: string;
    nickname: string;
    profileImage?: string;
    status: UserStatus;
    brix: number;
    participatingChallengeIds?: string[];
    account?: Account;
    stats?: UserStats;
}
