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
      return 'Past date/time is not allowed.';
    }

    if (dateTime < minAllowed) {
      return 'Meeting must be scheduled at least 24 hours later.';
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!challengeId) {
      setError('Invalid challenge context.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a meeting title.');
      return;
    }
    if (!formData.meetingDate) {
      setError('Please select a meeting date.');
      return;
    }
    if (!formData.meetingTime) {
      setError('Please select a meeting time.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter meeting location or online link.');
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
          : 'Failed to create meeting.';
      setError(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create Regular Meeting</h2>

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Week 3 regular meeting"
              value={formData.title}
              onChange={event => handleChange('title', event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Describe agenda or check-in details"
              value={formData.description}
              onChange={event => handleChange('description', event.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date *</label>
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
              <label className={styles.label}>Time *</label>
              <input
                type="time"
                className={styles.input}
                value={formData.meetingTime}
                onChange={event => handleChange('meetingTime', event.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Meeting Type</label>
            <div className={styles.locationToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${formData.locationType === 'OFFLINE' ? styles.active : ''}`}
                onClick={() => handleChange('locationType', 'OFFLINE')}
              >
                Offline
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${formData.locationType === 'ONLINE' ? styles.active : ''}`}
                onClick={() => handleChange('locationType', 'ONLINE')}
              >
                Online
              </button>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{formData.locationType === 'OFFLINE' ? 'Location *' : 'Meeting Link *'}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={formData.locationType === 'OFFLINE' ? 'e.g. Gangnam workspace' : 'https://zoom.us/...'}
              value={formData.location}
              onChange={event => handleChange('location', event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Max Participants</label>
            <select
              className={styles.select}
              value={formData.maxParticipants}
              onChange={event => handleChange('maxParticipants', Number(event.target.value))}
            >
              {[5, 10, 15, 20, 30, 50, 100].map(count => (
                <option key={count} value={count}>
                  {count} members
                </option>
              ))}
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Button onClick={handleClose} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className={styles.submitButton} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Meeting'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
