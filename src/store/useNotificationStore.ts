// src/store/useNotificationStore.ts
// Zustand store for managing notification state
import { create } from "zustand";
import { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  initialize: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
  updateUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  /**
   * Initialize notifications (typically on page load)
   * Replaces existing notifications with new ones
   */
  initialize: (notifications: Notification[]) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({
      notifications,
      unreadCount,
    });
  },

  /**
   * Add a new notification (prepended to list)
   * Prevents duplicates by checking _id
   * Auto-updates unread count
   */
  addNotification: (notification: Notification) => {
    const { notifications } = get();
    
    // Check for duplicates
    const exists = notifications.some((n) => n._id === notification._id);
    if (exists) {
      console.warn("Duplicate notification ignored:", notification._id);
      return;
    }

    // Prepend to list (newest first)
    const updatedNotifications = [notification, ...notifications];
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  /**
   * Mark a single notification as read
   * Updates unread count automatically
   */
  markAsRead: (id: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((n) =>
      n._id === id ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  /**
   * Mark all notifications as read
   * Resets unread count to 0
   */
  markAllRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));

    set({
      notifications: updatedNotifications,
      unreadCount: 0,
    });
  },

  /**
   * Update unread count (useful after fetching from API)
   */
  updateUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },

  /**
   * Reset store (useful on logout)
   */
  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },
}));

