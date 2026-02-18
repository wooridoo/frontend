import { useExpenses } from '@/hooks/useExpense';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { formatCurrency } from '@/utils/format';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useExpenseDetailModalStore } from '@/store/modal/useModalStore';
import type { Expense, ExpenseStatus } from '@/lib/api/expense';
import styles from './ExpenseList.module.css';

const STATUS_LABELS: Record<ExpenseStatus, { text: string; className: string }> = {
  VOTING: { text: '투표중', className: 'pending' },
  APPROVED: { text: '승인됨', className: 'approved' },
  REJECTED: { text: '거절됨', className: 'rejected' },
  PAID: { text: '지급완료', className: 'paid' },
  USED: { text: '사용됨', className: 'paid' },
  EXPIRED: { text: '만료됨', className: 'rejected' },
  CANCELLED: { text: '취소됨', className: 'rejected' },
};

const CATEGORY_LABELS = {
  MEETING: '모임',
  FOOD: '식비',
  SUPPLIES: '비품',
  OTHER: '기타',
} as const;

function ExpenseItem({
  expense,
  onClick,
}: {
  expense: Expense;
  onClick: () => void;
}) {
  const statusInfo = STATUS_LABELS[expense.status];

  return (
    <button type="button" className={styles.expenseItem} onClick={onClick}>
      <div className={styles.expenseHeader}>
        <div className={styles.expenseInfo}>
          <span className={styles.categoryBadge}>{CATEGORY_LABELS[expense.category]}</span>
          <span className={styles.expenseTitle}>{expense.title}</span>
        </div>
        <span className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>{statusInfo.text}</span>
      </div>

      {expense.description ? <p className={styles.expenseDesc}>{expense.description}</p> : null}

      <div className={styles.expenseFooter}>
        <div className={styles.requester}>
          {expense.requestedBy.profileImage ? (
            <img
              src={expense.requestedBy.profileImage}
              alt={expense.requestedBy.nickname}
              className={styles.requesterAvatar}
            />
          ) : null}
          <span>{expense.requestedBy.nickname}</span>
        </div>
        <div className={styles.amount}>
          <span className={styles.normalAmount}>-{formatCurrency(expense.amount, { withSuffix: true })}</span>
        </div>
      </div>

      <div className={styles.expenseDate}>{new Date(expense.createdAt).toLocaleDateString()}</div>
    </button>
  );
}

export function ExpenseList() {
  const { challengeId } = useChallengeRoute();
  const { onOpen: openExpenseDetail } = useExpenseDetailModalStore();
  const { data, isLoading } = useExpenses(challengeId);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton className="w-full h-20 rounded-lg" />
        <Skeleton className="w-full h-20 rounded-lg" />
        <Skeleton className="w-full h-20 rounded-lg" />
      </div>
    );
  }

  if (!data || data.expenses.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>등록된 지출 내역이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>지출 내역</h3>
        <span className={styles.totalAmount}>총 {formatCurrency(data.totalAmount, { withSuffix: true })}</span>
      </div>
      <div className={styles.list}>
        {data.expenses.map((expense) => (
          <ExpenseItem
            key={expense.expenseId}
            expense={expense}
            onClick={() => {
              if (!challengeId) return;
              openExpenseDetail(challengeId, expense.expenseId);
            }}
          />
        ))}
      </div>
    </div>
  );
}
