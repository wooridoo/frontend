import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { Calendar, Check, MapPin, UserRound } from 'lucide-react';
import styles from './RegularMeetingDetail.module.css';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { useMeeting } from '@/hooks/useMeeting';
import { useAttendanceModalStore, useCompleteMeetingModalStore } from '@/store/modal/useModalStore';
import { Button } from '@/components/ui';

export function RegularMeetingDetail() {
  const { meetingId } = useParams<{ meetingId: string }>();

  return (
    <div className={styles.container}>
      <Suspense fallback={<RegularMeetingSkeleton />}>
        <RegularMeetingContent id={meetingId} />
      </Suspense>
    </div>
  );
}

function RegularMeetingContent({ id }: { id?: string }) {
  const { data, isLoading } = useMeeting(id);
  const { onOpen: openAttendance } = useAttendanceModalStore();
  const { onOpen: openCompleteMeeting } = useCompleteMeetingModalStore();

  if (isLoading) return <RegularMeetingSkeleton />;
  if (!data) return <div className={styles.emptyState}>모임을 찾을 수 없습니다.</div>;

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.meetingTitle}>{data.title}</h2>

        <div className={styles.infoRow}>
          <span><Calendar size={16} /></span>
          <span>{new Date(data.meetingDate).toLocaleString('ko-KR', {
            month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit'
          })}</span>
        </div>

        <div className={styles.infoRow}>
          <span><MapPin size={16} /></span>
          <span>{data.isOnline ? '온라인 모임' : data.location}</span>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>모임 소개</h3>
        <p className={styles.description}>{data.description}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          참석자 ({data.attendance?.confirmed || 0}/{data.attendance?.total || 0})
        </h3>
        <div className={styles.memberList}>
          {data.members && data.members.length > 0 ? (
            data.members.map(member => (
              <div key={member.userId} className={styles.memberItem}>
                {member.profileImage ? (
                  <img src={member.profileImage} alt={member.nickname} className={styles.memberAvatar} />
                ) : (
                  <div className={`${styles.memberAvatar} ${styles.memberAvatarFallback}`}>
                    <UserRound size={16} />
                  </div>
                )}
                <span className={styles.memberName}>{member.nickname}</span>
              </div>
            ))
          ) : (
            <div className={styles.memberEmpty}>아직 참석자가 없습니다.</div>
          )}
        </div>
      </section>

      <div className={styles.floatingContainer}>
        <div className={styles.floatingInner}>
          <Button
            className={styles.actionButton}
            onClick={() => openAttendance(data)}
            fullWidth
          >
            참석 여부 응답
          </Button>
          {data.status !== 'COMPLETED' ? (
            <Button
              className={`${styles.actionButton} ${styles.cancel}`}
              leadingIcon={<Check size={16} />}
              onClick={() => openCompleteMeeting(data)}
              variant="secondary"
              fullWidth
            >
              모임 완료
            </Button>
          ) : null}
        </div>
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
