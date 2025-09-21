// src/components/profile/StatsCard.tsx
import React, { useState } from "react";
import { useGetMyStats } from "@/api/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, BookOpen, Target, Award, Activity } from "lucide-react";

const Donut = ({
  active = 0,
  completed = 0,
  size = 120,
  onClick,
  label,
}: {
  active?: number;
  completed?: number;
  size?: number;
  onClick?: () => void;
  label?: string;
}) => {
  const radius = 36;
  const stroke = 8;
  const total = Math.max(active + completed, 1);

  const circumference = 2 * Math.PI * radius;
  const activeRatio = active / total;
  const completedRatio = completed / total;

  const activeDash = circumference * activeRatio;
  const completedDash = circumference * completedRatio;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? "Donut chart"}
      className="group focus:outline-none hover:scale-110 transition-all duration-300 cursor-pointer"
      style={{ width: size }}
    >
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto block drop-shadow-lg">
          {/* background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={stroke}
            stroke="#e2e8f0"
            fill="none"
            className="drop-shadow-sm"
          />
          {/* active arc (sky-500) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={stroke}
            stroke="url(#activeGradient)"
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 50 50)"
            strokeDasharray={`${activeDash} ${circumference - activeDash}`}
            className="group-hover:stroke-[10] transition-all duration-500 animate-pulse"
          />
          {/* completed arc (emerald-500) - starts where active ends */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={stroke}
            stroke="url(#completedGradient)"
            strokeLinecap="round"
            fill="none"
            transform={`rotate(${(activeRatio * 360) - 90} 50 50)`}
            strokeDasharray={`${completedDash} ${circumference - completedDash}`}
            className="group-hover:stroke-[10] transition-all duration-500"
          />
          {/* Gradients */}
          <defs>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold fill-current text-slate-700 group-hover:text-slate-900 transition-colors duration-300"
            style={{ fontSize: 12 }}
          >
            {total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%"}
          </text>
        </svg>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      </div>
    </button>
  );
};

const StatTile = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) => {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? handleKey : undefined}
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      className={`group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-200 focus:shadow-xl focus:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors duration-200">{label}</div>
      <div className="text-3xl font-bold mt-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">{value}</div>
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

const ProgressBar = ({
  label,
  value,
  max,
  onClick,
}: {
  label: string;
  value: number;
  max: number;
  onClick?: () => void;
}) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  const handleKey = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? handleKey : undefined}
      onClick={onClick}
      aria-label={`${label}: ${value} of ${max}`}
      className={`group w-full transition-all duration-300 hover:scale-[1.02] ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex justify-between text-sm text-gray-600 mb-2 group-hover:text-gray-800 transition-colors duration-200">
        <div className="font-medium">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
      <div className="w-full bg-gradient-to-r from-slate-100 to-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="h-3 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full shadow-sm group-hover:from-sky-400 group-hover:to-blue-500 transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  username?: string; 
}

const StatsCard: React.FC<Props> = ({ username }) => {
  const { stats, isPending } = useGetMyStats(username);
  const [showDonutBreakdown, setShowDonutBreakdown] = useState(false);

  if (isPending || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Donut chart skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-center mb-4">
            <Skeleton className="w-36 h-36 rounded-full" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-28 mx-auto" />
          </div>
        </div>

        {/* Stats tiles skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 grid grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>

        {/* Progress bars skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-6" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-6" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    projectsOwned = 0,
    activeProjects = 0,
    completedProjects = 0,
    collaborationsCount = 0,
    contributionsCount = 0,
    bookmarksCount = 0,
  } = stats;

  const handleDonutClick = () => {
    setShowDonutBreakdown((s) => !s);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* left: donut + summary */}
      <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col items-center hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 font-medium">
          <Target className="w-4 h-4 text-blue-500" />
          <span>Projects Overview</span>
        </div>

        <Donut
          active={activeProjects}
          completed={completedProjects}
          size={140}
          onClick={handleDonutClick}
          label="Projects completion donut"
        />

        <div className="mt-4 text-center">
          <div className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">{projectsOwned}</div>
          <div className="text-sm text-gray-600 font-medium mt-1">Total Projects Owned</div>
        </div>

        {/* breakdown toggled when donut clicked */}
        <div
          className={`w-full mt-4 overflow-hidden transition-all duration-500 ease-out ${
            showDonutBreakdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!showDonutBreakdown}
        >
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-blue-600 font-medium">
                  <Activity className="w-3 h-3" />
                  Active
                </span>
                <span className="font-bold text-blue-700">{activeProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <Award className="w-3 h-3" />
                  Completed
                </span>
                <span className="font-bold text-green-700">{completedProjects}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* middle: tiles */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 grid grid-cols-2 gap-4 hover:shadow-2xl transition-all duration-500">
        <div className="relative">
          <StatTile label="Active" value={activeProjects} />
        </div>
        <div className="relative">
          <StatTile label="Completed" value={completedProjects} />
        </div>
        <div className="relative">
          <StatTile label="Collaborations" value={collaborationsCount} />
        </div>
        <div className="relative">
          <StatTile label="Contributions" value={contributionsCount} />
        </div>
      </div>

      {/* right: progress bars / bookmarks */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col gap-4 hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>Engagement Metrics</span>
        </div>

        <ProgressBar
          label="Projects completed"
          value={completedProjects}
          max={projectsOwned || 1}
        />

        <ProgressBar
          label="Collaborations"
          value={collaborationsCount}
          max={Math.max(1, collaborationsCount, contributionsCount)}
        />

        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600 font-medium">Bookmarks</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {bookmarksCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;