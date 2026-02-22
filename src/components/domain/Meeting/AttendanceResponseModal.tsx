import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useAttendanceModalStore } from '@/store/modal/useModalStore';
import { useRespondAttendance } from '@/hooks/useMeeting';
import { Calendar, MapPin } from 'lucide-react';
import styles from './MeetingModal.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function AttendanceResponseModal() {
    const { isOpen, meeting, onClose } = useAttendanceModalStore();
    const respondMutation = useRespondAttendance();

    const handleResponse = async (status: 'AGREE' | 'DISAGREE' | 'PENDING') => {
        if (!meeting) return;

        try {
            await respondMutation.mutateAsync({
                meetingId: meeting.meetingId,
                status,
            });
            onClose();
        } catch {
            // 보조 처리
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>참석 여부</h2>

                {meeting && (
                    <>
                        <div className={styles.attendanceSummary}>
                            <h3 className={styles.meetingHeading}>
                                {meeting.title}
                            </h3>
                            <p className={styles.metaLine}>
                                <Calendar size={14} /> {formatDate(meeting.meetingDate)}
                            </p>
                            <p className={styles.metaLine}>
                                <MapPin size={14} /> {meeting.location}
                            </p>
                        </div>

                        <div className={styles.responseActions}>
                            <Button
                                className={styles.agreeButton}
                                onClick={() => handleResponse('AGREE')}
                                disabled={respondMutation.isPending}
                            >
                                ✓ 참석
                            </Button>
                            <Button
                                onClick={() => handleResponse('PENDING')}
                                disabled={respondMutation.isPending}
                                variant="secondary"
                            >
                                미정
                            </Button>
                            <Button
                                className={styles.disagreeButton}
                                onClick={() => handleResponse('DISAGREE')}
                                disabled={respondMutation.isPending}
                                variant="secondary"
                            >
                                ✕ 불참
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
