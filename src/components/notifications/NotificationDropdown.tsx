// src/components/notifications/NotificationDropdown.tsx
// Dropdown panel showing latest notifications
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useNotifications, useMarkAsRead, useMarkAllRead } from "@/api/notificationApi";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCheck } from "lucide-react";
import { Notification } from "@/types/notification";

const NotificationDropdown = ({ onClose }: { onClose: () => void }) => {
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const notifications = useNotificationStore((state) => state.notifications);
  const { markAsRead } = useNotificationStore();
  const { mutate: markAsReadMutation } = useMarkAsRead();
  const { mutate: markAllReadMutation } = useMarkAllRead();

  // Fetch latest notifications (first page, limit 20)
  const { data, isLoading } = useNotifications(20, false, isAuthenticated);

  // Get latest 20 notifications from store or from API data
  const latestNotifications = data?.pages[0]?.notifications || notifications.slice(0, 20);

  /**
   * Handle notification click
   * - Mark as read
   * - Navigate to link
   * - Close dropdown
   */
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
      markAsReadMutation(notification._id);
    }
    
    if (notification.link) {
      onClose();
      // Navigation will be handled by Link component
    }
  };

  /**
   * Handle "Mark all as read" button
   */
  const handleMarkAllRead = () => {
    markAllReadMutation();
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        {latestNotifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : latestNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">You're all caught up! 🎉</p>
            <p className="text-gray-400 text-xs mt-2">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {latestNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {latestNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

/**
 * Individual notification item component
 */
const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) => {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const content = notification.link ? (
    <Link
      to={notification.link}
      onClick={onClick}
      className="block p-4 hover:bg-gray-50 transition-colors"
    >
      <NotificationContent notification={notification} timeAgo={timeAgo} />
    </Link>
  ) : (
    <div
      onClick={onClick}
      className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <NotificationContent notification={notification} timeAgo={timeAgo} />
    </div>
  );

  return (
    <div className={notification.read ? "" : "bg-blue-50"}>
      {content}
    </div>
  );
};

/**
 * Notification content (reusable)
 */
const NotificationContent = ({
  notification,
  timeAgo,
}: {
  notification: Notification;
  timeAgo: string;
}) => {
  return (
    <div className="flex gap-3">
      {/* Sender Avatar */}
      {notification.sender ? (
        <div className="flex-shrink-0">
          {notification.sender.profilePhoto ? (
            <img
              src={notification.sender.profilePhoto}
              alt={notification.sender.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {notification.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-xs">📢</span>
        </div>
      )}

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium ${
              notification.read ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
        {notification.message && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
      </div>
    </div>
  );
};

export default NotificationDropdown;

