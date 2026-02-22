import { useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCreateMeetingModalStore } from '@/store/modal/useModalStore';
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

const INITIAL_FORM_DATA: FormData = {
  title: '',
  description: '',
  meetingDate: '',
  meetingTime: '',
  locationType: 'OFFLINE',
  location: '',
  maxParticipants: 10,
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function CreateMeetingModal() {
  const { isOpen, challengeId, onClose } = useCreateMeetingModalStore();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateMeeting();

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateDateTime = () => {
    if (!formData.meetingDate || !formData.meetingTime) {
      return null;
    }

    const dateTime = new Date(`${formData.meetingDate}T${formData.meetingTime}:00`);
    const now = new Date();
    const minAllowed = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (dateTime < now) {
      return '현재 시각 이전으로는 설정할 수 없습니다.';
    }

    if (dateTime < minAllowed) {
      return '모임 시간은 최소 24시간 이후로 설정해야 합니다.';
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!challengeId) {
      setError('챌린지 정보가 올바르지 않습니다.');
      return;
    }

    if (!formData.title.trim()) {
      setError('모임 제목을 입력해 주세요.');
      return;
    }
    if (!formData.meetingDate) {
      setError('모임 날짜를 선택해 주세요.');
      return;
    }
    if (!formData.meetingTime) {
      setError('모임 시간을 선택해 주세요.');
      return;
    }
    if (!formData.location.trim()) {
      setError('장소 또는 온라인 링크를 입력해 주세요.');
      return;
    }

    const dateTimeError = validateDateTime();
    if (dateTimeError) {
      setError(dateTimeError);
      return;
    }

    const meetingDate = `${formData.meetingDate}T${formData.meetingTime}:00`;

    try {
      await createMutation.mutateAsync({
        challengeId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        meetingDate,
        locationType: formData.locationType,
        location: formData.location.trim(),
        maxParticipants: formData.maxParticipants,
      });
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : '모임 생성에 실패했습니다.';
      setError(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>정기 모임 만들기</h2>

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>제목 *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="예: 3주차 정기 모임"
              value={formData.title}
              onChange={event => handleChange('title', event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>설명</label>
            <textarea
              className={styles.textarea}
              placeholder="안건이나 진행 방식을 입력해 주세요."
              value={formData.description}
              onChange={event => handleChange('description', event.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>날짜 *</label>
              <input
                type="date"
                className={styles.input}
                value={formData.meetingDate}
                min={minDate}
                onKeyDown={event => event.preventDefault()}
                onChange={event => handleChange('meetingDate', event.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>시간 *</label>
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
              <Button
                className={`${styles.toggleButton} ${formData.locationType === 'OFFLINE' ? styles.active : ''}`}
                onClick={() => handleChange('locationType', 'OFFLINE')}
                size="sm"
                variant={formData.locationType === 'OFFLINE' ? 'primary' : 'ghost'}
              >
                오프라인
              </Button>
              <Button
                className={`${styles.toggleButton} ${formData.locationType === 'ONLINE' ? styles.active : ''}`}
                onClick={() => handleChange('locationType', 'ONLINE')}
                size="sm"
                variant={formData.locationType === 'ONLINE' ? 'primary' : 'ghost'}
              >
                온라인
              </Button>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{formData.locationType === 'OFFLINE' ? '장소 *' : '온라인 링크 *'}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={formData.locationType === 'OFFLINE' ? '예: 강남 스터디룸' : '온라인 회의 링크를 입력하세요'}
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
            <Button onClick={handleClose} fullWidth variant="outline">
              취소
            </Button>
            <Button onClick={handleSubmit} fullWidth disabled={createMutation.isPending}>
              {createMutation.isPending ? '생성 중...' : '모임 만들기'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
