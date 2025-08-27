// src/components/profile/StatsCard.tsx
import React, { useState } from "react";
import { useGetMyStats } from "@/api/userApi";
import { Skeleton } from "@/components/ui/skeleton";

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
      className="group focus:outline-none"
      style={{ width: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto block">
        {/* background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={stroke}
          stroke="#e6eefb"
          fill="none"
        />
        {/* active arc (sky-500) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={stroke}
          stroke="#0ea5e9"
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 50 50)"
          strokeDasharray={`${activeDash} ${circumference - activeDash}`}
          className="group-hover:scale-105 transition-all duration-500"
        />
        {/* completed arc (emerald-500) - starts where active ends */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={stroke}
          stroke="#11cd00ff"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${(activeRatio * 360) - 90} 50 50)`}
          strokeDasharray={`${completedDash} ${circumference - completedDash}`}
          className="group-hover:scale-105 transition-all duration-500"
        />
        {/* center text */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs font-semibold fill-current text-slate-700"
          style={{ fontSize: 11 }}
        >
          {total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%"}
        </text>
      </svg>
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
      className={`bg-white rounded-lg shadow p-4 flex flex-col items-center transition-transform transform hover:scale-[1.02] hover:shadow-lg focus:shadow-lg focus:scale-[1.02] ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
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
      className={`w-full transition-colors ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <div>{label}</div>
        <div>{value}</div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-sky-500 rounded-full"
          style={{ width: `${pct}%`, transition: "width 600ms ease" }}
        />
      </div>
    </div>
  );
};

const StatsCard: React.FC = () => {
  const { stats, isPending } = useGetMyStats();
  const [showDonutBreakdown, setShowDonutBreakdown] = useState(false);

  if (isPending || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* left: donut + summary */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="text-sm text-gray-500 mb-2">Projects (active vs completed)</div>

        <Donut
          active={activeProjects}
          completed={completedProjects}
          size={120}
          onClick={handleDonutClick}
          label="Projects completion donut"
        />

        <div className="mt-3 text-center">
          <div className="font-semibold text-lg">{projectsOwned}</div>
          <div className="text-sm text-gray-600">Total projects owned</div>
        </div>

        {/* breakdown toggled when donut clicked */}
        <div
          className={`w-full mt-3 overflow-hidden transition-all duration-300 ${
            showDonutBreakdown ? "max-h-40" : "max-h-0"
          }`}
          aria-hidden={!showDonutBreakdown}
        >
          <div className="text-sm text-gray-700 mt-2">
            <div className="flex justify-between">
              <span className="text-sky-600">Active</span>
              <span className="font-medium">{activeProjects}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-emerald-600">Completed</span>
              <span className="font-medium">{completedProjects}</span>
            </div>
          </div>
        </div>
      </div>

      {/* middle: tiles */}
      <div className="bg-white rounded-lg shadow p-4 grid grid-cols-2 gap-4">
        <StatTile label="Active" value={activeProjects} />
        <StatTile label="Completed" value={completedProjects} />
        <StatTile label="Collaborations" value={collaborationsCount} />
        <StatTile label="Contributions" value={contributionsCount} />
      </div>

      {/* right: progress bars / bookmarks */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
        <div className="text-sm text-gray-500">Engagement</div>

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

        <div className="mt-3">
          <div className="text-sm text-gray-500">Bookmarks</div>
          <div className="text-lg font-semibold mt-1 cursor-default">
            {bookmarksCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
