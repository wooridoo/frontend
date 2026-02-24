import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useApproveExpense } from '@/hooks/useExpense';
import { useExpenseApproveModalStore, useExpenseDetailModalStore } from '@/store/modal/useModalStore';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { ExpenseField, ExpenseModalLayout } from './ExpenseModalLayout';
import layoutStyles from './ExpenseModalLayout.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ExpenseApproveModal() {
  const { isOpen, challengeId, expenseId, onClose } = useExpenseApproveModalStore();
  const { onOpen: openDetail } = useExpenseDetailModalStore();
  const { confirm } = useConfirmDialog();
  const approveExpense = useApproveExpense(challengeId || '');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  const handleApprove = async (approved: boolean) => {
    if (!expenseId) return;

    if (!approved) {
      const isConfirmed = await confirm({
        title: '지출 요청을 거절하시겠습니까?',
        confirmText: '거절',
        cancelText: '취소',
        variant: 'danger',
      });
      if (!isConfirmed) return;
    }

    try {
      await approveExpense.mutateAsync({ expenseId, approved, reason: reason.trim() || undefined });
      handleClose();
      if (challengeId && expenseId) {
        openDetail(challengeId, expenseId);
      }
    } catch (approveError) {
      if (approveError instanceof Error && approveError.message) {
        setError(approveError.message);
      } else {
        setError('지출 승인 처리에 실패했습니다.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={layoutStyles.modalShell}>
      <ExpenseModalLayout
        title="지출 승인"
        description="승인 또는 거절 사유를 남길 수 있습니다."
        footer={(
          <>
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
          </>
        )}
      >
        <ExpenseField label="사유(선택)" htmlFor="expense-approve-reason">
          <textarea
            id="expense-approve-reason"
            className={layoutStyles.textarea}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="사유를 입력하세요"
          />
        </ExpenseField>
        {error ? <p className={layoutStyles.error}>{error}</p> : null}
      </ExpenseModalLayout>
    </Modal>
  );
}
