import { cva } from 'class-variance-authority';
import styles from './Button.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const buttonVariants = cva(styles.base, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
      danger: styles.danger,
      outline: styles.outline,
      text: styles.text,
    },
    size: {
      xs: styles.xs,
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    shape: {
      rounded: styles.rounded,
      pill: styles.pill,
      square: styles.square,
    },
    fullWidth: {
      true: styles.fullWidth,
      false: null,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    shape: 'rounded',
    fullWidth: false,
  },
});
