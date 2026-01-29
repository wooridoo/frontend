import clsx from 'clsx';
import styles from './EmptyState.module.css';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  className?: string;
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  className,
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          className={styles.action}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export type { EmptyStateProps };
