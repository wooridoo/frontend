import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, LogOut, UserX } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWithdrawAccountModalStore } from '@/store/modal/useModalStore';
import { Avatar } from '@/components/ui/Avatar';
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '@/lib/api/notification';
import { capabilities } from '@/lib/api/capabilities';
import type { NotificationSettings } from '@/types/notification';

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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? 'bg-blue-500' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { onOpen: openWithdrawModal } = useWithdrawAccountModalStore();
  const { data: settings } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const patchSettings = (patch: Partial<NotificationSettings>) => {
    if (!capabilities.notificationSettings) return;
    updateSettings.mutate(patch);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">설정</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">내 계정</h2>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <Avatar src={user.profileImage} name={user.nickname} size="lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.nickname}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => navigate('/me')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">앱 설정</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bell size={20} />
              </div>
              <div>
                <span className="font-medium text-gray-900">푸시 알림</span>
                <p className="text-xs text-gray-500">알림 수신 여부를 설정합니다.</p>
              </div>
            </div>
            <Toggle
              checked={Boolean(settings?.pushEnabled)}
              disabled={!capabilities.notificationSettings || updateSettings.isPending}
              onClick={() => patchSettings({ pushEnabled: !settings?.pushEnabled })}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <span className="font-medium text-gray-900">투표 알림</span>
              <p className="text-xs text-gray-500">투표 시작/종료 알림</p>
            </div>
            <Toggle
              checked={Boolean(settings?.voteNotification)}
              disabled={!capabilities.notificationSettings || updateSettings.isPending}
              onClick={() => patchSettings({ voteNotification: !settings?.voteNotification })}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">계정 관리</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <button
            onClick={() => void handleLogout()}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <LogOut size={20} />
            </div>
            <span className="font-medium text-gray-700">로그아웃</span>
          </button>

          <button
            onClick={openWithdrawModal}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors text-left"
          >
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <UserX size={20} />
            </div>
            <span className="font-medium text-red-600">회원 탈퇴</span>
          </button>
        </div>
      </section>
    </div>
  );
}
