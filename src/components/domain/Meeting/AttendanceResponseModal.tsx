import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useAttendanceModalStore } from '@/store/modal/useModalStore';
import { useRespondAttendance } from '@/hooks/useMeeting';
import { Calendar, MapPin } from 'lucide-react';
import styles from './MeetingModal.module.css';

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
            // Error handled by mutation
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
                        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ margin: '0 0 var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                {meeting.title}
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 0, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                <Calendar size={14} /> {formatDate(meeting.meetingDate)}
                            </p>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-xs) 0 0', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                <MapPin size={14} /> {meeting.location}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <Button
                                onClick={() => handleResponse('AGREE')}
                                disabled={respondMutation.isPending}
                                style={{ background: '#22c55e' }}
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
                                onClick={() => handleResponse('DISAGREE')}
                                disabled={respondMutation.isPending}
                                variant="secondary"
                                style={{ color: '#ef4444' }}
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
