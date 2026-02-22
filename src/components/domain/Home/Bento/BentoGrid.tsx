import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BentoGrid.module.css';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={clsx(styles.grid, className)}>
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function BentoItem({ children, className, colSpan = 1, rowSpan = 1 }: BentoItemProps) {
  return (
    <div
      className={clsx(styles.item, className)}
      data-colspan={colSpan}
      data-rowspan={rowSpan}
    >
      {children}
    </div>
  );
}
