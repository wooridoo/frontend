import { VoteStatus } from './enums';

export { VoteStatus };

export type VoteType = 'EXPENSE' | 'KICK' | 'LEADER_KICK' | 'DISSOLVE' | 'MEETING_ATTENDANCE';
export type VoteOption = 'AGREE' | 'DISAGREE';

export interface VoteCount {
  agree: number;
  disagree: number;
  total: number;
  abstain?: number;
  notVoted?: number;
}

export interface VoteResult {
  passed: boolean;
  voteCount: VoteCount;
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
    targetId?: string;
    amount?: number;
    category?: string;
    meetingId?: string;
    receiptUrl?: string;
  };
  voteCount: VoteCount;
  myVote?: VoteOption;
  eligibleVoters: number;
  requiredApproval: number;
  deadline: string;
  createdAt: string;
  result?: VoteResult;
}
