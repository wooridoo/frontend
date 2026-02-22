import { useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string | null;
  name: string; // ?? ??
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  onClick?: () => void;
}

const COLORS = [
  'var(--color-red-500)',
  'var(--color-orange-400)',
  'var(--color-warning)',
  'var(--color-success)',
  'var(--color-support)',
  'var(--color-blue-700)',
  'var(--color-brix-grape)',
  'var(--color-brix-apple)',
  'var(--color-brix-mandarin)',
];

function getInitials(name: string): string {
  if (!name) return '?';
  return name.slice(0, 2).toUpperCase();
}

function getColor(name: string): string {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function Avatar({ src, name, size = 'md', className, onClick }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = useMemo(() => getInitials(name), [name]);
  const backgroundColor = useMemo(() => getColor(name), [name]);

  const showImage = src && !hasError;

  return (
    <div
      className={clsx(styles.container, styles[size], className)}
      style={{ backgroundColor: showImage ? undefined : backgroundColor }}
      onClick={onClick}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className={styles.image}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
}
