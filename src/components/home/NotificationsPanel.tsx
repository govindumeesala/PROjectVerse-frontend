import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Star, MessageCircle, UserPlus, GitBranch, Zap } from "lucide-react";

type NotificationItem = {
  id: string;
  type: "star" | "comment" | "follow" | "feature" | "update";
  title: string;
  time: string;
  read?: boolean;
};

const demoNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "feature",
    title: "Added support for WebP images",
    time: "19 hours ago",
  },
  {
    id: "2",
    type: "update",
    title: "Copilot coding agent now supports AGENTS.md custom...",
    time: "Yesterday",
  },
  {
    id: "3",
    type: "feature",
    title: "New collaboration tools available",
    time: "2 days ago",
  },
  {
    id: "4",
    type: "update",
    title: "Enhanced project search functionality",
    time: "3 days ago",
  },
];

const IconForType: Record<NotificationItem["type"], React.ReactNode> = {
  star: <Star className="w-4 h-4 text-amber-500" />,
  comment: <MessageCircle className="w-4 h-4 text-sky-600" />,
  follow: <UserPlus className="w-4 h-4 text-emerald-600" />,
  feature: <Zap className="w-4 h-4 text-purple-600" />,
  update: <GitBranch className="w-4 h-4 text-blue-600" />,
};

const NotificationsPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Latest changes</h2>
      </div>
      
      <div className="space-y-3">
        {demoNotifications.map((n) => (
          <div key={n.id} className="group">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
              <div className="mt-1 text-slate-400">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 leading-relaxed">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <button className="text-sm text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1">
          View changelog
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;


