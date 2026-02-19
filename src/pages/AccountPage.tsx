import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PATHS } from '@/routes/paths';
import { changeMyPassword, getMyProfile, withdrawAccount } from '@/lib/api/user';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import styles from './AccountPage.module.css';

export function AccountPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirmDialog();
  const { data: user, isLoading } = useQuery({
    queryKey: ['myProfile', 'account-page'],
    queryFn: getMyProfile,
    retry: 1,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [passwordPending, setPasswordPending] = useState(false);
  const [withdrawPending, setWithdrawPending] = useState(false);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      toast.error('비밀번호 입력값을 모두 채워주세요.');
      return;
    }

    setPasswordPending(true);
    try {
      await changeMyPassword({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      toast.success('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setPasswordPending(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      toast.error('탈퇴 확인용 비밀번호를 입력해주세요.');
      return;
    }

    const ok = await confirm({
      title: '정말 탈퇴하시겠습니까?',
      description: '탈퇴 후 30일 이내 재가입 시 데이터가 복구됩니다.',
      confirmText: '탈퇴',
      cancelText: '취소',
    });
    if (!ok) return;

    setWithdrawPending(true);
    try {
      await withdrawAccount({ password: withdrawPassword });
      toast.success('탈퇴 처리가 완료되었습니다.');
      navigate(PATHS.HOME);
    } catch (error) {
      console.error('Failed to withdraw account:', error);
    } finally {
      setWithdrawPending(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="계정 관리" showBack />

      <div className={styles.container}>
        {isLoading || !user ? (
          <div className={styles.empty}>계정 정보를 불러오는 중입니다.</div>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>기본 정보</h2>
              <div className={styles.row}><span>닉네임</span><strong>{user.nickname}</strong></div>
              <div className={styles.row}><span>이메일</span><strong>{user.email}</strong></div>
              <div className={styles.row}><span>상태</span><strong>{user.status}</strong></div>
              <div className={styles.row}>
                <span>지갑 잔액</span>
                <strong>{(user.account?.availableBalance ?? 0).toLocaleString()} Brix</strong>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>지갑 / 거래</h2>
              <div className={styles.buttonRow}>
                <button type="button" className={styles.secondaryButton} onClick={() => navigate(PATHS.MY.LEDGER)}>
                  나의 지갑
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => navigate('/me/ledger/transactions')}
                >
                  거래내역
                </button>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
              <form className={styles.form} onSubmit={handlePasswordSubmit}>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
                <button type="submit" className={styles.primaryButton} disabled={passwordPending}>
                  {passwordPending ? '변경 중...' : '비밀번호 변경'}
                </button>
              </form>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>회원 탈퇴</h2>
              <p className={styles.helpText}>탈퇴 시 계정은 WITHDRAWN 상태로 전환되며 30일 뒤 완전 삭제됩니다.</p>
              <div className={styles.buttonRow}>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="탈퇴 확인용 비밀번호"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                />
                <button type="button" className={styles.dangerButton} disabled={withdrawPending} onClick={handleWithdraw}>
                  {withdrawPending ? '처리 중...' : '회원 탈퇴'}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
}
