import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Clock, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { useJoinModalStore } from '@/store/useJoinModalStore';
import { getChallenge, isParticipant } from '@/lib/api/challenge';
import styles from './ChallengeDetailPage.module.css';

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onOpen } = useJoinModalStore();

  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id!),
    enabled: !!id,
  });

  const handleJoin = () => {
    if (challenge) {
      onOpen(String(challenge.challengeId));
    }
  };

  const isJoined = challenge ? isParticipant(challenge.challengeId) : false;

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="챌린지 상세" showBack />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </PageContainer>
    );
  }

  if (error || !challenge) {
    return (
      <PageContainer>
        <PageHeader title="챌린지 상세" showBack />
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <div className="text-gray-500">챌린지 정보를 불러올 수 없습니다.</div>
          <Button variant="ghost" onClick={() => navigate(-1)}>뒤로 가기</Button>
        </div>
      </PageContainer>
    );
  }

  // 데이터 매핑 (API -> UI)
  const frequency = '매일'; // API에 없으면 기본값 또는 추가 필드 필요
  const duration = `${(new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)}일`;

  // 멤버 프로필 이미지는 API에 없으므로 임시 처리 (멤버 리스트 API 별도 호출 필요할 수 있음)
  const memberList = Array(Math.min(challenge.memberCount.current, 4)).fill(null).map((_, i) => ({
    id: i,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
  }));

  return (
    <PageContainer>
      <PageHeader title="챌린지 상세" showBack />

      <div className={styles.heroSection}>
        <div className={styles.categoryBadge}>
          <Badge variant="default">{challenge.category}</Badge>
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
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${challenge.leader.nickname}`} alt="Host" className={styles.hostAvatar} />
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
            <img key={member.id} src={member.avatar} alt="Member" className={styles.memberAvatar} />
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
          onClick={handleJoin}
          disabled={isJoined || challenge.status === 'COMPLETED'}
        >
          {isJoined ? '이미 참여중입니다' : '챌린지 참여하기'}
        </Button>
      </div>
    </PageContainer>
  );
}
