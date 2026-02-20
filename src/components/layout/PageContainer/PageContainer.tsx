import { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './PageContainer.module.css';

type ContentWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'plain' | 'content';
  contentWidth?: ContentWidth;
  contentClassName?: string;
  bottomAction?: ReactNode;
  bottomActionClassName?: string;
}

const contentWidthClassMap: Record<ContentWidth, string> = {
  sm: styles.contentSm,
  md: styles.contentMd,
  lg: styles.contentLg,
  xl: styles.contentXl,
  full: styles.contentFull,
};

export function PageContainer({
  children,
  className,
  variant = 'plain',
  contentWidth = 'lg',
  contentClassName,
  bottomAction,
  bottomActionClassName,
}: PageContainerProps) {
  const widthClass = contentWidthClassMap[contentWidth];

  return (
    <div className={clsx(styles.container, className)}>
      {variant === 'content' ? (
        <div className={clsx(styles.content, widthClass, bottomAction && styles.hasBottomAction, contentClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
      {bottomAction ? (
        <div className={clsx(styles.bottomAction, bottomActionClassName)}>
          <div className={clsx(styles.bottomActionInner, widthClass)}>
            {bottomAction}
          </div>
        </div>
      ) : null}
    </div>
  );
}
