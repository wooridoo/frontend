import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { client } from './client';
import type { NotificationResponse } from '@/types/notification';

// =====================
// API Functions
// =====================

/**
 * 1. 알림 목록 조회 (GET /notifications)
 */
const getNotifications = async (): Promise<NotificationResponse> => {
  try {
    const response = await client.get<NotificationResponse>('/notifications');
    return response;
  } catch (error) {
    console.error('❌ failed to fetch notifications:', error);
    throw error;
  }
};

/**
 * 2. 알림 읽음 처리 (PUT /notifications/{id}/read)
 */
const markAsRead = async (notificationId: string): Promise<void> => {
  return client.put(`/notifications/${notificationId}/read`);
};

// =====================
// React Query Hooks
// =====================
export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
};

export function useNotifications() {
  const { isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5,
    enabled: isLoggedIn,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
    }
  });
}
