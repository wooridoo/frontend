import type { ReactNode } from 'react';
import styles from './ExpenseModalLayout.module.css';

interface ExpenseModalLayoutProps {
  title: string;
  description?: string;
  footer: ReactNode;
  children: ReactNode;
}

interface ExpenseFieldProps {
  label: string;
  htmlFor?: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}

export function ExpenseModalLayout({ title, description, footer, children }: ExpenseModalLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>
      <section className={styles.body}>{children}</section>
      <footer className={styles.footer}>{footer}</footer>
    </div>
  );
}

export function ExpenseField({ label, htmlFor, helper, error, children }: ExpenseFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.fieldLabel}>
        {label}
      </label>
      {children}
      {helper ? <p className={styles.helper}>{helper}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
