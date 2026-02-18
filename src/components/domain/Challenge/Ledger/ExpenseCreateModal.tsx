import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCreateExpense } from '@/hooks/useExpense';
import { useExpenseCreateModalStore } from '@/store/modal/useModalStore';

export function ExpenseCreateModal() {
  const { isOpen, challengeId, onClose } = useExpenseCreateModalStore();
  const createExpense = useCreateExpense(challengeId || '');
  const [meetingId, setMeetingId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMeetingId('');
    setTitle('');
    setDescription('');
    setAmount('');
    setReceiptUrl('');
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
    if (!meetingId.trim()) {
      setError('meetingId를 입력해 주세요.');
      return;
    }
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('금액을 확인해 주세요.');
      return;
    }

    try {
      await createExpense.mutateAsync({
        meetingId: meetingId.trim(),
        title: title.trim(),
        description: description.trim() || undefined,
        amount: parsedAmount,
        category: 'OTHER',
        receiptUrl: receiptUrl.trim() || undefined,
      });
      handleClose();
    } catch {
      setError('지출 생성에 실패했습니다.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">지출 등록</h2>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Meeting ID</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={meetingId}
            onChange={(event) => setMeetingId(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">제목</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">금액</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">설명</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">영수증 URL</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={receiptUrl}
            onChange={(event) => setReceiptUrl(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={createExpense.isPending}>
            {createExpense.isPending ? '등록 중...' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
