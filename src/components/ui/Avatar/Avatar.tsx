import { useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string | null;
  name: string; // Used for initials and background color seed
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  onClick?: () => void;
}

const COLORS = [
  '#F87171', // Red 400
  '#FB923C', // Orange 400
  '#FACC15', // Yellow 400
  '#4ADE80', // Green 400
  '#2DD4BF', // Teal 400
  '#60A5FA', // Blue 400
  '#818CF8', // Indigo 400
  '#A78BFA', // Purple 400
  '#F472B6', // Pink 400
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
