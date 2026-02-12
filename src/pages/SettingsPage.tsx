import { useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut, UserX, Moon, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWithdrawAccountModalStore } from '@/store/useWithdrawAccountModalStore';
import { Avatar } from '@/components/ui/Avatar';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { onOpen: openWithdrawModal } = useWithdrawAccountModalStore();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">설정</h1>

      {/* Profile Section */}
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

      {/* App Settings */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">앱 설정</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bell size={20} />
              </div>
              <div>
                <span className="font-medium text-gray-900">알림 설정</span>
                <p className="text-xs text-gray-500">푸시 알림 및 이메일 수신 설정</p>
              </div>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Moon size={20} />
              </div>
              <div>
                <span className="font-medium text-gray-900">다크 모드</span>
                <p className="text-xs text-gray-500">화면을 어둡게 설정합니다</p>
              </div>
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Account Management */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">계정 관리</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <button
            onClick={handleLogout}
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

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">WooriDo v1.2.0</p>
      </div>
    </div>
  );
}
