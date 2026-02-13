import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { iconRegistry, type IconName } from './iconRegistry';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  title?: string;
  style?: CSSProperties;
  strokeWidth?: number;
}

export function Icon({
  name,
  className,
  size = 20,
  title,
  style,
  strokeWidth = 1.8,
}: IconProps) {
  const IconComponent = iconRegistry[name] ?? iconRegistry.default;
  const ariaLabel = title || name;

  return (
    <span
      aria-label={ariaLabel}
      className={cn('inline-flex items-center justify-center shrink-0', className)}
      role="img"
      style={{ width: size, height: size, ...style }}
    >
      <IconComponent size={size} strokeWidth={strokeWidth} />
    </span>
  );
}

export type { IconProps };
