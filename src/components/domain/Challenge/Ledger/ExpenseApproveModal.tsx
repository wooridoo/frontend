import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useApproveExpense } from '@/hooks/useExpense';
import { useExpenseApproveModalStore, useExpenseDetailModalStore } from '@/store/modal/useModalStore';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ExpenseApproveModal() {
  const { isOpen, challengeId, expenseId, onClose } = useExpenseApproveModalStore();
  const { onOpen: openDetail } = useExpenseDetailModalStore();
  const approveExpense = useApproveExpense(challengeId || '');
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleApprove = async (approved: boolean) => {
    if (!expenseId) return;
    try {
      await approveExpense.mutateAsync({ expenseId, approved, reason: reason.trim() || undefined });
      handleClose();
      if (challengeId && expenseId) {
        openDetail(challengeId, expenseId);
      }
    } catch {
      // 보조 처리
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">지출 승인</h2>
        <p className="text-sm text-gray-600">승인 또는 거절 사유를 남길 수 있습니다.</p>
        <textarea
          className="w-full border rounded-md px-3 py-2"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="사유(선택)"
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={() => void handleApprove(false)}
            disabled={approveExpense.isPending}
          >
            거절
          </Button>
          <Button onClick={() => void handleApprove(true)} disabled={approveExpense.isPending}>
            승인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
