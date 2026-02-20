import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useEditMeetingModalStore } from '@/store/modal/useModalStore';
import { useUpdateMeeting } from '@/hooks/useMeeting';
import type { Meeting } from '@/types/meeting';
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

function toFormData(meeting: Meeting): FormData {
  const dateTime = new Date(meeting.meetingDate);
  return {
    title: meeting.title,
    description: meeting.description || '',
    meetingDate: dateTime.toISOString().split('T')[0],
    meetingTime: dateTime.toTimeString().slice(0, 5),
    locationType: meeting.isOnline ? 'ONLINE' : 'OFFLINE',
    location: meeting.location,
    maxParticipants: meeting.maxMembers ?? 10,
  };
}

interface EditMeetingModalContentProps {
  meeting: Meeting;
  onClose: () => void;
}

function EditMeetingModalContent({ meeting, onClose }: EditMeetingModalContentProps) {
  const updateMutation = useUpdateMeeting();
  const [formData, setFormData] = useState<FormData>(() => toFormData(meeting));
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('모임 제목을 입력해 주세요.');
      return;
    }
    if (!formData.meetingDate || !formData.meetingTime) {
      setError('모임 날짜와 시간을 입력해 주세요.');
      return;
    }
    if (!formData.location.trim()) {
      setError('장소 또는 온라인 링크를 입력해 주세요.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        meetingId: meeting.meetingId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        meetingDate: `${formData.meetingDate}T${formData.meetingTime}:00`,
        locationType: formData.locationType,
        location: formData.location.trim(),
        maxParticipants: formData.maxParticipants,
      });
      handleClose();
    } catch {
      setError('모임 수정에 실패했습니다.');
    }
  };

  return (
    <Modal isOpen onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>모임 수정</h2>

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>제목 *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={event => handleChange('title', event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>설명</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={event => handleChange('description', event.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>날짜</label>
              <input
                type="date"
                className={styles.input}
                value={formData.meetingDate}
                onChange={event => handleChange('meetingDate', event.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>시간</label>
              <input
                type="time"
                className={styles.input}
                value={formData.meetingTime}
                onChange={event => handleChange('meetingTime', event.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>모임 유형</label>
            <div className={styles.locationToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${formData.locationType === 'OFFLINE' ? styles.active : ''}`}
                onClick={() => handleChange('locationType', 'OFFLINE')}
              >
                오프라인
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${formData.locationType === 'ONLINE' ? styles.active : ''}`}
                onClick={() => handleChange('locationType', 'ONLINE')}
              >
                온라인
              </button>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{formData.locationType === 'OFFLINE' ? '장소' : '온라인 링크'}</label>
            <input
              type="text"
              className={styles.input}
              value={formData.location}
              onChange={event => handleChange('location', event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>최대 참여 인원</label>
            <select
              className={styles.select}
              value={formData.maxParticipants}
              onChange={event => handleChange('maxParticipants', Number(event.target.value))}
            >
              {[5, 10, 15, 20, 30, 50, 100].map(count => (
                <option key={count} value={count}>
                  {count}명
                </option>
              ))}
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Button onClick={handleClose} className={styles.cancelButton}>
              취소
            </Button>
            <Button onClick={handleSubmit} className={styles.submitButton} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function EditMeetingModal() {
  const { isOpen, meeting, onClose } = useEditMeetingModalStore();

  if (!isOpen || !meeting) {
    return null;
  }

  return <EditMeetingModalContent key={meeting.meetingId} meeting={meeting} onClose={onClose} />;
}
