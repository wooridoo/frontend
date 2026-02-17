import type { ChallengeRole } from './enums';

export type MemberStatus = 'ACTIVE' | 'OVERDUE' | 'GRACE_PERIOD' | 'LEFT';
export type SupportPaymentStatus = 'PAID' | 'UNPAID';

export interface MemberUserInfo {
    userId: string;
    nickname: string;
    profileImage?: string;
    brix?: number;
}

export interface MemberSupportStatus {
    thisMonth: SupportPaymentStatus;
    consecutivePaid: number;
    overdueCount?: number;
}

export interface Member {
    memberId: string;
    user: MemberUserInfo;
    role: ChallengeRole;
    status: MemberStatus;
    supportStatus: MemberSupportStatus;
    attendanceRate: number;
    joinedAt: string;
}

export interface MemberStats {
    totalSupport: number;
    supportRate: number;
    attendanceRate: number;
    meetingsAttended: number;
    meetingsTotal: number;
}

export interface SupportHistoryRecord {
    month: string;
    amount: number;
    paidAt: string;
}

export interface MemberDetail extends Member {
    stats: MemberStats;
    supportHistory: SupportHistoryRecord[];
}

export interface MemberSummary {
    total: number;
    active: number;
    overdue: number;
    gracePeriod: number;
}

export interface MembersResponse {
    members: Member[];
    summary: MemberSummary;
}

export interface DelegateResponse {
    challengeId: string;
    previousLeader: {
        memberId: string;
        userId: string;
        nickname: string;
        newRole: ChallengeRole | string;
    };
    newLeader: {
        memberId: string;
        userId: string;
        nickname: string;
        newRole: ChallengeRole | string;
    };
    delegatedAt: string;
}
