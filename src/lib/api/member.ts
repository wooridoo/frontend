/**
 * Member API Module
 * API 정의서 032-034 기반
 */
import { client } from './client';
import { toApiChallengeId } from './challengeId';
import type {
  MemberDetail,
  MemberStatus,
  MembersResponse,
  DelegateResponse,
} from '@/types/member';

// =====================
// API Functions
// =====================

/**
 * 멤버 목록 조회 (032)
 */
export async function getChallengeMembers(
  challengeId: string,
  status?: MemberStatus
): Promise<MembersResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.get<MembersResponse>(
    `/challenges/${normalizedChallengeId}/members`,
    { params: { status } }
  );
}

/**
 * 멤버 상세 조회 (033)
 */
export async function getMember(
  challengeId: string,
  memberId: string
): Promise<MemberDetail> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.get<MemberDetail>(
    `/challenges/${normalizedChallengeId}/members/${memberId}`
  );
}

/**
 * 리더 위임 (034)
 */
export async function delegateLeader(
  challengeId: string,
  targetUserId: string
): Promise<DelegateResponse> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  return client.post<DelegateResponse>(
    `/challenges/${normalizedChallengeId}/delegate`,
    { targetUserId }
  );
}

