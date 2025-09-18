// src/components/profile/projectsTabs/ProjectCard.tsx
import React from "react";
import { Project } from "@/api/projectApi";
import { Bookmark, RotateCcw } from "lucide-react";
import { Bouncy } from 'ldrs/react';
import 'ldrs/react/Bouncy.css';

type Props = {
  project: Project;
  showOwner?: boolean;
  showBookmarkAction?: boolean;
  onToggleBookmark?: (projectId: string, action: "add" | "remove") => void;
  isBookmarked?: boolean;
  isLoading?: boolean;
  removed?: boolean; // soft-removed state (do not actually remove from list)
  onUndo?: (projectId: string) => void; // undo handler (calls add)
};

const ProjectCard: React.FC<Props> = ({
  project,
  showOwner = true,
  showBookmarkAction = false,
  onToggleBookmark,
  isBookmarked = false,
  isLoading = false,
  removed = false,
  onUndo,
}) => {
  const domains = Array.isArray(project.domain) ? project.domain.join(", ") : project.domain ?? "";
  const techs = Array.isArray(project.techStack) ? project.techStack.join(", ") : (project.techStack as any) ?? "";

  const handleRemove = () => {
    if (!onToggleBookmark) return;
    // we expect BookmarksPanel to pass isBookmarked=true, so remove will be called
    onToggleBookmark(project._id, "remove");
  };

  const handleUndo = () => {
    if (!onUndo) return;
    onUndo(project._id);
  };

  return (
    <div
      className={`group flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] ${
        removed ? "opacity-50" : "opacity-100"
      }`}
    >
      <img
        src={project.projectPhoto || "/placeholders/project-placeholder.png"}
        alt={project.title || "Project image"}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 ring-2 ring-white/60 group-hover:ring-blue-200 transition-all duration-300"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {project.title}
            </div>
            <div className="text-xs text-gray-500 truncate">{domains}</div>
            {techs ? (
              <div className="text-xs text-gray-500 truncate mt-1">Tech: {techs}</div>
            ) : null}
          </div>

          <div className="flex-shrink-0 text-right">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm ${
                project.status === "completed"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              }`}
              aria-label={`Project status ${project.status ?? "ongoing"}`}
            >
              {project.status ?? "ongoing"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {showOwner ? (
              <div className="flex items-center gap-2">
                <img
                  src={project.owner?.profilePhoto || "/placeholders/avatar.png"}
                  alt={project.owner?.name ? `${project.owner.name} profile` : "Owner profile"}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white/60"
                />
                <div className="text-xs text-gray-700 font-medium">{project.owner?.name ?? "Unknown owner"}</div>
              </div>
            ) : null}

            {Array.isArray(project.contributors) && project.contributors.length > 0 ? (
              <div className="ml-3 flex items-center gap-2">
                <div className="text-xs text-gray-500">Contributors:</div>
                <div className="flex -space-x-2">
                  {project.contributors.map((c) => (
                    <img
                      key={c._id}
                      src={c.profilePhoto || "/placeholders/avatar.png"}
                      alt={c.name ? `${c.name} profile` : "Contributor"}
                      title={c.name}
                      className="w-6 h-6 rounded-full border-2 border-white object-cover hover:scale-105 transition-transform duration-200"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Actions area */}
          <div className="flex items-center gap-2">
            {showBookmarkAction && (
              <>
                {removed ? (
                  // Show Undo when soft-removed
                  <button
                    onClick={handleUndo}
                    className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Undo remove bookmark"
                    title="Undo"
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Undo</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRemove}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isBookmarked
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm hover:shadow-md"
                        : "border hover:bg-gray-50"
                    }`}
                    aria-pressed={isBookmarked}
                    aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Bouncy size="16" speed="1.75" color="#ffffff" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                    <span>{isBookmarked ? "Saved" : "Bookmark"}</span>
                  </button>
                )}
              </>
            )}

            <div className="text-xs text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
