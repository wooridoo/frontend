import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useEditMeetingModalStore } from '@/store/useEditMeetingModalStore';
import { useUpdateMeeting } from '@/hooks/useMeeting';
import styles from './MeetingModal.module.css';

type LocationType = 'OFFLINE' | 'ONLINE';

interface FormData {
    title: string;
    description: string;
    meetingDate: string;
    meetingTime: string;
    locationType: LocationType;
    location: string;
    maxParticipants: number;
}

const defaultFormData: FormData = {
    title: '',
    description: '',
    meetingDate: '',
    meetingTime: '',
    locationType: 'OFFLINE',
    location: '',
    maxParticipants: 10,
};

export function EditMeetingModal() {
    const { isOpen, meeting, onClose } = useEditMeetingModalStore();

    // Derive initial form data from meeting using useMemo
    const initialFormData = useMemo(() => {
        if (!meeting) return defaultFormData;
        const dateTime = new Date(meeting.meetingDate);
        return {
            title: meeting.title,
            description: meeting.description || '',
            meetingDate: dateTime.toISOString().split('T')[0],
            meetingTime: dateTime.toTimeString().slice(0, 5),
            locationType: (meeting.isOnline ? 'ONLINE' : 'OFFLINE') as LocationType,
            location: meeting.location,
            maxParticipants: meeting.maxMembers ?? defaultFormData.maxParticipants,
        };
    }, [meeting]);

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const updateMutation = useUpdateMeeting();

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const handleChange = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!meeting) return;

        if (!formData.title.trim()) {
            setError('모임 제목을 입력해주세요');
            return;
        }

        try {
            const dateTime = `${formData.meetingDate}T${formData.meetingTime}:00`;
            await updateMutation.mutateAsync({
                meetingId: meeting.meetingId,
                title: formData.title,
                description: formData.description,
                meetingDate: dateTime,
                locationType: formData.locationType,
                location: formData.location,
                maxParticipants: formData.maxParticipants,
            });
            handleClose();
        } catch {
            setError('모임 수정에 실패했습니다');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>모임 수정</h2>

                <div className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>모임 제목 *</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>모임 설명</label>
                        <textarea
                            className={styles.textarea}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>날짜</label>
                            <input
                                type="date"
                                className={styles.input}
                                value={formData.meetingDate}
                                onChange={(e) => handleChange('meetingDate', e.target.value)}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>시간</label>
                            <input
                                type="time"
                                className={styles.input}
                                value={formData.meetingTime}
                                onChange={(e) => handleChange('meetingTime', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>모임 방식</label>
                        <div className={styles.locationToggle}>
                            <button
                                type="button"
                                className={`${styles.toggleButton} ${formData.locationType === 'OFFLINE' ? styles.active : ''}`}
                                onClick={() => handleChange('locationType', 'OFFLINE')}
                            >
                                🏢 오프라인
                            </button>
                            <button
                                type="button"
                                className={`${styles.toggleButton} ${formData.locationType === 'ONLINE' ? styles.active : ''}`}
                                onClick={() => handleChange('locationType', 'ONLINE')}
                            >
                                💻 온라인
                            </button>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            {formData.locationType === 'OFFLINE' ? '장소' : '링크'}
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>최대 참여 인원</label>
                        <select
                            className={styles.select}
                            value={formData.maxParticipants}
                            onChange={(e) => handleChange('maxParticipants', Number(e.target.value))}
                        >
                            {[5, 10, 15, 20, 30, 50, 100].map((n) => (
                                <option key={n} value={n}>{n}명</option>
                            ))}
                        </select>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.actions}>
                        <Button onClick={handleClose} className={styles.cancelButton}>
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? '수정 중...' : '수정하기'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
