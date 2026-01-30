import clsx from 'clsx';
import styles from './Icons.module.css';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function SearchIcon({ className, size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.icon, className)}
    >
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 20L17 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
