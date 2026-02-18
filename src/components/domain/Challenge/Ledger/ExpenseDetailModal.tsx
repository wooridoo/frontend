import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useExpense, useDeleteExpense } from '@/hooks/useExpense';
import { useExpenseApproveModalStore, useExpenseDetailModalStore } from '@/store/modal/useModalStore';
import { formatCurrency } from '@/utils/format';
import { capabilities } from '@/lib/api/capabilities';

export function ExpenseDetailModal() {
  const { isOpen, challengeId, expenseId, onClose } = useExpenseDetailModalStore();
  const { onOpen: openApprove } = useExpenseApproveModalStore();
  const { data: expense, isLoading } = useExpense(challengeId || undefined, expenseId || undefined);
  const deleteExpense = useDeleteExpense(challengeId || '');

  const handleDelete = async () => {
    if (!expenseId) return;
    try {
      await deleteExpense.mutateAsync(expenseId);
      onClose();
    } catch {
      // global error handler toast
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <div className="py-6 text-center text-sm text-gray-500">불러오는 중...</div>
      ) : !expense ? (
        <div className="py-6 text-center text-sm text-gray-500">지출 정보를 찾을 수 없습니다.</div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{expense.title}</h2>
          <div className="text-sm text-gray-500">상태: {expense.status}</div>
          <div className="text-base font-semibold">
            {formatCurrency(expense.amount, { withSuffix: true })}
          </div>
          {expense.description ? <p className="text-sm text-gray-700">{expense.description}</p> : null}
          <div className="text-sm text-gray-500">요청자: {expense.requestedBy.nickname}</div>
          {expense.receiptUrl ? (
            <a className="text-sm text-blue-600 underline" href={expense.receiptUrl} target="_blank" rel="noreferrer">
              영수증 보기
            </a>
          ) : null}

          <div className="flex justify-end gap-2">
            {capabilities.expenseActions && expense.status === 'VOTING' && challengeId && expenseId ? (
              <Button
                onClick={() => openApprove(challengeId, expenseId)}
                disabled={deleteExpense.isPending}
              >
                승인/거절
              </Button>
            ) : null}
            {capabilities.expenseActions && ['VOTING', 'REJECTED'].includes(expense.status) ? (
              <Button variant="danger" onClick={() => void handleDelete()} disabled={deleteExpense.isPending}>
                삭제
              </Button>
            ) : null}
            <Button variant="ghost" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
