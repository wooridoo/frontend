import { UserStatus } from './enums';

export interface Account {
    accountId: number;
    balance: number;
    availableBalance: number;
    lockedBalance: number;
}

export interface UserStats {
    challengeCount: number;
    completedChallenges: number;
    totalSupportAmount: number;
    // ... other stats
}

export interface User {
    userId: number;
    email: string;
    name: string;
    nickname: string;
    profileImage?: string;
    status: UserStatus;
    brix: number;
    participatingChallengeIds?: number[];
    account?: Account;
    stats?: UserStats;
}
