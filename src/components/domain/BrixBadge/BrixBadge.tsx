import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { BrixBadgeLottie } from './BrixBadgeLottie';
import type { BrixGrade } from '@/types/brix';
import { GRADE_CONFIG } from '@/lib/brix';

interface BrixBadgeProps {
  grade: BrixGrade;
  variant?: 'flat' | '3d';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function BrixBadge({
  grade,
  variant = '3d',
  size = 'md',
  className,
  showLabel = true,
}: BrixBadgeProps) {
  const config = GRADE_CONFIG[grade];
  const [animate, setAnimate] = useState(false);

  if (variant === '3d') {
    const lottieSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
    return (
      <div
        className={cn("inline-flex items-center gap-1", className)}
        onBlurCapture={() => setAnimate(false)}
        onFocusCapture={() => setAnimate(true)}
        onMouseEnter={() => setAnimate(true)}
        onMouseLeave={() => setAnimate(false)}
      >
        <BrixBadgeLottie animate={animate} size={lottieSize} />
        {showLabel && (
          <span className={cn(
            "font-bold text-slate-700",
            size === 'sm' && "text-xs",
            size === 'md' && "text-sm",
            size === 'lg' && "text-base"
          )}>
            {config.label}
          </span>
        )}
      </div>
    );
  }

  // Fallback to Flat Badge using existing Badge styles
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

