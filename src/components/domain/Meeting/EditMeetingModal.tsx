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
      setError('Please enter a meeting title.');
      return;
    }
    if (!formData.meetingDate || !formData.meetingTime) {
      setError('Please set date and time.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter location or meeting link.');
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
      setError('Failed to update meeting.');
    }
  };

  return (
    <Modal isOpen onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Meeting</h2>

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={event => handleChange('title', event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={event => handleChange('description', event.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                className={styles.input}
                value={formData.meetingDate}
                onChange={event => handleChange('meetingDate', event.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Time</label>
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
            <label className={styles.label}>{formData.locationType === 'OFFLINE' ? 'Location' : 'Meeting Link'}</label>
            <input
              type="text"
              className={styles.input}
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
            <Button onClick={handleSubmit} className={styles.submitButton} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update Meeting'}
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
