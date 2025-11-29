// src/types/notification.ts
// Type definitions for notifications

export type Notification = {
  _id: string;
  type:
    | "collab_request_received"
    | "collab_request_approved"
    | "collab_request_rejected"
    | "project_liked"
    | "project_commented"
    | "project_bookmarked"
    | "system";
  title: string;
  message?: string;
  link?: string;
  read: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    name: string;
    username: string;
    profilePhoto?: string;
  };
  meta?: {
    projectId?: string;
    projectSlug?: string;
    projectTitle?: string;
    [key: string]: any;
  };
};

export type NotificationPagination = {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

