import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button, Input } from '@/components/ui';
import { useCreateExpense } from '@/hooks/useExpense';
import { useChallengeMeetings } from '@/hooks/useMeeting';
import { useExpenseCreateModalStore } from '@/store/modal/useModalStore';
import { ExpenseField, ExpenseModalLayout } from './ExpenseModalLayout';
import layoutStyles from './ExpenseModalLayout.module.css';

const getMinDeadline = () => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ExpenseCreateModal() {
  const { isOpen, challengeId, onClose } = useExpenseCreateModalStore();
  const { data: meetings = [] } = useChallengeMeetings(challengeId || undefined);
  const createExpense = useCreateExpense(challengeId || '');

  const [meetingId, setMeetingId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMeetingId('');
    setTitle('');
    setDescription('');
    setAmount('');
    setReceiptUrl('');
    setDeadline('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!challengeId) {
      setError('챌린지 정보가 없습니다.');
      return;
    }
    if (!meetingId) {
      setError('대상 모임을 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('금액을 확인해주세요.');
      return;
    }
    if (!deadline) {
      setError('마감 일시를 입력해주세요.');
      return;
    }
    const deadlineDate = new Date(deadline);
    if (Number.isNaN(deadlineDate.getTime()) || deadlineDate.getTime() < new Date(Date.now() + 24 * 60 * 60 * 1000).getTime()) {
      setError('마감 일시는 현재 시각 기준 최소 24시간 이후여야 합니다.');
      return;
    }

    try {
      await createExpense.mutateAsync({
        meetingId,
        title: title.trim(),
        description: description.trim() || undefined,
        amount: parsedAmount,
        category: 'OTHER',
        receiptUrl: receiptUrl.trim() || undefined,
        deadline,
      });
      handleClose();
    } catch (createError) {
      if (createError instanceof Error && createError.message) {
        setError(createError.message);
      } else {
        setError('지출 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ExpenseModalLayout
        title="지출 등록"
        description="모임 지출은 생성 후 투표를 통해 승인/거절됩니다."
        footer={(
          <>
            <Button variant="ghost" onClick={handleClose}>
              취소
            </Button>
            <Button onClick={() => void handleSubmit()} disabled={createExpense.isPending}>
              {createExpense.isPending ? '등록 중...' : '등록'}
            </Button>
          </>
        )}
      >
        <ExpenseField label="대상 모임" htmlFor="expense-meeting">
          <select
            id="expense-meeting"
            className={layoutStyles.select}
            value={meetingId}
            onChange={(event) => setMeetingId(event.target.value)}
          >
            <option value="">모임을 선택하세요</option>
            {meetings.map((meeting) => (
              <option key={meeting.meetingId} value={meeting.meetingId}>
                {meeting.title}
              </option>
            ))}
          </select>
        </ExpenseField>

        <ExpenseField label="제목" htmlFor="expense-title">
          <Input
            id="expense-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </ExpenseField>

        <ExpenseField label="금액" htmlFor="expense-amount">
          <Input
            id="expense-amount"
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </ExpenseField>

        <ExpenseField label="마감 일시" htmlFor="expense-deadline">
          <input
            id="expense-deadline"
            type="datetime-local"
            className={layoutStyles.dateInput}
            min={getMinDeadline()}
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </ExpenseField>

        <ExpenseField label="설명" htmlFor="expense-description">
          <textarea
            id="expense-description"
            className={layoutStyles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </ExpenseField>

        <ExpenseField label="영수증 주소" htmlFor="expense-receipt">
          <Input
            id="expense-receipt"
            value={receiptUrl}
            onChange={(event) => setReceiptUrl(event.target.value)}
          />
        </ExpenseField>

        {error ? <p className={layoutStyles.error}>{error}</p> : null}
      </ExpenseModalLayout>
    </Modal>
  );
}
