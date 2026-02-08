import { cva } from 'class-variance-authority';
import styles from './Button.module.css';

export const buttonVariants = cva(styles.base, {
    variants: {
        variant: {
            primary: styles.primary,
            secondary: styles.secondary,
            ghost: styles.ghost,
            danger: styles.danger,
        },
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});
