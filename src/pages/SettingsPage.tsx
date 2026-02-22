import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, LogOut, UserX } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWithdrawAccountModalStore } from '@/store/modal/useModalStore';
import { Button, IconButton } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '@/lib/api/notification';
import { capabilities } from '@/lib/api/capabilities';
import type { NotificationSettings } from '@/types/notification';
import { PATHS } from '@/routes/paths';
import styles from './SettingsPage.module.css';

function Toggle({
  checked,
  disabled,
  onClick,
}: {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
      aria-pressed={checked}
      aria-label={checked ? '켜짐' : '꺼짐'}
    >
      <span className={`${styles.toggleThumb} ${checked ? styles.toggleThumbOn : styles.toggleThumbOff}`} />
    </button>
  );
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { onOpen: openWithdrawModal } = useWithdrawAccountModalStore();
  const { data: settings } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.HOME);
  };

  const patchSettings = (patch: Partial<NotificationSettings>) => {
    if (!capabilities.notificationSettings) return;
    updateSettings.mutate(patch);
  };

  if (!user) {
    return (
      <PageContainer variant="content" contentWidth="md">
        <PageHeader title="설정" showBack />
        <div className={styles.stateText}>사용자 정보를 불러올 수 없습니다.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="content" contentWidth="md">
      <PageHeader title="설정" showBack />

      <div className={styles.pageBody}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>내 계정</h2>
          <div className={styles.accountCard}>
            <Avatar src={user.profileImage} name={user.nickname} size="lg" />
            <div className={styles.accountInfo}>
              <h3 className={styles.accountName}>{user.nickname}</h3>
              <p className={styles.accountEmail}>{user.email}</p>
            </div>
            <IconButton
              aria-label="내 계정 상세로 이동"
              className={styles.chevronButton}
              icon={<ChevronRight size={20} />}
              onClick={() => navigate(PATHS.MY.PROFILE)}
              size="sm"
              variant="ghost"
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>앱 설정</h2>
          <div className={styles.panel}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfoWrap}>
                <div className={styles.settingIcon}>
                  <Bell size={18} />
                </div>
                <div className={styles.settingInfo}>
                  <span className={styles.settingTitle}>푸시 알림</span>
                  <p className={styles.settingDesc}>알림 수신 여부를 설정합니다.</p>
                </div>
              </div>
              <Toggle
                checked={Boolean(settings?.pushEnabled)}
                disabled={!capabilities.notificationSettings || updateSettings.isPending}
                onClick={() => patchSettings({ pushEnabled: !settings?.pushEnabled })}
              />
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingTitle}>투표 알림</span>
                <p className={styles.settingDesc}>투표 시작/종료 알림</p>
              </div>
              <Toggle
                checked={Boolean(settings?.voteNotification)}
                disabled={!capabilities.notificationSettings || updateSettings.isPending}
                onClick={() => patchSettings({ voteNotification: !settings?.voteNotification })}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>계정 관리</h2>
          <div className={styles.panel}>
            <Button
              onClick={() => void handleLogout()}
              className={styles.rowButton}
              fullWidth
              leadingIcon={(
                <div className={styles.rowButtonIcon}>
                  <LogOut size={18} />
                </div>
              )}
              variant="text"
            >
              <span className={styles.rowButtonLabel}>로그아웃</span>
            </Button>

            <Button
              onClick={openWithdrawModal}
              className={`${styles.rowButton} ${styles.rowButtonDanger}`}
              fullWidth
              leadingIcon={(
                <div className={`${styles.rowButtonIcon} ${styles.rowButtonIconDanger}`}>
                  <UserX size={18} />
                </div>
              )}
              variant="text"
            >
              <span className={styles.rowButtonDangerLabel}>회원 탈퇴</span>
            </Button>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
