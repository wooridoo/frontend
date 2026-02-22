import { VoteStatus } from '@/types/domain';
import styles from './VoteStatusBadge.module.css';

interface VoteStatusBadgeProps {
  status: VoteStatus;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function VoteStatusBadge({ status }: VoteStatusBadgeProps) {
  const getStatusText = (value: VoteStatus) => {
    switch (value) {
      case VoteStatus.PENDING:
        return '진행 중';
      case VoteStatus.APPROVED:
        return '가결';
      case VoteStatus.REJECTED:
        return '부결';
      case VoteStatus.EXPIRED:
        return '만료';
      default:
        return value;
    }
  };

  const getStatusClass = (value: VoteStatus) => {
    switch (value) {
      case VoteStatus.PENDING:
        return styles.inProgress;
      case VoteStatus.APPROVED:
        return styles.approved;
      case VoteStatus.REJECTED:
        return styles.rejected;
      case VoteStatus.EXPIRED:
        return styles.dismissed;
      default:
        return '';
    }
  };

  return <span className={`${styles.badge} ${getStatusClass(status)}`}>{getStatusText(status)}</span>;
}
