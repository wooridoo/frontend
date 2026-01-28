import { cn, formatCurrency, formatNumber } from '../../lib/utils';
import styles from './FinancialText.module.css';

export interface FinancialTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The numeric amount to display */
  amount: number;
  /** Whether to show currency suffix (원) */
  showCurrency?: boolean;
  /** Variant for income/expense/locked styling */
  variant?: 'default' | 'income' | 'expense' | 'locked';
  /** Font size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show + sign for positive amounts */
  showSign?: boolean;
}

/**
 * Financial Text Component
 * Always displays with tabular-nums for proper alignment
 * Use this for ALL money displays in the app
 */
function FinancialText({
  amount,
  showCurrency = true,
  variant = 'default',
  size = 'md',
  showSign = false,
  className,
  ...props
}: FinancialTextProps) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;

  // Auto-detect variant if showSign is true
  const autoVariant = showSign
    ? (isPositive ? 'income' : isNegative ? 'expense' : 'default')
    : variant;

  const displayAmount = Math.abs(amount);
  const formattedValue = showCurrency
    ? formatCurrency(displayAmount)
    : formatNumber(displayAmount);

  const prefix = showSign
    ? (isPositive ? '+' : isNegative ? '-' : '')
    : '';

  return (
    <span
      className={cn(
        styles.financial,
        styles[autoVariant],
        styles[size],
        className
      )}
      {...props}
    >
      {prefix}{formattedValue}
    </span>
  );
}

export { FinancialText };
