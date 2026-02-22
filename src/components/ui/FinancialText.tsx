import { cn, formatCurrency, formatNumber } from '../../lib/utils';
import styles from './FinancialText.module.css';

export interface FinancialTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /* 공통 설명 */
  amount: number;
  /* 공통 설명 */
  showCurrency?: boolean;
  /* 공통 설명 */
  variant?: 'default' | 'income' | 'expense' | 'locked';
  /* 공통 설명 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /* 공통 설명 */
  showSign?: boolean;
  /* 공통 설명 */
  animated?: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
import { useEffect, useRef } from 'react';
import { useSpring } from 'framer-motion';

function FinancialText({
  amount,
  showCurrency = true,
  variant = 'default',
  size = 'md',
  showSign = false,
  animated = true,
  className,
  ...props
}: FinancialTextProps) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;

  // 보조 처리
  const autoVariant = showSign
    ? (isPositive ? 'income' : isNegative ? 'expense' : 'default')
    : variant;

  const ref = useRef<HTMLSpanElement>(null);
  const springValue = useSpring(Math.abs(amount), {
    stiffness: 45,
    damping: 10,
    mass: 0.8,
  });

  useEffect(() => {
    if (animated) {
      springValue.set(Math.abs(amount));
    }
  }, [amount, animated, springValue]);

  useEffect(() => {
    if (!animated) return;

    return springValue.on('change', (latest) => {
      if (ref.current) {
        const displayAmount = Math.round(latest);
        const formattedValue = showCurrency
          ? formatCurrency(displayAmount)
          : formatNumber(displayAmount);

        const prefix = showSign
          ? (amount > 0 ? '+' : amount < 0 ? '-' : '') // ?? ??
          : '';

        ref.current.textContent = `${prefix}${formattedValue}`;
      }
    });
  }, [springValue, showCurrency, showSign, amount, animated]);

  // 보조 처리
  const displayAmount = Math.abs(amount);
  const formattedValue = showCurrency
    ? formatCurrency(displayAmount)
    : formatNumber(displayAmount);

  const prefix = showSign
    ? (isPositive ? '+' : isNegative ? '-' : '')
    : '';

  return (
    <span
      ref={ref}
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
