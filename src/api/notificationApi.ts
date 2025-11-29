// src/api/notificationApi.ts
// React Query hooks for notification API endpoints
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Notification, NotificationPagination } from "@/types/notification";
import { useNotificationStore } from "@/store/useNotificationStore";
import { ENDPOINTS } from "./endpoints";

const BASE_API = import.meta.env.VITE_BASE_API;

/**
 * Fetch all notifications for the logged-in user
 */
export const getNotifications = async (
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<NotificationPagination> => {
  const params: any = { page, limit };
  if (unreadOnly) params.unreadOnly = "true";

  const response = await api.get(`${BASE_API}/notifications`, { params });
  return response.data.data;
};

/**
 * Fetch unread count
 */
export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const response = await api.get(`${BASE_API}/notifications/unread-count`);
  return response.data.data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`${BASE_API}/notifications/${id}/read`);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<{ updatedCount: number }> => {
  const response = await api.patch(`${BASE_API}/notifications/read-all`);
  return response.data.data;
};

/**
 * React Query hook: Fetch notifications with infinite scroll
 * Automatically syncs with Zustand store
 */
export const useNotifications = (
  limit: number = 20,
  unreadOnly: boolean = false,
  enabled: boolean = true
) => {
  const { initialize, updateUnreadCount } = useNotificationStore();

  return useInfiniteQuery({
    queryKey: ["notifications", limit, unreadOnly],
    queryFn: ({ pageParam = 1 }) => getNotifications(pageParam, limit, unreadOnly),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    onSuccess: (data) => {
      // Flatten all pages and sync with Zustand store
      const allNotifications = data.pages.flatMap((page) => page.notifications);
      initialize(allNotifications);
    },
    staleTime: 30000, // 30 seconds
  });
};

/**
 * React Query hook: Fetch unread count
 * Automatically syncs with Zustand store
 */
export const useUnreadCount = (enabled: boolean = true) => {
  const { updateUnreadCount } = useNotificationStore();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled,
    refetchInterval: 60000, // Refetch every minute
    onSuccess: (data) => {
      // Sync with Zustand store
      updateUnreadCount(data.unreadCount);
    },
  });
};

/**
 * React Query hook: Mark notification as read
 * Optimistic UI update
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { markAsRead } = useNotificationStore();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Optimistically update Zustand store
      markAsRead(id);

      // Return context for rollback
      return { id };
    },
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error, id, context) => {
      // Rollback on error (optional - could re-fetch instead)
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    },
  });
};

/**
 * React Query hook: Mark all notifications as read
 */
export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  const { markAllRead } = useNotificationStore();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      
      // Optimistically update Zustand store
      markAllRead();

      return {};
    },
    onSuccess: (data) => {
      toast.success(`Marked ${data.updatedCount} notifications as read`);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error) => {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    },
  });
};

