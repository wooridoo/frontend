/**
 * Member API Module
 * API 정의서 032-034 기반
 */
import { client } from './client';
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
  return client.post<DelegateResponse>(
    `/challenges/${challengeId}/delegate`,
    { targetMemberId }
  );
}

