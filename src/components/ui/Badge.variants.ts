import { cva } from 'class-variance-authority';
import styles from './Badge.module.css';

export const badgeVariants = cva(styles.base, {
    variants: {
        variant: {
            default: styles.default,
            success: styles.success,
            warning: styles.warning,
            error: styles.error,
            locked: styles.locked,
        },
        // Brix Scale for sweetness/reliability scores
        brix: {
            honey: styles.brixHoney,
            grape: styles.brixGrape,
            apple: styles.brixApple,
            mandarin: styles.brixMandarin,
            tomato: styles.brixTomato,
            bitter: styles.brixBitter,
        },
        size: {
            sm: styles.sm,
            md: styles.md,
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});
