import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './SearchBar.module.css';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, placeholder = '챌린지 검색', onSearch, onClear, ...props }, ref) => {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        onSearch?.(value.trim());
      }
      props.onKeyDown?.(e);
    };

    const handleClear = () => {
      setValue('');
      onClear?.();
    };

    const handleSearchClick = () => {
      if (value.trim()) {
        onSearch?.(value.trim());
      }
    };

    return (
      <div className={clsx(styles.wrapper, className)}>
        <button
          type="button"
          className={styles.searchIcon}
          onClick={handleSearchClick}
          aria-label="검색"
        >
          🔍
        </button>
        <input
          ref={ref}
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export type { SearchBarProps };
