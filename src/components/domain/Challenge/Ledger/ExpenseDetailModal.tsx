import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useExpense, useDeleteExpense } from '@/hooks/useExpense';
import { useExpenseApproveModalStore, useExpenseDetailModalStore } from '@/store/modal/useModalStore';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { formatCurrency } from '@/lib/utils';
import { capabilities } from '@/lib/api/capabilities';
import { ExpenseField, ExpenseModalLayout } from './ExpenseModalLayout';
import layoutStyles from './ExpenseModalLayout.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function ExpenseDetailModal() {
  const { isOpen, challengeId, expenseId, onClose } = useExpenseDetailModalStore();
  const { onOpen: openApprove } = useExpenseApproveModalStore();
  const { confirm } = useConfirmDialog();
  const { data: expense, isLoading } = useExpense(challengeId || undefined, expenseId || undefined);
  const deleteExpense = useDeleteExpense(challengeId || '');
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!expenseId) return;

    const isConfirmed = await confirm({
      title: '지출 요청을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'danger',
    });
    if (!isConfirmed) return;

    try {
      await deleteExpense.mutateAsync(expenseId);
      onClose();
    } catch (deleteError) {
      if (deleteError instanceof Error && deleteError.message) {
        setError(deleteError.message);
      } else {
        setError('지출 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={layoutStyles.modalShell}>
      {isLoading ? (
        <div className={layoutStyles.stateText}>불러오는 중...</div>
      ) : !expense ? (
        <div className={layoutStyles.stateText}>지출 정보를 찾을 수 없습니다.</div>
      ) : (
        <ExpenseModalLayout
          title={expense.title}
          description="요청된 지출 상세 정보입니다."
          footer={(
            <>
              {capabilities.expenseActions && expense.status === 'VOTING' && challengeId && expenseId ? (
                <Button
                  onClick={() => openApprove(challengeId, expenseId)}
                  disabled={deleteExpense.isPending}
                >
                  승인/거절
                </Button>
              ) : null}
              {capabilities.expenseCrud && capabilities.legacyExpenseApi && ['VOTING', 'REJECTED'].includes(expense.status) ? (
                <Button variant="danger" onClick={() => void handleDelete()} disabled={deleteExpense.isPending}>
                  삭제
                </Button>
              ) : null}
              <Button variant="ghost" onClick={onClose}>
                닫기
              </Button>
            </>
          )}
        >
          <span className={layoutStyles.statusChip}>상태: {expense.status}</span>
          <p className={layoutStyles.amountText}>{formatCurrency(expense.amount, { withSuffix: true })}</p>

          <ExpenseField label="투표 ID">
            <span className={layoutStyles.metaText}>{expense.voteId}</span>
          </ExpenseField>

          {expense.description ? (
            <ExpenseField label="설명">
              <p className={layoutStyles.metaText}>{expense.description}</p>
            </ExpenseField>
          ) : null}

          <ExpenseField label="요청자">
            <span className={layoutStyles.metaText}>{expense.requestedBy.nickname}</span>
          </ExpenseField>

          {expense.receiptUrl ? (
            <ExpenseField label="영수증">
              <a className={layoutStyles.linkText} href={expense.receiptUrl} target="_blank" rel="noreferrer">
                영수증 보기
              </a>
            </ExpenseField>
          ) : null}

          {error ? <p className={layoutStyles.error}>{error}</p> : null}
        </ExpenseModalLayout>
      )}
    </Modal>
  );
}
