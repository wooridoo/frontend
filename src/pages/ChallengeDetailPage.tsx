import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Clock, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { useJoinModalStore } from '@/store/modal/useModalStore';
import { useChallengeDetail } from '@/hooks/useChallenge';
import { getChallengeMembers } from '@/lib/api/member';
import { isParticipant } from '@/lib/utils/challengeUtils';
import { getCategoryLabel } from '@/lib/utils/categoryLabels';
import { Avatar } from '@/components/ui/Avatar';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { toChallengeSlug } from '@/lib/utils/challengeRoute';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './ChallengeDetailPage.module.css';

import { useAuthStore } from '@/store/useAuthStore';

// ...

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ChallengeDetailPage() {
  const { challengeId, challengeRef, isResolving } = useChallengeRoute();
  const navigate = useNavigate();
  const location = useLocation();
  const { onOpen } = useJoinModalStore();
  const { user } = useAuthStore();

  const { data: challenge, isLoading: isChallengeLoading, error } = useChallengeDetail(challengeId);

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['challengeMembers', challengeId],
    queryFn: async () => {
      try {
        return await getChallengeMembers(challengeId);
      } catch (err: unknown) {
        // 비멤버인 경우 403 반환 — 정상 동작이므로 빈 결과 반환
        if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 403) {
          return { members: [], totalCount: 0 };
        }
        throw err;
      }
    },
    enabled: !!challengeId,
    retry: false,
  });

  const isJoined = useMemo(() => {
    if (!challenge) return false;
    // 보조 처리
    if (isParticipant(challenge.challengeId)) return true;
    // 보조 처리
    if (user && membersData?.members) {
      return membersData.members.some(member => String(member.user.userId) === String(user.userId));
    }
    return false;
  }, [challenge, membersData, user]);

  useEffect(() => {
    if (!challenge || !challengeRef) return;

    const canonicalRef = toChallengeSlug(String(challenge.challengeId), challenge.title);
    if (!canonicalRef || canonicalRef === challengeRef) return;

    const oldPrefix = `/${challengeRef}/challenge/intro`;
    if (!location.pathname.startsWith(oldPrefix)) return;

    const canonicalPath = `/${canonicalRef}/challenge/intro${location.search}${location.hash}`;
    navigate(canonicalPath, { replace: true });
  }, [challenge, challengeRef, location.hash, location.pathname, location.search, navigate]);

  const handleJoin = () => {
    if (isJoined) return; // ?? ??
    if (challenge) {
      onOpen(String(challenge.challengeId));
    }
  };

  const isLoading = isResolving || isChallengeLoading || isMembersLoading;

  if (isLoading) {
    return (
      <PageContainer variant="content" contentWidth="lg">
        <PageHeader title="챌린지 상세" showBack />
        <div className={styles.stateContainer}>
          <Loader2 className={`animate-spin ${styles.loaderIcon}`} size={32} />
        </div>
      </PageContainer>
    );
  }

  if (error || !challenge) {
    return (
      <PageContainer variant="content" contentWidth="lg">
        <PageHeader title="챌린지 상세" showBack />
        <div className={styles.stateContainer}>
          <div className={styles.stateText}>챌린지 정보를 불러올 수 없습니다.</div>
          <Button variant="ghost" onClick={() => navigate(-1)}>뒤로 가기</Button>
        </div>
      </PageContainer>
    );
  }

  // 보조 처리
  const frequency = '매일';
  const startedAt = challenge.startedAt || challenge.startDate || challenge.createdAt;
  const endedAt = challenge.endDate;
  const duration = (() => {
    if (startedAt && endedAt) {
      const start = new Date(startedAt);
      const end = new Date(endedAt);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end >= start) {
        const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${diffDays}일`;
      }
    }
    if (startedAt) {
      const start = new Date(startedAt);
      if (!Number.isNaN(start.getTime())) {
        return `${start.toLocaleDateString()} 시작`;
      }
    }
    return '진행 중';
  })();

  const memberList = membersData?.members?.slice(0, 4) || [];

  return (
    <PageContainer variant="content" contentWidth="lg">
      <PageHeader title="챌린지 상세" showBack />

      <div className={styles.heroSection}>
        <div className={styles.categoryBadge}>
          <Badge variant="default">{getCategoryLabel(challenge.category)}</Badge>
        </div>
        <h1 className={styles.title}>{challenge.title}</h1>
        <div className={styles.tags}>
          <span className={styles.tag}>
            <Clock size={14} /> {frequency}
          </span>
          <span className={styles.tag}>
            <Calendar size={14} /> {duration}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>챌린지 소개</h2>
        <p className={styles.description}>{challenge.description}</p>
        <div className={styles.hostInfo}>
          {/* 보조 설명 */}
          <Avatar
            name={challenge.leader.nickname}
            src={null} // ?? ??
            size="md"
            className={styles.hostAvatar}
          />
          <div className={styles.hostText}>
            <span className={styles.hostLabel}>개설자</span>
            <span className={styles.hostName}>{challenge.leader.nickname}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>참여 조건</h2>
        <div className={styles.conditionCard}>
          <div className={styles.conditionItem}>
            <DollarSign className={styles.icon} size={20} />
            <div className={styles.conditionInfo}>
              <span className={styles.label}>참가 보증금</span>
              <span className={styles.value}>{challenge.supportAmount.toLocaleString()}원</span>
              <span className={styles.subText}>100% 달성 시 전액 환급</span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.conditionItem}>
            <Info className={styles.icon} size={20} />
            <div className={styles.conditionInfo}>
              <span className={styles.label}>참가비</span>
              <span className={styles.value}>0원</span>
              <span className={styles.subText}>모임 운영 비용</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.memberHeader}>
          <h2 className={styles.sectionTitle}>
            참여 멤버 <span className={styles.memberCount}>{challenge.memberCount.current}/{challenge.memberCount.max}</span>
          </h2>
        </div>
        <div className={styles.memberList}>
          {memberList.map((member) => (
            <Avatar key={member.memberId} name={member.user.nickname} src={member.user.profileImage} size="sm" className={styles.memberAvatar} />
          ))}
          {challenge.memberCount.current > 4 && (
            <div className={styles.moreMembers}>+{challenge.memberCount.current - 4}</div>
          )}
        </div>
      </div>

      <div className={styles.bottomAction}>
        <Button
          size="lg"
          fullWidth
          onClick={isJoined
            ? () => navigate(CHALLENGE_ROUTES.detail(challengeRef || challenge.challengeId, challenge.title))
            : handleJoin}
          disabled={!isJoined && challenge.status === 'COMPLETED'}
        >
          {isJoined ? '입장하기' : '챌린지 참여하기'}
        </Button>
      </div>
    </PageContainer>
  );
}
