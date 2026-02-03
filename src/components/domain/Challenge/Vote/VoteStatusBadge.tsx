import styles from './VoteStatusBadge.module.css';
import type { VoteStatus } from '../../../../types/domain';

interface VoteStatusBadgeProps {
  status: VoteStatus;
}

export function VoteStatusBadge({ status }: VoteStatusBadgeProps) {
  const getStatusText = (status: VoteStatus) => {
    switch (status) {
      case 'IN_PROGRESS': return '진행 중';
      case 'APPROVED': return '가결';
      case 'REJECTED': return '부결';
      case 'DISMISSED': return '무산';
      default: return status;
    }
  };

  const getStatusClass = (status: VoteStatus) => {
    switch (status) {
      case 'IN_PROGRESS': return styles.inProgress;
      case 'APPROVED': return styles.approved;
      case 'REJECTED': return styles.rejected;
      case 'DISMISSED': return styles.dismissed;
      default: return '';
    }
  };

  return (
    <span className={`${styles.badge} ${getStatusClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
}
