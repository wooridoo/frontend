import type { Vote, VoteOption, VoteType, VoteStatus } from '../../types/domain';

// Mock Data for Logic Verification
const MOCK_VOTES: Vote[] = [
  {
    voteId: 1,
    challengeId: 1,
    type: 'EXPENSE',
    title: '회식비 30만원 지출 승인',
    description: '1월 정기모임 회식비입니다. 강남역 맛집에서 진행 예정입니다.',
    status: 'IN_PROGRESS',
    createdBy: {
      userId: 1,
      nickname: '홍길동',
      profileImage: 'https://avatar.vercel.sh/hong',
    },
    targetInfo: {
      targetId: 5,
      amount: 300000,
      category: 'FOOD',
    },
    voteCount: {
      agree: 5,
      disagree: 2,
      abstain: 1,
      notVoted: 2,
      total: 10,
    },
    myVote: undefined, // Not voted yet
    eligibleVoters: 10,
    requiredApproval: 7,
    deadline: new Date(Date.now() + 86400000).toISOString(), // +1 day
    createdAt: new Date().toISOString(),
  },
  {
    voteId: 2,
    challengeId: 1,
    type: 'KICK',
    title: '멤버 김철수 강퇴 투표',
    description: '3회 연속 무단 불참으로 인한 강퇴 건의입니다.',
    status: 'APPROVED',
    createdBy: {
      userId: 1,
      nickname: '홍길동',
    },
    voteCount: {
      agree: 8,
      disagree: 1,
      abstain: 1,
      notVoted: 0,
      total: 10,
    },
    eligibleVoters: 10,
    requiredApproval: 7,
    deadline: new Date(Date.now() - 86400000).toISOString(), // -1 day
    createdAt: new Date(Date.now() - 172800000).toISOString(), // -2 days
    result: {
      passed: true,
      agree: 8,
      disagree: 1,
      abstain: 1,
      notVoted: 0,
      total: 10,
      requiredApproval: 7,
      approvalRate: 80.0,
    },
  },
];

export async function getChallengeVotes(
  challengeId: string,
  status?: VoteStatus
): Promise<Vote[]> {
  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!challengeId) throw new Error('Challenge ID is required');

  let votes = [...MOCK_VOTES];

  if (status) {
    if (status === 'IN_PROGRESS') {
      votes = votes.filter(v => v.status === 'IN_PROGRESS');
    } else {
      votes = votes.filter(v => v.status !== 'IN_PROGRESS');
    }
  }

  return votes;
}

export async function getVoteDetail(voteId: number): Promise<Vote> {
  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const vote = MOCK_VOTES.find(v => v.voteId === voteId);
  if (!vote) throw new Error('Vote not found');

  return vote;
}

export async function createVote(
  challengeId: string,
  data: {
    type: VoteType;
    title: string;
    description?: string;
    targetId?: number;
    deadline: string;
  }
): Promise<Vote> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newVote: Vote = {
    voteId: Math.floor(Math.random() * 10000),
    challengeId: Number(challengeId),
    type: data.type,
    title: data.title,
    description: data.description,
    status: 'IN_PROGRESS',
    createdBy: {
      userId: 1,
      nickname: 'Current User', // Mock
    },
    targetInfo: data.targetId ? { targetId: data.targetId } : undefined,
    voteCount: {
      agree: 0,
      disagree: 0,
      abstain: 0,
      notVoted: 10,
      total: 10,
    },
    eligibleVoters: 10,
    requiredApproval: 7,
    deadline: data.deadline,
    createdAt: new Date().toISOString(),
  };

  MOCK_VOTES.unshift(newVote);
  return newVote;
}

export async function castVote(voteId: number, choice: VoteOption): Promise<Vote> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const voteIndex = MOCK_VOTES.findIndex(v => v.voteId === voteId);
  if (voteIndex === -1) throw new Error('Vote not found');

  const vote = MOCK_VOTES[voteIndex];

  // Update mock data logic (simplified)
  const updatedVote = {
    ...vote,
    myVote: choice,
    voteCount: {
      ...vote.voteCount,
      [choice.toLowerCase()]: (vote.voteCount[choice.toLowerCase() as keyof typeof vote.voteCount] || 0) + 1,
      notVoted: vote.voteCount.notVoted - 1,
    }
  };

  MOCK_VOTES[voteIndex] = updatedVote;
  return updatedVote;
}
