/**
 * Member API Module
 * API 정의서 032-034 기반
 * 
 * 전략: Mock → Spring 전환 가능 구조
 * - 타입: API 정의서 기준
 * - Mock: UI 즉시 검증용
 * - Spring: VITE_USE_MOCK=false 시 자동 전환
 */
import { client } from './client';
import { ChallengeRole } from '@/types/enums';
import type {
    Member,
    MemberDetail,
    MemberStatus,
    MembersResponse,
    DelegateResponse,
} from '@/types/member';

// =====================
// Mock 전환 플래그
// =====================
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// =====================
// Error Types
// =====================
export class MemberApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// =====================
// Mock Data (API 정의서 응답 형식 준수)
// =====================
const MOCK_MEMBERS: Member[] = [
    {
        memberId: 1,
        user: {
            userId: 1,
            nickname: '홍길동',
            profileImage: 'https://i.pravatar.cc/150?u=1',
            brix: 85.5,
        },
        role: ChallengeRole.LEADER,
        status: 'ACTIVE',
        supportStatus: {
            thisMonth: 'PAID',
            consecutivePaid: 12,
        },
        attendanceRate: 95.0,
        joinedAt: '2025-12-01T10:00:00Z',
    },
    {
        memberId: 2,
        user: {
            userId: 2,
            nickname: '김철수',
            profileImage: 'https://i.pravatar.cc/150?u=2',
            brix: 72.0,
        },
        role: ChallengeRole.FOLLOWER,
        status: 'OVERDUE',
        supportStatus: {
            thisMonth: 'UNPAID',
            consecutivePaid: 0,
            overdueCount: 2,
        },
        attendanceRate: 60.0,
        joinedAt: '2025-12-15T10:00:00Z',
    },
    {
        memberId: 3,
        user: {
            userId: 3,
            nickname: '이영희',
            profileImage: 'https://i.pravatar.cc/150?u=3',
            brix: 90.2,
        },
        role: ChallengeRole.FOLLOWER,
        status: 'ACTIVE',
        supportStatus: {
            thisMonth: 'PAID',
            consecutivePaid: 8,
        },
        attendanceRate: 88.0,
        joinedAt: '2025-12-20T10:00:00Z',
    },
    {
        memberId: 4,
        user: {
            userId: 4,
            nickname: '박민수',
            profileImage: 'https://i.pravatar.cc/150?u=4',
            brix: 65.0,
        },
        role: ChallengeRole.FOLLOWER,
        status: 'GRACE_PERIOD',
        supportStatus: {
            thisMonth: 'UNPAID',
            consecutivePaid: 3,
            overdueCount: 1,
        },
        attendanceRate: 75.0,
        joinedAt: '2026-01-05T10:00:00Z',
    },
];

// =====================
// Mock Functions
// =====================
async function mockGetChallengeMembers(
    _challengeId: string,
    status?: MemberStatus
): Promise<MembersResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let members = [...MOCK_MEMBERS];

    if (status) {
        members = members.filter(m => m.status === status);
    }

    const summary = {
        total: MOCK_MEMBERS.length,
        active: MOCK_MEMBERS.filter(m => m.status === 'ACTIVE').length,
        overdue: MOCK_MEMBERS.filter(m => m.status === 'OVERDUE').length,
        gracePeriod: MOCK_MEMBERS.filter(m => m.status === 'GRACE_PERIOD').length,
    };

    return { members, summary };
}

async function mockGetMember(
    _challengeId: string,
    memberId: number
): Promise<MemberDetail> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const member = MOCK_MEMBERS.find(m => m.memberId === memberId);

    if (!member) {
        throw new MemberApiError('멤버를 찾을 수 없습니다.', 404);
    }

    return {
        ...member,
        stats: {
            totalSupport: 1200000,
            supportRate: 100.0,
            attendanceRate: member.attendanceRate,
            meetingsAttended: 10,
            meetingsTotal: 12,
        },
        supportHistory: [
            { month: '2026-01', amount: 100000, paidAt: '2026-01-01T10:00:00Z' },
            { month: '2025-12', amount: 100000, paidAt: '2025-12-01T10:00:00Z' },
            { month: '2025-11', amount: 100000, paidAt: '2025-11-01T10:00:00Z' },
        ],
    };
}

async function mockDelegateLeader(
    challengeId: string,
    targetMemberId: number
): Promise<DelegateResponse> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const targetMember = MOCK_MEMBERS.find(m => m.memberId === targetMemberId);
    const currentLeader = MOCK_MEMBERS.find(m => m.role === ChallengeRole.LEADER);

    if (!targetMember) {
        throw new MemberApiError('멤버를 찾을 수 없습니다.', 404);
    }

    if (targetMember.status !== 'ACTIVE') {
        throw new MemberApiError('정지된 멤버에게 위임할 수 없습니다.', 400);
    }

    return {
        challengeId: Number(challengeId),
        previousLeader: {
            memberId: currentLeader!.memberId,
            userId: currentLeader!.user.userId,
            nickname: currentLeader!.user.nickname,
            newRole: ChallengeRole.FOLLOWER,
        },
        newLeader: {
            memberId: targetMember.memberId,
            userId: targetMember.user.userId,
            nickname: targetMember.user.nickname,
            newRole: ChallengeRole.LEADER,
        },
        delegatedAt: new Date().toISOString(),
    };
}

// =====================
// API Functions (Mock + Spring 전환)
// =====================

/**
 * 멤버 목록 조회 (032)
 */
export async function getChallengeMembers(
    challengeId: string,
    status?: MemberStatus
): Promise<MembersResponse> {
    if (USE_MOCK) {
        return mockGetChallengeMembers(challengeId, status);
    }

    return client.get<MembersResponse>(
        `/challenges/${challengeId}/members`,
        { params: { status } }
    );
}

/**
 * 멤버 상세 조회 (033)
 */
export async function getMember(
    challengeId: string,
    memberId: number
): Promise<MemberDetail> {
    if (USE_MOCK) {
        return mockGetMember(challengeId, memberId);
    }

    return client.get<MemberDetail>(
        `/challenges/${challengeId}/members/${memberId}`
    );
}

/**
 * 리더 위임 (034)
 */
export async function delegateLeader(
    challengeId: string,
    targetMemberId: number
): Promise<DelegateResponse> {
    if (USE_MOCK) {
        return mockDelegateLeader(challengeId, targetMemberId);
    }

    return client.post<DelegateResponse>(
        `/challenges/${challengeId}/delegate`,
        { targetMemberId }
    );
}
