import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from './client';
import { useAuthStore } from '@/store/useAuthStore';
import { capabilities } from './capabilities';
import type {
  Notification,
  NotificationListResponse,
  NotificationSettings,
} from '@/types/notification';

const getNotifications = async (): Promise<NotificationListResponse> => {
  return client.get<NotificationListResponse>('/notifications');
};

const getNotification = async (notificationId: string): Promise<Notification> => {
  return client.get<Notification>(`/notifications/${notificationId}`);
};

const markAsRead = async (notificationId: string): Promise<void> => {
  await client.put(`/notifications/${notificationId}/read`);
};

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

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  detail: (notificationId: string) => [...NOTIFICATION_KEYS.all, 'detail', notificationId] as const,
  settings: () => [...NOTIFICATION_KEYS.all, 'settings'] as const,
};

export function useNotifications() {
  const { isLoggedIn, accessToken } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    enabled: isLoggedIn && !!accessToken,
  });
}

export function useNotificationDetail(notificationId?: string) {
  const { isLoggedIn, accessToken } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.detail(notificationId || ''),
    queryFn: () => getNotification(notificationId || ''),
    enabled: capabilities.notificationDetail && isLoggedIn && !!accessToken && !!notificationId,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
    },
  });
}

export function useNotificationSettings() {
  const { isLoggedIn, accessToken } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.settings(),
    queryFn: getNotificationSettings,
    enabled: capabilities.notificationSettings && isLoggedIn && !!accessToken,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(NOTIFICATION_KEYS.settings(), updatedSettings);
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.settings() });
    },
  });
}
