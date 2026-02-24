import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChallengeMeetings } from '@/hooks/useMeeting';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { Button } from '@/components/ui';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { useCreateMeetingModalStore } from '@/store/modal/useModalStore';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import type { MeetingStatusFilter } from '@/lib/api/meeting';
import styles from './RegularMeetingList.module.css';

interface RegularMeetingListProps {
  challengeId?: string;
  challengeRef?: string;
}

type MeetingTab = Extract<MeetingStatusFilter, 'SCHEDULED' | 'COMPLETED'>;

const MEETING_TABS: Array<{ value: MeetingTab; label: string }> = [
  { value: 'SCHEDULED', label: '진행중' },
  { value: 'COMPLETED', label: '완료' },
];

const getMeetingTime = (meetingDate: string): number => {
  const parsedTime = new Date(meetingDate).getTime();
  return Number.isNaN(parsedTime) ? 0 : parsedTime;
};

export function RegularMeetingList({ challengeId, challengeRef }: RegularMeetingListProps) {
  const [activeTab, setActiveTab] = useState<MeetingTab>('SCHEDULED');
  const { data, isLoading } = useChallengeMeetings(challengeId, activeTab);
  const { onOpen } = useCreateMeetingModalStore();

  const meetings = useMemo(() => {
    const meetingList = [...(data || [])];
    if (activeTab === 'SCHEDULED') {
      return meetingList.sort((a, b) => getMeetingTime(a.meetingDate) - getMeetingTime(b.meetingDate));
    }
    return meetingList.sort((a, b) => getMeetingTime(b.meetingDate) - getMeetingTime(a.meetingDate));
  }, [data, activeTab]);

  const emptyMessage = activeTab === 'SCHEDULED'
    ? '진행 중인 모임이 없습니다.'
    : '완료된 모임이 없습니다.';

  const handleOpenCreateModal = () => {
    if (challengeId) {
      onOpen(challengeId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>정기모임</h3>
        {challengeId && (
          <Button size="sm" leadingIcon={<Plus size={16} />} onClick={handleOpenCreateModal}>
            모임 만들기
          </Button>
        )}
      </div>

      <div className={styles.tabs}>
        {MEETING_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            size="sm"
            shape="pill"
            variant={activeTab === tab.value ? 'secondary' : 'ghost'}
            className={activeTab === tab.value ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className={styles.loadingSkeleton} />
      ) : meetings.length === 0 ? (
        <div className={styles.emptyState}>{emptyMessage}</div>
      ) : (
        <div className={styles.meetingList}>
          {meetings.map((meeting) => (
            <Link
              key={meeting.meetingId}
              to={CHALLENGE_ROUTES.meetingDetail(challengeRef || challengeId || '', meeting.meetingId)}
              className={styles.meetingItem}
            >
              <div className={styles.meetingHeader}>
                <span className={styles.meetingTitle}>{meeting.title}</span>
                <span className={styles.meetingStatus}>
                  {meeting.status === 'SCHEDULED' ? '모집중' : '완료'}
                </span>
              </div>
              <div className={styles.meetingInfo}>
                <span>
                  <Calendar size={14} /> {new Date(meeting.meetingDate).toLocaleDateString()}
                </span>
                <span>
                  <MapPin size={14} /> {meeting.displayLocation || (meeting.isOnline ? '온라인' : meeting.location)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
