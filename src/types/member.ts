/**
 * Member Types
 * API 정의서 032-034 기반
 */
import type { ChallengeRole } from './enums';

// =====================
// Member Status (032)
// =====================
export type MemberStatus = 'ACTIVE' | 'OVERDUE' | 'GRACE_PERIOD';
export type SupportPaymentStatus = 'PAID' | 'UNPAID';

// =====================
// User Info (공통)
// =====================
export interface MemberUserInfo {
    userId: number;
    nickname: string;
    profileImage?: string;
    brix?: number;  // 신뢰 지수
}

// =====================
// Support Status (032, 033)
// =====================
export interface MemberSupportStatus {
    thisMonth: SupportPaymentStatus;
    consecutivePaid: number;
    overdueCount?: number;
}

// =====================
// Member (032: 목록용)
// =====================
export interface Member {
    memberId: number;
    user: MemberUserInfo;
    role: ChallengeRole;
    status: MemberStatus;
    supportStatus: MemberSupportStatus;
    attendanceRate: number;
    joinedAt: string;
}

// =====================
// Member Stats (033: 상세용)
// =====================
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

// =====================
// Member Detail (033)
// =====================
export interface MemberDetail extends Member {
    stats: MemberStats;
    supportHistory: SupportHistoryRecord[];
}

// =====================
// Member Summary (032)
// =====================
export interface MemberSummary {
    total: number;
    active: number;
    overdue: number;
    gracePeriod: number;
}

// =====================
// API Response Types
// =====================
export interface MembersResponse {
    members: Member[];
    summary: MemberSummary;
}

// =====================
// Delegate Response (034)
// =====================
export interface DelegateResponse {
    challengeId: number;
    previousLeader: {
        memberId: number;
        userId: number;
        nickname: string;
        newRole: ChallengeRole;
    };
    newLeader: {
        memberId: number;
        userId: number;
        nickname: string;
        newRole: ChallengeRole;
    };
    delegatedAt: string;
}
