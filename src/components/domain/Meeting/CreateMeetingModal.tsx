import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCreateMeetingModalStore } from '@/store/useCreateMeetingModalStore';
import { useCreateMeeting } from '@/hooks/useMeeting';
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

const initialFormData: FormData = {
    title: '',
    description: '',
    meetingDate: '',
    meetingTime: '',
    locationType: 'OFFLINE',
    location: '',
    maxParticipants: 10,
};

export function CreateMeetingModal() {
    const { isOpen, challengeId, onClose } = useCreateMeetingModalStore();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const createMutation = useCreateMeeting();

    const handleClose = () => {
        setFormData(initialFormData);
        setError(null);
        onClose();
    };

    const handleChange = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title.trim()) {
            setError('모임 제목을 입력해주세요');
            return;
        }
        if (!formData.meetingDate) {
            setError('모임 날짜를 선택해주세요');
            return;
        }
        if (!formData.meetingTime) {
            setError('모임 시간을 선택해주세요');
            return;
        }
        if (!formData.location.trim()) {
            setError('모임 장소/링크를 입력해주세요');
            return;
        }

        try {
            const dateTime = `${formData.meetingDate}T${formData.meetingTime}:00`;
            await createMutation.mutateAsync({
                challengeId: challengeId!,
                title: formData.title,
                description: formData.description,
                meetingDate: dateTime,
                locationType: formData.locationType,
                location: formData.location,
                maxParticipants: formData.maxParticipants,
            });
            handleClose();
        } catch {
            setError('모임 생성에 실패했습니다');
        }
    };

    // Get tomorrow's date for min date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>정기모임 만들기</h2>

                <div className={styles.form}>
                    {/* Title */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>모임 제목 *</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="예: 3월 첫째 주 정기모임"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>모임 설명</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="모임에 대한 간단한 설명을 적어주세요"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    {/* Date & Time */}
                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>날짜 *</label>
                            <input
                                type="date"
                                className={styles.input}
                                value={formData.meetingDate}
                                min={minDate}
                                onChange={(e) => handleChange('meetingDate', e.target.value)}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>시간 *</label>
                            <input
                                type="time"
                                className={styles.input}
                                value={formData.meetingTime}
                                onChange={(e) => handleChange('meetingTime', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location Type */}
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

                    {/* Location */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            {formData.locationType === 'OFFLINE' ? '장소 *' : '화상회의 링크 *'}
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={formData.locationType === 'OFFLINE' ? '예: 강남역 스타벅스' : 'https://zoom.us/...'}
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                    </div>

                    {/* Max Participants */}
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

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Button onClick={handleClose} className={styles.cancelButton}>
                            취소
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? '생성 중...' : '모임 만들기'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
