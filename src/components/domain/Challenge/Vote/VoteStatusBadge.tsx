import styles from './VoteStatusBadge.module.css';
import { VoteStatus } from '../../../../types/domain';

interface VoteStatusBadgeProps {
  status: VoteStatus;
}

export function VoteStatusBadge({ status }: VoteStatusBadgeProps) {
  const getStatusText = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.PENDING: return '진행 중';
      case VoteStatus.APPROVED: return '가결';
      case VoteStatus.REJECTED: return '부결';
      case VoteStatus.EXPIRED: return '만료(무산)';
      default: return status;
    }
  };

  const getStatusClass = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.PENDING: return styles.inProgress;
      case VoteStatus.APPROVED: return styles.approved;
      case VoteStatus.REJECTED: return styles.rejected;
      case VoteStatus.EXPIRED: return styles.dismissed;
      default: return '';
    }
  };

  return (
    <span className={`${styles.badge} ${getStatusClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
}
