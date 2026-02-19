import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { executePasswordReset } from '@/lib/api/auth';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PATHS } from '@/routes/paths';

import styles from './ResetPasswordPage.module.css';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid reset token.');
      return;
    }

    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError('Password must be 8-20 chars and include letters, numbers, and special characters.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await executePasswordReset({
        token,
        newPassword,
        newPasswordConfirm,
      });

      if (response.passwordReset) {
        toast.success('Password reset completed. Please sign in again.');
        navigate(PATHS.HOME, { replace: true });
        return;
      }

      setError('Password reset failed. Please try again.');
    } catch (requestError) {
      console.error('Failed to reset password:', requestError);
      setError('Password reset failed. Please request a new link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Reset Password" showBack />
      <section className={styles.card}>
        {!token ? (
          <div className={styles.invalidToken}>
            <p>This reset link is invalid.</p>
            <button type="button" className={styles.linkButton} onClick={() => navigate(PATHS.HOME)}>
              Go Home
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Set a New Password</h2>
            <p className={styles.description}>Use a strong password with letters, numbers, and special characters.</p>

            <label className={styles.label} htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              className={styles.input}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
            />

            <label className={styles.label} htmlFor="newPasswordConfirm">
              Confirm Password
            </label>
            <input
              id="newPasswordConfirm"
              className={styles.input}
              type="password"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
              autoComplete="new-password"
              required
            />

            {error ? <p className={styles.error}>{error}</p> : null}

            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </section>
    </PageContainer>
  );
}

export default ResetPasswordPage;
