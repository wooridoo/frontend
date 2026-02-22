import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './Button';
import styles from './IconButton.module.css';

type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type IconButtonShape = 'circle' | 'rounded' | 'square';

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'leadingIcon' | 'trailingIcon' | 'shape' | 'size'> {
  icon: React.ReactNode;
  children?: React.ReactNode;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  'aria-label': string;
}

const shapeToButtonShape: Record<IconButtonShape, 'rounded' | 'pill' | 'square'> = {
  circle: 'pill',
  rounded: 'rounded',
  square: 'square',
};

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, children, className, size = 'md', shape = 'circle', variant = 'ghost', ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        size={size}
        shape={shapeToButtonShape[shape]}
        variant={variant}
        className={cn(styles.iconButton, styles[`size${size[0].toUpperCase()}${size.slice(1)}`], styles[shape], className)}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
