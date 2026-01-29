import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { BrixBadgeLottie } from './BrixBadgeLottie';

export type BrixGrade = 'HONEY' | 'GRAPE' | 'APPLE' | 'TANGERINE' | 'TOMATO' | 'BITTER';

interface BrixBadgeProps {
  grade: BrixGrade;
  variant?: 'flat' | '3d';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const GRADE_CONFIG: Record<BrixGrade, { label: string; emoji: string; brixVariant: 'honey' | 'grape' | 'apple' | 'mandarin' | 'tomato' | 'bitter' }> = {
  HONEY: { label: '꿀', emoji: '🍯', brixVariant: 'honey' },
  GRAPE: { label: '포도', emoji: '🍇', brixVariant: 'grape' },
  APPLE: { label: '사과', emoji: '🍎', brixVariant: 'apple' },
  TANGERINE: { label: '귤', emoji: '🍊', brixVariant: 'mandarin' },
  TOMATO: { label: '토마토', emoji: '🍅', brixVariant: 'tomato' },
  BITTER: { label: '쓴맛', emoji: '🥒', brixVariant: 'bitter' },
};

export function BrixBadge({
  grade,
  variant = '3d',
  size = 'md',
  className,
  showLabel = true,
}: BrixBadgeProps) {
  const config = GRADE_CONFIG[grade];

  if (variant === '3d') {
    const lottieSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
    return (
      <div className={cn("inline-flex items-center gap-1", className)}>
        <BrixBadgeLottie size={lottieSize} />
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
