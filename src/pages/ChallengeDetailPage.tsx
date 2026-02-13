import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Clock, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { useJoinModalStore } from '@/store/modal/useModalStore';
import { getChallenge } from '@/lib/api/challenge';
import { getChallengeMembers } from '@/lib/api/member';
import { isParticipant } from '@/lib/utils/challengeUtils';
import { getCategoryLabel } from '@/lib/utils/categoryLabels';
import { Avatar } from '@/components/ui/Avatar';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import styles from './ChallengeDetailPage.module.css';

import { useAuthStore } from '@/store/useAuthStore';
import { useMemo } from 'react';

// ...

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onOpen } = useJoinModalStore();
  const { user } = useAuthStore();

  const { data: challenge, isLoading: isChallengeLoading, error } = useQuery({
    // ... (keep usage of getChallenge)
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id!),
    enabled: !!id,
  });

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['challengeMembers', id],
    queryFn: () => getChallengeMembers(id!),
    enabled: !!id,
  });

  const isJoined = useMemo(() => {
    if (!challenge) return false;
    // 1. Check global store (fast)
    if (isParticipant(challenge.challengeId)) return true;
    // 2. Check fetched member list (reliable)
    if (user && membersData?.members) {
      return membersData.members.some(member => String(member.user.userId) === String(user.userId));
    }
    return false;
  }, [challenge, membersData, user]);

  const handleJoin = () => {
    if (isJoined) return; // Prevent join if already joined
    if (challenge) {
      onOpen(String(challenge.challengeId));
    }
  };

  const isLoading = isChallengeLoading || isMembersLoading;

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="챌린지 상세" showBack />
        <div className={styles.stateContainer}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-grey-400)' }} />
        </div>
      </PageContainer>
    );
  }

  if (error || !challenge) {
    return (
      <PageContainer>
        <PageHeader title="챌린지 상세" showBack />
        <div className={styles.stateContainer}>
          <div className={styles.stateText}>챌린지 정보를 불러올 수 없습니다.</div>
          <Button variant="ghost" onClick={() => navigate(-1)}>뒤로 가기</Button>
        </div>
      </PageContainer>
    );
  }

  // 데이터 매핑 (API -> UI)
  const frequency = '매일'; // API에 없으면 기본값 또는 추가 필드 필요
  const duration = `${(new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)}일`;

  const memberList = membersData?.members?.slice(0, 4) || [];

  return (
    <PageContainer>
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
          {/* 리더 프로필 이미지 API 부재로 기본 이미지 사용 */}
          <Avatar
            name={challenge.leader.nickname}
            src={null} // 리더 프로필 이미지가 API에 아직 없음
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
          className={styles.joinButton}
          onClick={isJoined ? () => navigate(CHALLENGE_ROUTES.detail(challenge.challengeId)) : handleJoin}
          disabled={!isJoined && challenge.status === 'COMPLETED'}
        >
          {isJoined ? '입장하기' : '챌린지 참여하기'}
        </Button>
      </div>
    </PageContainer>
  );
}
