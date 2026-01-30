import Lottie from 'lottie-react';
import clsx from 'clsx';
import styles from './Profile.module.css';
import badgeAnimation from '@/assets/lottie/brix-badge.json'; // Default loading/badge animation

export interface UserProfile {
  name: string;
  avatar?: string;
  caption?: string; // email, role, level, etc.
}

export interface ProfileProps {
  user: UserProfile;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Profile({
  user,
  size = 'md',
  layout = 'horizontal',
  isLoading = false,
  className,
  onClick
}: ProfileProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
  };

  return (
    <div
      className={clsx(
        styles.root,
        styles[size],
        styles[layout],
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.avatarWrapper}>
        {isLoading ? (
          <div className={styles.lottieWrapper}>
            <Lottie
              animationData={badgeAnimation}
              loop={true}
              className={styles.lottie}
            />
          </div>
        ) : (
          <>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={styles.avatarImage}
                onError={handleImageError}
              />
            ) : null}
            {/* Fallback Initial if no image or error */}
            <div className={clsx(styles.avatarFallback, user.avatar && styles.hidden)}>
              {user.name.charAt(0)}
            </div>
          </>
        )}
      </div>

      {layout !== 'icon-only' && (
        <div className={styles.info}>
          <span className={styles.name}>{isLoading ? 'Loading...' : user.name}</span>
          {user.caption && <span className={styles.caption}>{user.caption}</span>}
        </div>
      )}
    </div>
  );
}
