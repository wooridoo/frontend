import React from 'react';
import styles from './Button.module.css';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className} ${isLoading ? styles.loading : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinnerWrapper}>
          <svg className={styles.spinner} viewBox="0 0 24 24">
            <circle className={styles.path} cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
          </svg>
          <span className={styles.loadingText}>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
