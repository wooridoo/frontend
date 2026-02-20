import { useState } from 'react';
import Lottie from 'lottie-react';
import brixAnimation from '@/assets/lottie/mascot-face.json';
import { cn } from '@/lib/utils';

interface BrixBadgeLottieProps {
  className?: string;
  size?: number;
}

export function BrixBadgeLottie({ className, size = 48 }: BrixBadgeLottieProps) {
  const [isFallback, setIsFallback] = useState(false);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {isFallback ? (
        <div
          aria-label="브릭스 배지"
          style={{
            width: '76%',
            height: '76%',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-orange-500)',
          }}
        />
      ) : (
        <Lottie
          animationData={brixAnimation}
          loop={true}
          autoplay={true}
          onDataFailed={() => setIsFallback(true)}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}
