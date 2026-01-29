import clsx from 'clsx';
import styles from './Avatar.module.css';

interface AvatarProps {
  className?: string;
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export function Avatar({
  className,
  src,
  alt,
  name,
  size = 'md',
  status,
}: AvatarProps) {
  const initials = name
    ? name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : '?';

  return (
    <div className={clsx(styles.avatar, styles[size], className)}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
      {status && <span className={clsx(styles.status, styles[status])} />}
    </div>
  );
}

export type { AvatarProps };
