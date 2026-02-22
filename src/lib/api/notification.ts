import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { capabilities } from './capabilities';
import { client } from './client';
import type {
  Notification,
  NotificationListResponse,
  NotificationMarkReadResponse,
  NotificationQuery,
  NotificationSettings,
} from '@/types/notification';

const getNotifications = async (params?: NotificationQuery): Promise<NotificationListResponse> =>
  client.get<NotificationListResponse>('/notifications', { params });

const getNotification = async (notificationId: string): Promise<Notification> =>
  client.get<Notification>(`/notifications/${notificationId}`);

const markAsRead = async (notificationId: string): Promise<NotificationMarkReadResponse> =>
  client.put<NotificationMarkReadResponse>(`/notifications/${notificationId}/read`);

const markAllAsRead = async (): Promise<void> => {
  if (!capabilities.notificationReadAll) return;
  await client.put('/notifications/read-all');
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: false,
  emailEnabled: false,
  smsEnabled: false,
  voteNotification: false,
  meetingNotification: false,
  expenseNotification: false,
  snsNotification: false,
  systemNotification: false,
  quietHoursEnabled: false,
  quietHoursStart: undefined,
  quietHoursEnd: undefined,
};

const getNotificationSettings = async (): Promise<NotificationSettings> => {
  if (!capabilities.notificationSettings) return DEFAULT_NOTIFICATION_SETTINGS;
  return client.get<NotificationSettings>('/notifications/settings');
};

const updateNotificationSettings = async (
  payload: Partial<NotificationSettings>,
): Promise<NotificationSettings> => {
  if (!capabilities.notificationSettings) {
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...payload };
  }
  return client.put<NotificationSettings>('/notifications/settings', payload);
};

/**
 * 알림 도메인 React Query 키입니다.
 */
export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (params?: NotificationQuery) => [...NOTIFICATION_KEYS.all, 'list', params || {}] as const,
  detail: (notificationId: string) => [...NOTIFICATION_KEYS.all, 'detail', notificationId] as const,
  settings: () => [...NOTIFICATION_KEYS.all, 'settings'] as const,
};

/**
 * 알림 목록을 조회합니다.
 */
export function useNotifications(params?: NotificationQuery) {
  const { isLoggedIn, accessToken } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    enabled: isLoggedIn && !!accessToken,
  });
}

/**
 * 알림 상세를 조회합니다.
 */
export function useNotificationDetail(notificationId?: string) {
  const { isLoggedIn, accessToken } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.detail(notificationId || ''),
    queryFn: () => getNotification(notificationId || ''),
    enabled: capabilities.notificationDetail && isLoggedIn && !!accessToken && !!notificationId,
  });
}

/**
 * 단건 읽음 처리 mutation입니다.
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

/**
 * 전체 읽음 처리 mutation입니다.
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

/**
 * 알림 설정을 조회합니다.
 */
export function useNotificationSettings() {
  const { isLoggedIn, accessToken } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.settings(),
    queryFn: getNotificationSettings,
    enabled: capabilities.notificationSettings && isLoggedIn && !!accessToken,
  });
}

/**
 * 알림 설정을 저장합니다.
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: updatedSettings => {
      queryClient.setQueryData(NOTIFICATION_KEYS.settings(), updatedSettings);
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.settings() });
    },
  });
}

