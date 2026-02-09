import { forwardRef } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './FAB.module.css';

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** FAB variant */
  variant?: 'primary' | 'secondary';
  /** FAB size */
  size?: 'sm' | 'md' | 'lg';
  /** Position on screen */
  position?: 'bottomRight' | 'bottomLeft' | 'bottomCenter';
  /** Custom icon (defaults to Plus) */
  icon?: React.ReactNode;
  /** Label for extended FAB */
  label?: string;
}

const FAB = forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      position = 'bottomRight',
      icon,
      label,
      children,
      ...props
    },
    ref
  ) => {
    const isExtended = !!label;

    return (
      <button
        ref={ref}
        className={cn(
          styles.fab,
          styles[variant],
          styles[size],
          styles[position],
          isExtended && styles.extended,
          className
        )}
        {...props}
      >
        <span className={styles.icon}>
          {icon || children || <Plus />}
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </button>
    );
  }
);

FAB.displayName = 'FAB';

export { FAB };
