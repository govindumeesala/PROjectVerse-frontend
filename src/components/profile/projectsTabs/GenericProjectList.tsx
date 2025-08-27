// src/components/profile/projectsTabs/GenericProjectList.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/api/projectApi";
import ProjectCard from "@/components/profile/projectsTabs/ProjectCard";
import SimplePagination from "@/components/profile/projectsTabs/SimplePagination";

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
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
      ) : null}

      {isLoading ? (
        <>
          <Skeleton className="h-16 rounded-lg mb-3" />
          <Skeleton className="h-16 rounded-lg mb-3" />
          <Skeleton className="h-16 rounded-lg mb-3" />
        </>
      ) : isError ? (
        <div className="text-sm text-red-600">Failed to load projects.</div>
      ) : projects.length === 0 ? (
        <div className="text-sm text-gray-500">No projects found.</div>
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

      <div className="mt-4">
        <SimplePagination page={page} setPage={setPage} total={total} limit={limit} />
      </div>
    </div>
  );
};

export default GenericProjectList;
