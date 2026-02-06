import { useParams } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpense';
import { Skeleton } from '@/components/feedback/Skeleton/Skeleton';
import { formatCurrency } from '@/utils/format';
import styles from './ExpenseList.module.css';
import type { Expense, ExpenseStatus, ExpenseCategory } from '@/lib/api/expense';

const STATUS_LABELS: Record<ExpenseStatus, { text: string; className: string }> = {
    PENDING: { text: '대기 중', className: 'pending' },
    APPROVED: { text: '승인됨', className: 'approved' },
    REJECTED: { text: '거절됨', className: 'rejected' },
    PAID: { text: '지급 완료', className: 'paid' },
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
    MEETING: '모임',
    FOOD: '식비',
    SUPPLIES: '비품',
    OTHER: '기타',
};

interface ExpenseItemProps {
    expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
    const statusInfo = STATUS_LABELS[expense.status];

    return (
        <div className={styles.expenseItem}>
            <div className={styles.expenseHeader}>
                <div className={styles.expenseInfo}>
                    <span className={styles.categoryBadge}>
                        {CATEGORY_LABELS[expense.category]}
                    </span>
                    <span className={styles.expenseTitle}>{expense.title}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
                    {statusInfo.text}
                </span>
            </div>

            {expense.description && (
                <p className={styles.expenseDesc}>{expense.description}</p>
            )}

            <div className={styles.expenseFooter}>
                <div className={styles.requester}>
                    {expense.requestedBy.profileImage && (
                        <img
                            src={expense.requestedBy.profileImage}
                            alt={expense.requestedBy.nickname}
                            className={styles.requesterAvatar}
                        />
                    )}
                    <span>{expense.requestedBy.nickname}</span>
                </div>
                <div className={styles.amount}>
                    {expense.status === 'REJECTED' ? (
                        <span className={styles.rejectedAmount}>
                            {formatCurrency(expense.amount, { withSuffix: true })}
                        </span>
                    ) : (
                        <span className={styles.normalAmount}>
                            -{formatCurrency(expense.amount, { withSuffix: true })}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.expenseDate}>
                {new Date(expense.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}

export function ExpenseList() {
    const { id: challengeId } = useParams<{ id: string }>();
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

    if (!data || data.content.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    등록된 지출 내역이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.sectionTitle}>지출 내역</h3>
                <span className={styles.totalAmount}>
                    총 {formatCurrency(data.totalAmount, { withSuffix: true })}
                </span>
            </div>
            <div className={styles.list}>
                {data.content.map(expense => (
                    <ExpenseItem key={expense.expenseId} expense={expense} />
                ))}
            </div>
        </div>
    );
}
