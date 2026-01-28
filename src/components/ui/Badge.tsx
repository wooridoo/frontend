import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import styles from './Badge.module.css';

const badgeVariants = cva(styles.base, {
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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  emoji?: string;
}

function Badge({ className, variant, brix, size, emoji, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant: brix ? undefined : variant, brix, size }), className)} {...props}>
      {emoji && <span className={styles.emoji}>{emoji}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
