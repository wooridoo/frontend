import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui';
import styles from './VoteUi.module.css';

interface VoteTabSwitcherProps<T extends string> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

interface VoteFormFieldProps {
  label: string;
  helper?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

interface VoteActionBarProps {
  cancelText?: string;
  confirmText: string;
  onCancel: () => void;
  confirmDisabled?: boolean;
  confirmVariant?: 'primary' | 'danger';
}

export function VoteTabSwitcher<T extends string>({
  value,
  options,
  onChange,
}: VoteTabSwitcherProps<T>) {
  return (
    <div className={styles.tabSwitcher} role="tablist" aria-label="투표 목록 구분">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <Button
            key={option.value}
            type="button"
            shape="pill"
            size="sm"
            variant={isActive ? 'primary' : 'ghost'}
            className={clsx(styles.tabButton, isActive && styles.activeTabButton)}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export function VoteFormField({ label, helper, error, htmlFor, children }: VoteFormFieldProps) {
  return (
    <div className={styles.formField}>
      <label htmlFor={htmlFor} className={styles.fieldLabel}>
        {label}
      </label>
      {children}
      {helper ? <p className={styles.fieldHelper}>{helper}</p> : null}
      {error ? <p className={styles.fieldError}>{error}</p> : null}
    </div>
  );
}

export function VoteActionBar({
  cancelText = '취소',
  confirmText,
  onCancel,
  confirmDisabled,
  confirmVariant = 'primary',
}: VoteActionBarProps) {
  return (
    <div className={styles.actionBar}>
      <Button type="button" variant="ghost" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button type="submit" variant={confirmVariant === 'danger' ? 'danger' : 'primary'} disabled={confirmDisabled}>
        {confirmText}
      </Button>
    </div>
  );
}
