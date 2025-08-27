// src/components/profile/projectsTabs/ProjectCard.tsx
import React from "react";
import { Project } from "@/api/projectApi";
import { Bookmark, Loader2, RotateCcw } from "lucide-react";

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
      className={`flex items-start gap-3 p-3 border rounded-md transition-opacity ${
        removed ? "opacity-50" : "opacity-100"
      }`}
    >
      <img
        src={project.projectPhoto || "/placeholders/project-placeholder.png"}
        alt={project.title || "Project image"}
        className="w-14 h-14 object-cover rounded-md flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{project.title}</div>
            <div className="text-xs text-gray-500 truncate">{domains}</div>
            {techs ? <div className="text-xs text-gray-500 truncate mt-1">Tech: {techs}</div> : null}
          </div>

          <div className="flex-shrink-0 text-right">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                project.status === "completed" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
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
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="text-xs text-gray-700">{project.owner?.name ?? "Unknown owner"}</div>
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
                      className="w-6 h-6 rounded-full border-2 border-white object-cover"
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
                    className="flex items-center gap-2 px-2 py-1 border rounded text-sm hover:bg-gray-50 focus:outline-none focus:ring-2"
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
                    className={`flex items-center gap-2 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 ${
                      isBookmarked
                        ? "bg-blue-600 text-white border-transparent"
                        : "border"
                    }`}
                    aria-pressed={isBookmarked}
                    aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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
