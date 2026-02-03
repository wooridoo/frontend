import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import styles from './RegularMeetingDetail.module.css';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { useMeeting, useAttendMeeting } from '@/hooks/useMeeting';

export function RegularMeetingDetail() {
  const { meetingId } = useParams<{ meetingId: string }>();

  return (
    <div className={styles.container}>
      {/* 
          No explicit PageHeader here because it's nested in ChallengeDashboardLayout.
          We might want a small sub-header or breadcrumb if needed.
      */}
      <Suspense fallback={<RegularMeetingSkeleton />}>
        <RegularMeetingContent id={meetingId} />
      </Suspense>
    </div>
  );
}

function RegularMeetingContent({ id }: { id?: string }) {
  const { data, isLoading } = useMeeting(id);
  const { mutate: attend, isPending } = useAttendMeeting();

  if (isLoading) return <RegularMeetingSkeleton />;
  if (!data) return <div>모임을 찾을 수 없습니다.</div>;

  const isAttending = data.myStatus === 'ATTENDING';

  const handleAction = async () => {
    const newStatus = isAttending ? 'ABSENT' : 'ATTENDING';
    if (confirm(isAttending ? '참석을 취소하시겠습니까?' : '참석하시겠습니까?')) {
      await attend(data.id, newStatus);
      alert(isAttending ? '참석이 취소되었습니다.' : '참석 신청되었습니다.');
    }
  };

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.meetingTitle}>{data.title}</h2>

        <div className={styles.infoRow}>
          <span>📅</span>
          <span>{new Date(data.date).toLocaleString('ko-KR', {
            month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit'
          })}</span>
        </div>

        <div className={styles.infoRow}>
          <span>📍</span>
          <span>{data.isOnline ? '온라인 모임' : data.location}</span>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>모임 소개</h3>
        <p className={styles.description}>{data.description}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          참석자 ({data.currentMembers}/{data.maxMembers})
        </h3>
        <div className={styles.memberList}>
          {data.members?.map(member => (
            <div key={member.userId} className={styles.memberItem}>
              <img src={member.profileImage} alt={member.nickname} className={styles.memberAvatar} />
              <span className={styles.memberName}>{member.nickname}</span>
            </div>
          ))}
          {data.currentMembers === 0 && (
            <div className="text-gray-400 text-sm">아직 참석자가 없습니다.</div>
          )}
        </div>
      </section>

      <div className={styles.floatingContainer}>
        <button
          className={`${styles.actionButton} ${isAttending ? styles.cancel : ''}`}
          onClick={handleAction}
          disabled={isPending}
        >
          {isPending ? '처리 중...' : (isAttending ? '참석 취소하기' : '참석하기')}
        </button>
      </div>
    </>
  );
}

function RegularMeetingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-3/4 h-8" />
      <Skeleton className="w-1/2 h-6" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-20" />
    </div>
  );
}
