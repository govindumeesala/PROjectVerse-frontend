// src/hooks/useNotificationSocket.ts
// Hook to integrate Socket.IO with notification system
import { useEffect } from "react";
import { toast } from "sonner";
import { useSocket, getSocket } from "./useSocket";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Notification } from "@/types/notification";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to set up Socket.IO notification listeners
 * Should be called once in the app (e.g., in App.tsx or Layout)
 */
export const useNotificationSocket = () => {
  const socket = useSocket();
  const { addNotification, updateUnreadCount } = useNotificationStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    /**
     * Listen for new notifications from server
     * Event name matches backend: "notification"
     */
    const handleNewNotification = (notification: Notification) => {
      console.log("📩 New notification received:", notification);

      // Add to Zustand store (prepends to list)
      addNotification(notification);

      // Update unread count
      updateUnreadCount(
        useNotificationStore.getState().notifications.filter((n) => !n.read).length
      );

      // Invalidate React Query cache to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });

      // Show toast notification
      const senderName = notification.sender?.name || notification.sender?.username || "Someone";
      const emoji = getNotificationEmoji(notification.type);
      
      toast.info(`${emoji} ${notification.title}`, {
        description: notification.message || `${senderName} ${getNotificationAction(notification.type)}`,
        duration: 5000,
        action: notification.link
          ? {
              label: "View",
              onClick: () => {
                window.location.href = notification.link!;
              },
            }
          : undefined,
      });
    };

    // Subscribe to notification events
    socket.on("notification", handleNewNotification);

    // Cleanup on unmount
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket, addNotification, updateUnreadCount, queryClient]);
};

/**
 * Get emoji for notification type
 */
const getNotificationEmoji = (type: Notification["type"]): string => {
  switch (type) {
    case "collab_request_received":
      return "🤝";
    case "collab_request_approved":
      return "✅";
    case "collab_request_rejected":
      return "❌";
    case "project_liked":
      return "❤️";
    case "project_commented":
      return "💬";
    case "project_bookmarked":
      return "🔖";
    case "system":
      return "📢";
    default:
      return "📩";
  }
};

/**
 * Get action description for notification type
 */
const getNotificationAction = (type: Notification["type"]): string => {
  switch (type) {
    case "collab_request_received":
      return "requested to join your project";
    case "collab_request_approved":
      return "approved your collaboration request";
    case "collab_request_rejected":
      return "declined your collaboration request";
    case "project_liked":
      return "liked your project";
    case "project_commented":
      return "commented on your project";
    case "project_bookmarked":
      return "bookmarked your project";
    case "system":
      return "sent you a system notification";
    default:
      return "sent you a notification";
  }
};

