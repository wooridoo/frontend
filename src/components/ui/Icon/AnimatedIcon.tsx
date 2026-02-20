import { Suspense, lazy, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';
import type { IconName } from './iconRegistry';
import { lottieRegistry } from './lottieRegistry';
import { lottieRemoteManifest } from './lottieRemoteManifest';

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
  playMode?: 'loop' | 'once' | 'static';
  renderScale?: number;
}

/**
 * Remote Lottie 우선 렌더 컴포넌트입니다.
 * - 성공: Lottie 렌더
 * - 로딩: 동일 박스 placeholder 렌더
 * - 실패: semantic fallback icon 렌더
 */
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
  playMode = 'loop',
  renderScale,
}: AnimatedIconProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [loadState, setLoadState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    name: IconName | null;
    animationData: object | null;
  }>({
    status: 'idle',
    name: null,
    animationData: null,
  });

  const loader = useMemo(() => lottieRegistry[name], [name]);
  const entry = lottieRemoteManifest[name];
  const fallbackIconName = fallbackName || lottieRemoteManifest[name]?.fallbackName || name;
  const fallbackScale = entry?.renderScale ?? 1;
  const resolvedRenderScale = renderScale ?? fallbackScale;
  const resolvedPlayMode = forceStatic || reducedMotion ? 'static' : playMode;
  const shouldUseLottie = Boolean(loader);
  const shouldAutoplay = resolvedPlayMode !== 'static' && autoplay;
  const shouldLoop = resolvedPlayMode === 'loop' || (resolvedPlayMode === 'once' ? false : loop);

  useEffect(() => {
    if (!loader) return;

    let cancelled = false;
    const loadAnimation = async () => {
      setLoadState({
        status: 'loading',
        name,
        animationData: null,
      });

      try {
        const module = await loader();
        if (!cancelled) {
          setLoadState({
            status: 'success',
            name,
            animationData: module.default,
          });
        }
      } catch {
        if (!cancelled) {
          setLoadState({
            status: 'error',
            name,
            animationData: null,
          });
        }
      }
    };

    void loadAnimation();

    return () => {
      cancelled = true;
    };
  }, [loader, name]);

  const hasLoadedCurrentAnimation =
    loadState.name === name && loadState.status === 'success' && Boolean(loadState.animationData);

  if (!shouldUseLottie || (loadState.name === name && loadState.status === 'error')) {
    return <Icon className={className} name={fallbackIconName} size={size} style={style} title={title} />;
  }

  if (!hasLoadedCurrentAnimation || !loadState.animationData) {
    return (
      <span
        aria-hidden="true"
        className={cn('inline-flex items-center justify-center shrink-0', className)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'var(--color-grey-100)',
          ...style,
        }}
      />
    );
  }

  return (
    <span
      aria-label={title || name}
      className={cn('inline-flex items-center justify-center shrink-0', className)}
      role="img"
      style={{ width: size, height: size, overflow: 'hidden', ...style }}
    >
      <Suspense fallback={<Icon name={fallbackIconName} size={size} />}>
        <LazyLottie
          animationData={loadState.animationData}
          autoplay={shouldAutoplay}
          loop={shouldLoop}
          style={{
            width: size,
            height: size,
            transform: `scale(${resolvedRenderScale})`,
            transformOrigin: 'center',
          }}
        />
      </Suspense>
    </span>
  );
}

export type { AnimatedIconProps };
