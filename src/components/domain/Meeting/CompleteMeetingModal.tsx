import { useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCompleteMeetingModalStore } from '@/store/modal/useModalStore';
import { useCompleteMeeting } from '@/hooks/useMeeting';
import styles from './MeetingModal.module.css';

export function CompleteMeetingModal() {
  const { isOpen, meeting, onClose } = useCompleteMeetingModalStore();
  const completeMutation = useCompleteMeeting();
  const attendees = useMemo(() => meeting?.members ?? [], [meeting]);
  const [selectionOverrides, setSelectionOverrides] = useState<Record<string, boolean>>({});

  const selectedIds = useMemo(
    () => attendees.filter((member) => selectionOverrides[member.userId] ?? true).map((member) => member.userId),
    [attendees, selectionOverrides],
  );

  const handleClose = () => {
    setSelectionOverrides({});
    onClose();
  };

  const handleToggle = (userId: string) => {
    setSelectionOverrides((prev) => {
      const effectiveSelected = prev[userId] ?? true;
      const nextSelected = !effectiveSelected;

      if (nextSelected) {
        const next = { ...prev };
        delete next[userId];
        return next;
      }

      return {
        ...prev,
        [userId]: false,
      };
    });
  };

  const handleComplete = async () => {
    if (!meeting || selectedIds.length === 0) return;

    try {
      await completeMutation.mutateAsync({
        meetingId: meeting.meetingId,
        actualAttendees: selectedIds,
        notes: '',
      });
      handleClose();
    } catch {
      // handled by global api error handler
    }
  };

  const canSubmit = selectedIds.length > 0 && attendees.length > 0 && !completeMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>모임 완료</h2>

        {meeting ? (
          <>
            <p className={styles.completeDescription}>
              실제 참석자를 선택한 뒤 완료 처리해 주세요.
              <br />
              참석자 선택 결과가 지출 투표 참여 자격에 반영됩니다.
            </p>

            <div className={styles.attendeeList}>
              {attendees.length > 0 ? (
                attendees.map((member) => (
                  <label key={member.userId} className={styles.attendeeItem}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.userId)}
                      onChange={() => handleToggle(member.userId)}
                    />
                    <span className={styles.attendeeName}>{member.nickname}</span>
                  </label>
                ))
              ) : (
                <p className={styles.error}>참석 응답이 AGREE인 멤버가 없어 완료할 수 없습니다.</p>
              )}
            </div>

            <div className={styles.actions}>
              <Button onClick={handleClose} className={styles.cancelButton}>
                취소
              </Button>
              <Button
                onClick={handleComplete}
                className={styles.submitButton}
                disabled={!canSubmit}
              >
                {completeMutation.isPending ? '처리 중...' : '모임 완료'}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
