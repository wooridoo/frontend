import { Link } from 'react-router-dom';
import { useChallengeMeetings } from '@/hooks/useMeeting';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import styles from './RegularMeetingList.module.css'; // Re-use styles for now

export function RegularMeetingList({ challengeId }: { challengeId?: string }) {
  const { data, isLoading } = useChallengeMeetings(challengeId);

  if (isLoading) return <Skeleton className="w-full h-24" />;
  if (!data || data.length === 0) return <div className="text-gray-500 py-4">예정된 모임이 없습니다.</div>;

  return (
    <div className={styles.meetingList}>
      {data.map(meeting => (
        <Link key={meeting.id} to={`/meetings/${meeting.id}`} className={styles.meetingItem}>
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
  );
}
