import { useParams } from 'react-router-dom';
import { Calendar, DollarSign, Clock, Info } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { useJoinModalStore } from '@/store/useJoinModalStore';
import styles from './ChallengeDetailPage.module.css';

// Mock Data
const MOCK_CHALLENGE = {
  id: '1',
  title: '매일 아침 6시 기상 챌린지',
  category: 'LIFE',
  description: '아침 시간을 활용해 하루를 알차게 시작해보세요! 매일 6시 기상 인증샷을 올리고 서로 응원합니다.',
  host: {
    nickname: '아침형인간',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  },
  frequency: '매일',
  duration: '4주',
  startDate: '2026.03.01',
  endDate: '2026.03.28',
  deposit: 10000,
  entryFee: 3000,
  participantCount: 15,
  maxParticipants: 20,
  members: [
    { id: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    { id: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { id: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    { id: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
  ],
};

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  // TODO: Fetch challenge detail by id using query
  console.log('Challenge ID:', id);

  const { onOpen } = useJoinModalStore();
  const challenge = MOCK_CHALLENGE; // Replace with data

  const handleJoin = () => {
    onOpen(challenge.id);
  };

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
            <Clock size={14} /> {challenge.frequency}
          </span>
          <span className={styles.tag}>
            <Calendar size={14} /> {challenge.duration}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>챌린지 소개</h2>
        <p className={styles.description}>{challenge.description}</p>
        <div className={styles.hostInfo}>
          <img src={challenge.host.avatarUrl} alt="Host" className={styles.hostAvatar} />
          <div className={styles.hostText}>
            <span className={styles.hostLabel}>개설자</span>
            <span className={styles.hostName}>{challenge.host.nickname}</span>
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
              <span className={styles.value}>{challenge.deposit.toLocaleString()}원</span>
              <span className={styles.subText}>100% 달성 시 전액 환급</span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.conditionItem}>
            <Info className={styles.icon} size={20} />
            <div className={styles.conditionInfo}>
              <span className={styles.label}>참가비</span>
              <span className={styles.value}>{challenge.entryFee.toLocaleString()}원</span>
              <span className={styles.subText}>모임 운영 비용</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.memberHeader}>
          <h2 className={styles.sectionTitle}>
            참여 멤버 <span className={styles.memberCount}>{challenge.participantCount}/{challenge.maxParticipants}</span>
          </h2>
        </div>
        <div className={styles.memberList}>
          {challenge.members.map((member) => (
            <img key={member.id} src={member.avatar} alt="Member" className={styles.memberAvatar} />
          ))}
          {challenge.participantCount > 4 && (
            <div className={styles.moreMembers}>+{challenge.participantCount - 4}</div>
          )}
        </div>
      </div>

      <div className={styles.bottomAction}>
        <Button size="lg" className={styles.joinButton} onClick={handleJoin}>
          챌린지 참여하기
        </Button>
      </div>
    </PageContainer>
  );
}
