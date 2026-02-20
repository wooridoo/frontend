import { AnimatedIcon } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BrixBadgeLottieProps {
  className?: string;
  size?: number;
}

/**
 * 브릭스 배지의 Lottie 렌더 래퍼입니다.
 * 배지 컨테이너 크기를 유지한 채 애니메이션만 교체할 수 있게 분리했습니다.
 */
export function BrixBadgeLottie({ className, size = 48 }: BrixBadgeLottieProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <AnimatedIcon
        fallbackName="brixBadge"
        playMode="loop"
        name="brixBadge"
        size={size}
        title="브릭스 배지"
      />
    </div>
  );
}
