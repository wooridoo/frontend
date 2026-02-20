import { AnimatedIcon } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BrixBadgeLottieProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export function BrixBadgeLottie({ className, size = 48, animate = false }: BrixBadgeLottieProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <AnimatedIcon
        autoplay={animate}
        fallbackName="brixBadge"
        forceStatic={!animate}
        loop={false}
        name="brixBadge"
        size={size}
        title="브릭스 배지"
      />
    </div>
  );
}
