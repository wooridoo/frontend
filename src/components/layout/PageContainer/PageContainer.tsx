import { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={clsx(styles.container, className)}>
      {children}
    </div>
  );
}
