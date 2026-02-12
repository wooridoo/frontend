import { Link } from 'react-router-dom';
import { useChallengeMeetings } from '@/hooks/useMeeting';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useCreateMeetingModalStore } from '@/store/useCreateMeetingModalStore';
import styles from './RegularMeetingList.module.css';

export function RegularMeetingList({ challengeId }: { challengeId?: string }) {
  const { data, isLoading } = useChallengeMeetings(challengeId);
  const { onOpen } = useCreateMeetingModalStore();

  if (isLoading) return <Skeleton className="w-full h-24" />;

  const handleOpenCreateModal = () => {
    if (challengeId) {
      onOpen(challengeId);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">정기모임</h3>
          {challengeId && (
            <Button size="sm" onClick={handleOpenCreateModal}>
              <Plus size={16} className="mr-1" /> 모임 만들기
            </Button>
          )}
        </div>
        <div className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg border border-gray-100">
          예정된 모임이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">정기모임</h3>
        {challengeId && (
          <Button size="sm" onClick={handleOpenCreateModal}>
            <Plus size={16} className="mr-1" /> 모임 만들기
          </Button>
        )}
      </div>
      <div className={styles.meetingList}>
        {data.map(meeting => (
          <Link key={meeting.id} to={`/challenges/${challengeId}/meetings/${meeting.id}`} className={styles.meetingItem}>
            <div className={styles.meetingHeader}>
              <span className={styles.meetingTitle}>{meeting.title}</span>
              <span className={styles.meetingStatus}>
                {meeting.status === 'SCHEDULED' ? '모집중' : '완료'}
              </span>
            </div>
            <div className={styles.meetingInfo}>
              <span>📅 {new Date(meeting.date).toLocaleDateString()}</span>
              <span>📍 {meeting.isOnline ? '온라인' : meeting.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
