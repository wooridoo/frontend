import Lottie from 'lottie-react';
import clsx from 'clsx';
// TODO: Replace with actual loading animation file (e.g., loading.json)
import loadingAnimation from '@/assets/lottie/brix-badge.json';
import styles from './LoginButton.module.css';

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function LoginButton({
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: LoginButtonProps) {
  return (
    <button
      className={clsx(styles.root, isLoading && styles.loading, className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className={styles.lottieWrapper}>
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            className={styles.lottie}
          />
        </div>
      ) : (
        <span className={styles.label}>{children}</span>
      )}
    </button>
  );
}
