import { forwardRef } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import styles from './Button.module.css';
import { buttonVariants } from './Button.variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    shape,
    fullWidth,
    isLoading,
    disabled,
    leadingIcon,
    trailingIcon,
    children,
    ...props
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, shape, fullWidth }),
          isLoading && styles.loading,
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        <span className={styles.content}>
          {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
          {!isLoading && leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
          {children}
          {!isLoading && trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

