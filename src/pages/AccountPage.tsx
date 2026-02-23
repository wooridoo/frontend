import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { Button } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import { changeMyPassword, getMyProfile, updateMyProfile, withdrawAccount } from '@/lib/api/user';
import { uploadUserProfileImage } from '@/lib/api/upload';
import { validateSingleImageFile } from '@/lib/image/validation';
import { useConfirmDialog } from '@/store/modal/useConfirmDialogStore';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './AccountPage.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { confirm } = useConfirmDialog();
  const { updateUser } = useAuthStore();
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
  const [profileImagePending, setProfileImagePending] = useState(false);

  const userStatusLabel: Record<string, string> = {
    ACTIVE: '활성',
    WITHDRAWN: '탈퇴',
    LOCKED: '잠김',
    SUSPENDED: '정지',
  };

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
    const passwordRequired = user?.hasPassword ?? true;
    if (passwordRequired && !withdrawPassword) {
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
      await withdrawAccount({
        ...(passwordRequired ? { password: withdrawPassword } : {}),
      });
      toast.success('탈퇴 처리가 완료되었습니다.');
      navigate(PATHS.HOME);
    } catch (error) {
      console.error('Failed to withdraw account:', error);
    } finally {
      setWithdrawPending(false);
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setProfileImagePending(true);
    try {
      await validateSingleImageFile('USER_PROFILE', file);
      const imageUrl = await uploadUserProfileImage(file);
      if (!imageUrl) {
        throw new Error('프로필 이미지 URL을 받지 못했습니다.');
      }

      await updateMyProfile({ profileImage: imageUrl });
      const refreshedProfile = await getMyProfile();

      queryClient.setQueryData(['myProfile', 'account-page'], refreshedProfile);
      queryClient.setQueryData(['user', 'profile'], refreshedProfile);
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      updateUser(refreshedProfile);
      toast.success('프로필 이미지가 변경되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '프로필 이미지 변경에 실패했습니다.');
    } finally {
      setProfileImagePending(false);
    }
  };

  return (
    <PageContainer variant="content" contentWidth="md">
      <PageHeader title="계정 관리" showBack />

      <div className={styles.container}>
        {isLoading || !user ? (
          <div className={styles.empty}>계정 정보를 불러오는 중입니다.</div>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>기본 정보</h2>
              <div className={styles.profileImageRow}>
                <img
                  alt="프로필 이미지"
                  className={styles.profileImage}
                  src={user.profileImage || '/images/avatar-fallback.svg'}
                />
                <label className={styles.profileImageAction}>
                  <input
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className={styles.hiddenFileInput}
                    onChange={handleProfileImageChange}
                    type="file"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    isLoading={profileImagePending}
                    disabled={profileImagePending}
                    className={styles.secondaryButton}
                  >
                    이미지 변경
                  </Button>
                </label>
              </div>
              <div className={styles.row}><span>닉네임</span><strong>{user.nickname}</strong></div>
              <div className={styles.row}><span>이메일</span><strong>{user.email}</strong></div>
              <div className={styles.row}><span>상태</span><strong>{userStatusLabel[user.status] ?? '알 수 없음'}</strong></div>
              <div className={styles.row}>
                <span>지갑 잔액</span>
                <strong>{(user.account?.availableBalance ?? 0).toLocaleString()} 브릭스</strong>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>지갑 / 거래</h2>
              <div className={styles.buttonRow}>
                <Button type="button" className={styles.secondaryButton} fullWidth onClick={() => navigate(PATHS.MY.LEDGER)} variant="secondary">
                  나의 지갑
                </Button>
                <Button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => navigate('/me/ledger/transactions')}
                  fullWidth
                  variant="secondary"
                >
                  거래내역
                </Button>
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
                <Button type="submit" className={styles.primaryButton} disabled={passwordPending} fullWidth isLoading={passwordPending}>
                  {passwordPending ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </form>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>회원 탈퇴</h2>
              <p className={styles.helpText}>탈퇴 시 계정은 탈퇴 상태로 전환되며 30일 뒤 완전 삭제됩니다.</p>
              <div className={styles.buttonRow}>
                {(user?.hasPassword ?? true) && (
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="탈퇴 확인용 비밀번호"
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                  />
                )}
                <Button
                  type="button"
                  className={styles.dangerButton}
                  disabled={withdrawPending}
                  onClick={handleWithdraw}
                  fullWidth
                  variant="danger"
                  isLoading={withdrawPending}
                >
                  {withdrawPending ? '처리 중...' : '회원 탈퇴'}
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
}
