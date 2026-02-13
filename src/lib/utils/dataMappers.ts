/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '@/types/user';
import type { ChallengeInfo } from '@/types/challenge';
import type { Post } from '@/types/feed';
import type { ChallengeAccount } from '@/types/ledger';
import { rememberChallengeRoute } from '@/lib/utils/challengeRoute';

/**
 * API Response Normalizers
 * 백엔드 API 응답과 프론트엔드 타입 간의 불일치를 해결합니다.
 * (예: nickname vs username, title vs name 등)
 */

export function normalizeChallengeAccount(data: any): ChallengeAccount {
  if (!data) return {} as ChallengeAccount;

  const stats = data.stats || {};
  const monthlyAverage = stats.monthlyAverage || {};

  const supportStatus = data.supportStatus || {};
  const thisMonth = supportStatus.thisMonth || {};

  return {
    ...data,
    balance: data.balance || 0,
    lockedDeposits: data.lockedDeposits || 0,
    availableBalance: data.availableBalance || 0,
    stats: {
      totalSupport: stats.totalSupport || 0,
      totalExpense: stats.totalExpense || 0,
      totalFee: stats.totalFee || 0,
      monthlyAverage: {
        support: monthlyAverage.support || 0,
        expense: monthlyAverage.expense || 0,
      },
    },
    supportStatus: {
      thisMonth: {
        paid: thisMonth.paid || 0,
        unpaid: thisMonth.unpaid || 0,
        total: thisMonth.total || 0,
      },
    },
    recentTransactions: data.recentTransactions || [],
  };
}

export function normalizeUser(data: any): User {
  if (!data) {
    return {
      userId: 'unknown',
      email: '',
      name: 'Unknown',
      nickname: '알 수 없음',
      status: 'ACTIVE' as any,
      brix: 0,
    };
  }
  return {
    ...data,
    nickname: data.nickname || data.username || data.name || 'User',
    name: data.name || data.nickname || data.username || 'User',
    profileImage: data.profileImage || data.imageUrl || data.avatarUrl || data.avatar,
    brix: data.brix ?? 0,
    account: data.account || { balance: 0, availableBalance: 0, lockedBalance: 0, accountId: 'unknown' },
  };
}

export function normalizeChallenge(data: any): ChallengeInfo {
  if (!data) return {} as ChallengeInfo;

  const normalized = {
    ...data,
    title: data.title || data.name || 'Untitled Challenge',
    thumbnailUrl: data.thumbnailUrl || data.thumbnail || data.image,
    // Ensure status is present or default
    status: data.status || 'RECRUITING',
  };

  rememberChallengeRoute(String(normalized.challengeId || ''), normalized.title);
  return normalized;
}

export function normalizePost(data: any): Post {
  if (!data) return {} as Post;

  return {
    ...data,
    // Handle id normalization
    id: data.id || data.postId,
    // Handle createdBy normalization recursively
    createdBy: normalizeUser(data.createdBy || data.author || data.user),
    images: data.images || [],
    likeCount: data.likeCount ?? 0,
    commentCount: data.commentCount ?? 0,
    isLiked: data.isLiked ?? false,
  };
}
