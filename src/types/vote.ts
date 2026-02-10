/**
 * Vote Domain Types
 */
import { VoteStatus } from './enums';
export { VoteStatus };

export type VoteType = 'EXPENSE' | 'KICK' | 'LEADER_KICK' | 'DISSOLVE';
// VoteOption은 Enums에 없음
export type VoteOption = 'AGREE' | 'DISAGREE' | 'ABSTAIN';

export interface VoteCount {
    agree: number;
    disagree: number;
    abstain: number;
    notVoted: number;
    total: number;
}

export interface VoteResult {
    passed: boolean;
    agree: number;
    disagree: number;
    abstain: number;
    notVoted: number;
    total: number;
    requiredApproval: number;
    approvalRate: number;
}

export interface Vote {
    voteId: string;
    challengeId: string;
    type: VoteType;
    title: string;
    description?: string;
    status: VoteStatus;
    createdBy: {
        userId: string;
        nickname: string;
        profileImage?: string;
    };
    targetInfo?: {
        targetId: string;
        amount?: number;
        category?: string;
    };
    voteCount: VoteCount;
    myVote?: VoteOption;
    eligibleVoters: number;
    requiredApproval: number; // e.g. 7
    deadline: string; // ISO Date
    createdAt: string; // ISO Date
    result?: VoteResult; // Only when status !== IN_PROGRESS
}
