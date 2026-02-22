import { PostCategory, UserStatus, ChallengeStatus } from '@/types/enums';
import type { User } from '@/types/user';
import type { ChallengeInfo } from '@/types/challenge';
import type { Post } from '@/types/feed';
import type { ChallengeAccount, Transaction } from '@/types/ledger';
import { rememberChallengeRoute } from '@/lib/utils/challengeRoute';

type JsonObject = Record<string, unknown>;

const DEFAULT_CHALLENGE_ACCOUNT: ChallengeAccount = {
  challengeId: '',
  balance: 0,
  lockedDeposits: 0,
  availableBalance: 0,
  stats: {
    totalSupport: 0,
    totalExpense: 0,
    totalFee: 0,
    monthlyAverage: 0,
  },
  recentTransactions: [],
  supportStatus: {
    paid: 0,
    unpaid: 0,
    total: 0,
  },
};

function asObject(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as JsonObject;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const normalized = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === 'y') return true;
    if (normalized === 'false' || normalized === 'n') return false;
  }
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(item => typeof item === 'string') as string[];
}

function normalizeTransaction(item: unknown): Transaction {
  const transaction = asObject(item);
  return {
    transactionId: asString(transaction.transactionId),
    type: asString(transaction.type) as Transaction['type'],
    amount: asNumber(transaction.amount),
    description: asString(transaction.description),
    createdAt: asString(transaction.createdAt),
  };
}

/**
 * 챌린지 계좌 응답을 프론트 타입으로 정규화합니다.
 */
export function normalizeChallengeAccount(data: unknown): ChallengeAccount {
  const source = asObject(data);
  if (Object.keys(source).length === 0) return DEFAULT_CHALLENGE_ACCOUNT;

  const stats = asObject(source.stats);
  const supportStatus = asObject(source.supportStatus);
  const transactions = Array.isArray(source.recentTransactions)
    ? source.recentTransactions.map(normalizeTransaction)
    : [];

  return {
    challengeId: String(source.challengeId ?? ''),
    balance: asNumber(source.balance),
    lockedDeposits: asNumber(source.lockedDeposits),
    availableBalance: asNumber(source.availableBalance),
    stats: {
      totalSupport: asNumber(stats.totalSupport),
      totalExpense: asNumber(stats.totalExpense),
      totalFee: asNumber(stats.totalFee),
      monthlyAverage: asNumber(stats.monthlyAverage),
    },
    supportStatus: {
      paid: asNumber(supportStatus.paid),
      unpaid: asNumber(supportStatus.unpaid),
      total: asNumber(supportStatus.total),
    },
    recentTransactions: transactions,
  };
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function normalizeUser(data: unknown): User {
  const source = asObject(data);
  if (Object.keys(source).length === 0) {
    return {
      userId: 'unknown',
      email: '',
      name: '알 수 없음',
      nickname: '알 수 없음',
      status: UserStatus.ACTIVE,
      hasPassword: true,
      brix: 0,
    };
  }

  const rawStatus = asString(source.status, UserStatus.ACTIVE);
  const isValidStatus = Object.values(UserStatus).includes(rawStatus as UserStatus);
  const account = asObject(source.account);

  return {
    userId: asString(source.userId, 'unknown'),
    email: asString(source.email),
    nickname: asString(source.nickname) || asString(source.username) || asString(source.name) || '사용자',
    name: asString(source.name) || asString(source.nickname) || asString(source.username) || '사용자',
    profileImage: asString(source.profileImage) || asString(source.imageUrl) || asString(source.avatarUrl) || asString(source.avatar) || undefined,
    status: isValidStatus ? (rawStatus as UserStatus) : UserStatus.ACTIVE,
    hasPassword: asBoolean(source.hasPassword, true),
    brix: asNumber(source.brix),
    participatingChallengeIds: asStringArray(source.participatingChallengeIds),
    account: {
      accountId: asString(account.accountId, 'unknown'),
      balance: asNumber(account.balance),
      availableBalance: asNumber(account.availableBalance),
      lockedBalance: asNumber(account.lockedBalance),
    },
  };
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function normalizeChallenge(data: unknown): ChallengeInfo {
  const source = asObject(data);
  if (Object.keys(source).length === 0) {
    return {
      challengeId: '',
      title: '제목 없는 챌린지',
      category: 'OTHER',
      status: ChallengeStatus.RECRUITING,
      memberCount: { current: 0, max: 0 },
      supportAmount: 0,
      leader: {
        userId: '',
        nickname: '알 수 없음',
        brix: 0,
      },
    };
  }

  const memberCount = asObject(source.memberCount);
  const leader = asObject(source.leader);

  const normalized: ChallengeInfo = {
    challengeId: asString(source.challengeId),
    title: asString(source.title) || asString(source.name) || '제목 없는 챌린지',
    description: asString(source.description) || undefined,
    category: asString(source.category, 'OTHER'),
    status: asString(source.status, ChallengeStatus.RECRUITING) as ChallengeInfo['status'],
    memberCount: {
      current: asNumber(memberCount.current),
      max: asNumber(memberCount.max),
    },
    supportAmount: asNumber(source.supportAmount),
    startDate: asString(source.startDate) || undefined,
    endDate: asString(source.endDate) || undefined,
    startedAt: asString(source.startedAt) || undefined,
    createdAt: asString(source.createdAt) || undefined,
    myMembership: source.myMembership ? (asObject(source.myMembership) as ChallengeInfo['myMembership']) : undefined,
    thumbnailUrl: asString(source.thumbnailUrl) || asString(source.thumbnail) || asString(source.image) || undefined,
    certificationRate: asNumber(source.certificationRate),
    leader: {
      userId: asString(leader.userId),
      nickname: asString(leader.nickname, '알 수 없음'),
      brix: asNumber(leader.brix),
    },
  };

  rememberChallengeRoute(normalized.challengeId, normalized.title);
  return normalized;
}

/**
 * 피드 게시글 응답을 공지/핀 상태까지 포함해 정규화합니다.
 */
export function normalizePost(data: unknown): Post {
  const source = asObject(data);
  if (Object.keys(source).length === 0) {
    return {
      id: '',
      content: '',
      category: PostCategory.GENERAL,
      createdBy: normalizeUser(null),
      isNotice: false,
      isPinned: false,
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      images: [],
      createdAt: '',
    };
  }

  const rawCategory = asString(source.category, PostCategory.GENERAL);
  const category = Object.values(PostCategory).includes(rawCategory as PostCategory)
    ? (rawCategory as PostCategory)
    : PostCategory.GENERAL;

  const isNotice = typeof source.isNotice === 'boolean'
    ? source.isNotice
    : source.isNotice === 'Y' || category === PostCategory.NOTICE;
  const isPinned = typeof source.isPinned === 'boolean'
    ? source.isPinned
    : source.isPinned === 'Y';

  return {
    id: asString(source.id) || asString(source.postId),
    challengeId: asString(source.challengeId) || undefined,
    createdBy: normalizeUser(source.createdBy || source.author || source.user),
    title: asString(source.title) || undefined,
    content: asString(source.content),
    category,
    isNotice,
    isPinned,
    isLiked: asBoolean(source.isLiked),
    likeCount: asNumber(source.likeCount),
    commentCount: asNumber(source.commentCount),
    viewCount: asNumber(source.viewCount),
    images: asStringArray(source.images),
    createdAt: asString(source.createdAt),
  };
}
