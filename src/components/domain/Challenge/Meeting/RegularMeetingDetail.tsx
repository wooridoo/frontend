import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { Calendar, MapPin, UserRound } from 'lucide-react';
import styles from './RegularMeetingDetail.module.css';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { useMeeting, useAttendMeeting } from '@/hooks/useMeeting';
import { Modal } from '@/components/ui/Overlay/Modal';

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
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <RegularMeetingSkeleton />;
  if (!data) return <div>모임을 찾을 수 없습니다.</div>;

  const isAttending = data.myAttendance?.status === 'AGREE';

  const handleAction = async () => {
    const newStatus = isAttending ? 'DISAGREE' : 'AGREE';
    await attend(data.meetingId, newStatus);
    setShowModal(false);
    // Removed alert, relies on UI update (button state change)
  };

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
                  <div className={styles.memberAvatar} style={{
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}>
                    <UserRound size={16} />
                  </div>
                )}
                <span className={styles.memberName}>{member.nickname}</span>
              </div>
            ))
          ) : (
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>아직 참석자가 없습니다.</div>
          )}
        </div>
      </section>

      <div className={styles.floatingContainer}>
        <button
          className={`${styles.actionButton} ${isAttending ? styles.cancel : ''}`}
          onClick={() => setShowModal(true)}
          disabled={isPending}
        >
          {isPending ? '처리 중...' : (isAttending ? '참석 취소하기' : '참석하기')}
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} className="w-[90%] max-w-[320px] rounded-2xl">
        <div className="flex flex-col items-center text-center p-2">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {isAttending ? '참석을 취소하시겠습니까?' : '모임에 참석하시겠습니까?'}
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {isAttending
              ? '취소하시면 대기자에게 기회가 넘어갈 수 있습니다.'
              : '참석 버튼을 누르면 신청이 완료됩니다.'}
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
            >
              닫기
            </button>
            <button
              onClick={handleAction}
              className={`flex-1 py-3 rounded-xl font-bold text-white ${isAttending ? 'bg-gray-500' : 'bg-orange-500' // Using Tailwind utility for modal inside, or style module?
                // Modal content is often styled with tailwind in this project based on its props.
                // But I should try to use WDS logical properties if possible or standard styles.
                // Let's use styles from module if possible, or inline styles since Modal className prop expects tailwind classes
                }`}
              style={{ backgroundColor: isAttending ? 'var(--color-grey-500)' : 'var(--color-primary)' }}
            >
              {isAttending ? '취소하기' : '참석하기'}
            </button>
          </div>
        </div>
      </Modal>
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
