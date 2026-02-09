import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import styles from './Badge.module.css';
import { badgeVariants } from './Badge.variants';

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

export { Badge };

