// src/components/profile/projectsTabs/GenericProjectList.tsx
import React from "react";
import { Project } from "@/api/projectApi";
import ProjectCard from "@/components/profile/projectsTabs/ProjectCard";
import SimplePagination from "@/components/profile/projectsTabs/SimplePagination";
import { Skeleton } from "@/components/ui/skeleton";

const GenericProjectList: React.FC<{
  title?: string;
  projects: Project[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  page: number;
  setPage: (p: number) => void;
  limit: number;
  showOwner?: boolean;
  showBookmarkAction?: boolean;
  isBookmarkedList?: boolean;
  onToggleBookmark?: (projectId: string, action: "add" | "remove") => void;
  loadingId?: string | null;
  removedIds?: Set<string>; // IDs marked as soft-removed
  onUndo?: (projectId: string) => void;
}> = ({
  title,
  projects,
  total,
  isLoading,
  isError,
  page,
  setPage,
  limit,
  showOwner = true,
  showBookmarkAction = false,
  isBookmarkedList = false,
  onToggleBookmark,
  loadingId = null,
  removedIds = new Set(),
  onUndo,
}) => {
  return (
    <div>
      {title ? (
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-base font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h4>
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm animate-pulse">
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
          Failed to load projects.
        </div>
      ) : projects.length === 0 ? (
        <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white text-sm text-gray-600">
          No projects found.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              showOwner={showOwner}
              showBookmarkAction={showBookmarkAction}
              isBookmarked={isBookmarkedList}
              onToggleBookmark={onToggleBookmark}
              isLoading={loadingId === p._id}
              removed={removedIds.has(p._id)}
              onUndo={onUndo}
            />
          ))}
        </div>
      )}

      <div className="mt-5">
        <SimplePagination page={page} setPage={setPage} total={total} limit={limit} />
      </div>
    </div>
  );
};

export default GenericProjectList;
