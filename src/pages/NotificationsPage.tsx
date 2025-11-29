// src/pages/NotificationsPage.tsx
// Full notification page with pagination and filters
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useNotifications, useMarkAsRead, useMarkAllRead } from "@/api/notificationApi";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCheck, Bell } from "lucide-react";
import { Notification } from "@/types/notification";

const NotificationsPage = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const { markAsRead } = useNotificationStore();
  const { mutate: markAsReadMutation } = useMarkAsRead();
  const { mutate: markAllReadMutation } = useMarkAllRead();

  // Fetch notifications with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useNotifications(20, filter === "unread", isAuthenticated);

  // Infinite scroll trigger
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Trigger fetch next page when scrolled to bottom
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  // Flatten all pages for display
  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  /**
   * Handle notification click
   */
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
      markAsReadMutation(notification._id);
    }
  };

  /**
   * Handle "Mark all as read" button
   */
  const handleMarkAllRead = () => {
    markAllReadMutation();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view notifications</p>
          <Link to="/auth/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllRead}
                className="flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-6 border-b border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`pb-3 px-4 font-medium transition-colors ${
                filter === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`pb-3 px-4 font-medium transition-colors ${
                filter === "unread"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading && notifications.length === 0 ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                {filter === "unread" ? "No unread notifications" : "You're all caught up! 🎉"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {filter === "unread"
                  ? "All your notifications have been read"
                  : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationListItem
                  key={notification._id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasNextPage && (
            <div ref={ref} className="p-4 text-center">
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-32" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Individual notification list item
 */
const NotificationListItem = ({
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
      className="block p-6 hover:bg-gray-50 transition-colors"
    >
      <NotificationItemContent notification={notification} timeAgo={timeAgo} />
    </Link>
  ) : (
    <div
      onClick={onClick}
      className="block p-6 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <NotificationItemContent notification={notification} timeAgo={timeAgo} />
    </div>
  );

  return (
    <div className={notification.read ? "" : "bg-blue-50"}>
      {content}
    </div>
  );
};

/**
 * Notification item content
 */
const NotificationItemContent = ({
  notification,
  timeAgo,
}: {
  notification: Notification;
  timeAgo: string;
}) => {
  return (
    <div className="flex gap-4">
      {/* Sender Avatar */}
      {notification.sender ? (
        <div className="flex-shrink-0">
          {notification.sender.profilePhoto ? (
            <img
              src={notification.sender.profilePhoto}
              alt={notification.sender.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg border-2 border-gray-200">
              {notification.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200">
          <span className="text-gray-600 text-lg">📢</span>
        </div>
      )}

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p
                className={`text-base font-semibold ${
                  notification.read ? "text-gray-700" : "text-gray-900"
                }`}
              >
                {notification.title}
              </p>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
              )}
            </div>
            {notification.message && (
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{timeAgo}</span>
              {notification.sender && (
                <>
                  <span>•</span>
                  <Link
                    to={`/${notification.sender.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-blue-600 hover:underline"
                  >
                    @{notification.sender.username}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

