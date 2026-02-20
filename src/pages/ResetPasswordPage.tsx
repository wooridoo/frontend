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
      setError('유효하지 않은 재설정 토큰입니다.');
      return;
    }

    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError('비밀번호는 8~20자이며 영문, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
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
        toast.success('비밀번호 재설정이 완료되었습니다. 다시 로그인해주세요.');
        navigate(PATHS.HOME, { replace: true });
        return;
      }

      setError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
    } catch (requestError) {
      console.error('비밀번호 재설정 실패:', requestError);
      setError('비밀번호 재설정에 실패했습니다. 새 링크를 요청해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer variant="content" contentWidth="sm">
      <PageHeader title="비밀번호 재설정" showBack />
      <section className={styles.card}>
        {!token ? (
          <div className={styles.invalidToken}>
            <p>유효하지 않은 재설정 링크입니다.</p>
            <button type="button" className={styles.linkButton} onClick={() => navigate(PATHS.HOME)}>
              홈으로 이동
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>새 비밀번호 설정</h2>
            <p className={styles.description}>영문, 숫자, 특수문자를 포함한 안전한 비밀번호를 사용해주세요.</p>

            <label className={styles.label} htmlFor="newPassword">
              새 비밀번호
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
              새 비밀번호 확인
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
              {submitting ? '재설정 중...' : '비밀번호 재설정'}
            </button>
          </form>
        )}
      </section>
    </PageContainer>
  );
}

export default ResetPasswordPage;
