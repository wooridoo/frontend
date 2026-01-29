import Lottie from 'lottie-react';
import brixAnimation from '@/assets/lottie/brix-badge.json';
import { cn } from '@/lib/utils';

interface BrixBadgeLottieProps {
  className?: string;
  size?: number;
}

export function BrixBadgeLottie({ className, size = 48 }: BrixBadgeLottieProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={brixAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
