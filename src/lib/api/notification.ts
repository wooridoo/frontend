import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { client } from './client';
import type { Notification, NotificationResponse } from '@/types/notification';

// =====================
// Mock 전환 플래그
// =====================
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// =====================
// Mock Data
// =====================
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notificationId: 1,
    type: 'CHALLENGE',
    title: '정기모임 투표',
    message: '12월 28일 (금) 19:00',
    isRead: false,
    data: {
      subType: 'MEETING_VOTE',
      targetId: 'meet-001',
      voteOptions: ['참석', '불참']
    },
    createdAt: new Date().toISOString()
  },
  {
    notificationId: 2,
    type: 'PAYMENT',
    title: '결제 승인 요청',
    message: '챌린지 보증금 결제',
    isRead: false,
    data: {
      targetId: 'pay-001',
      amount: 10000
    },
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    notificationId: 3,
    type: 'SOCIAL',
    title: '새로운 댓글',
    message: '김철수님이 회원님의 챌린지에 댓글을 남겼습니다: "화이팅!"',
    isRead: true,
    data: {
      subType: 'COMMENT',
      targetId: 'chal-123'
    },
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

// =====================
// Mock Functions
// =====================
const mockGetNotifications = async (): Promise<NotificationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    content: MOCK_NOTIFICATIONS,
    totalElements: MOCK_NOTIFICATIONS.length,
    totalPages: 1,
    unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length
  };
};

const mockMarkAsRead = async (notificationId: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`[Mock] Notification ${notificationId} marked as read`);
};

// =====================
// API Functions
// =====================
const getNotifications = async (): Promise<NotificationResponse> => {
  if (USE_MOCK) return mockGetNotifications();
  return client.get<NotificationResponse>('/notifications');
};

const markAsRead = async (notificationId: number): Promise<void> => {
  if (USE_MOCK) return mockMarkAsRead(notificationId);
  return client.patch(`/notifications/${notificationId}/read`);
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
    // Polling or other configs can go here
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Poll every 5 minutes instead of refetching constantly
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

// Mock Action Mutations
export function useVoteMeeting() {
  return useMutation({
    mutationFn: async ({ meetingId, vote }: { meetingId: string, vote: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Voted ${vote} for meeting ${meetingId}`);
    },
    onSuccess: () => {
      // In real app, invalidate or update optimistically
      alert('투표가 완료되었습니다.');
    }
  });
}

export function useApprovePayment() {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Payment approved for ${paymentId}`);
    },
    onSuccess: () => {
      alert('결제가 승인되었습니다.');
    }
  });
}

