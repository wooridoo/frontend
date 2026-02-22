import { cva } from 'class-variance-authority';
import styles from './Badge.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const badgeVariants = cva(styles.base, {
    variants: {
        variant: {
            default: styles.default,
            success: styles.success,
            warning: styles.warning,
            error: styles.error,
            locked: styles.locked,
        },
        // 보조 처리
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
