import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { BrixBadgeLottie } from './BrixBadgeLottie';
import type { BrixGrade } from '@/types/brix';
import { GRADE_CONFIG } from '@/lib/brix';
import { preloadLottie } from '@/components/ui/Icon/lottieRegistry';

interface BrixBadgeProps {
  grade: BrixGrade;
  variant?: 'flat' | '3d';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

/**
 * 브릭스 등급 배지 컴포넌트입니다.
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function BrixBadge({
  grade,
  variant = '3d',
  size = 'md',
  className,
  showLabel = true,
}: BrixBadgeProps) {
  const config = GRADE_CONFIG[grade];

  useEffect(() => {
    void preloadLottie('brixBadge');
  }, []);

  if (variant === '3d') {
    const lottieSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <BrixBadgeLottie size={lottieSize} />
        {showLabel && (
          <span className={cn(
            'font-bold text-slate-700',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base'
          )}>
            {config.label}
          </span>
        )}
      </div>
    );
  }

  // 보조 처리
  return (
    <Badge
      brix={config.brixVariant}
      size={size === 'lg' ? 'md' : size}
      className={className}
      emoji={config.emoji}
    >
      {showLabel && config.label}
    </Badge>
  );
}

export type { BrixGrade };

