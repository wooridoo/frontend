import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Button, SemanticIcon, type SemanticIconName } from '@/components/ui';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  className?: string;
  icon?: ReactNode;
  iconName?: SemanticIconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function EmptyState({
  className,
  icon,
  iconName = 'empty',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.icon}>{icon ?? <SemanticIcon animated={false} name={iconName} size={24} />}</div>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className={styles.action} onClick={onAction} size="md" variant="primary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export type { EmptyStateProps };
