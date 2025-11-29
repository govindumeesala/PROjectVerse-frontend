// src/components/notifications/NotificationBell.tsx
// Notification bell icon with unread badge and dropdown
import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useUnreadCount } from "@/api/notificationApi";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  
  // Fetch unread count if authenticated
  useUnreadCount(isAuthenticated);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-cyan-400 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-blue-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default NotificationBell;

