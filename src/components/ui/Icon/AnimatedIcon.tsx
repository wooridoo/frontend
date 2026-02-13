import { Suspense, lazy, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';
import type { IconName } from './iconRegistry';
import { lottieRegistry } from './lottieRegistry';

const LazyLottie = lazy(async () => {
  const module = await import('lottie-react');
  return { default: module.default };
});

interface AnimatedIconProps {
  name: IconName;
  className?: string;
  size?: number;
  title?: string;
  style?: CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  fallbackName?: IconName;
  forceStatic?: boolean;
}

export function AnimatedIcon({
  name,
  className,
  size = 24,
  title,
  style,
  loop = true,
  autoplay = true,
  fallbackName,
  forceStatic = false,
}: AnimatedIconProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [loadedName, setLoadedName] = useState<IconName | null>(null);

  const loader = useMemo(() => lottieRegistry[name], [name]);
  const shouldAnimate = !forceStatic && !reducedMotion && Boolean(loader);

  useEffect(() => {
    if (!shouldAnimate || !loader) return;

    let cancelled = false;

    loader()
      .then(module => {
        if (!cancelled) {
          setAnimationData(module.default);
          setLoadedName(name);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnimationData(null);
          setLoadedName(name);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loader, name, shouldAnimate]);

  const hasLoadedCurrentAnimation = loadedName === name && Boolean(animationData);

  if (!shouldAnimate || !hasLoadedCurrentAnimation || !animationData) {
    return <Icon className={className} name={fallbackName || name} size={size} style={style} title={title} />;
  }

  return (
    <span
      aria-label={title || name}
      className={cn('inline-flex items-center justify-center shrink-0', className)}
      role="img"
      style={{ width: size, height: size, ...style }}
    >
      <Suspense fallback={<Icon name={fallbackName || name} size={size} />}>
        <LazyLottie
          animationData={animationData}
          autoplay={autoplay}
          loop={loop}
          style={{ width: size, height: size }}
        />
      </Suspense>
    </span>
  );
}

export type { AnimatedIconProps };
