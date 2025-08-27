// src/components/profile/BookmarksPanel.tsx
import React, { useEffect, useState } from "react";
import { useGetBookmarks, useToggleBookmark } from "@/api/userApi";
import { Project } from "@/api/projectApi";
import GenericProjectList from "@/components/profile/projectsTabs/GenericProjectList";

const BookmarksPanel: React.FC<{ search?: string; status?: string }> = ({ search = "", status = "" }) => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetBookmarks(page, true, search, status);

  // local items mirror server list (we do NOT remove items here on delete)
  const [items, setItems] = useState<Project[]>(projects);
  useEffect(() => setItems(projects), [projects]);

  const { toggleBookmark } = useToggleBookmark();

  // per-item loading id to show spinner on the item being processed
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // soft-removed set: we mark items removed but keep them in the list, allowing undo
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleRemove = async (projectId: string) => {
    try {
      setLoadingId(projectId);
      await toggleBookmark({ projectId, action: "remove" });
      // DO NOT remove from UI; instead mark it soft-removed so user can undo.
      setRemovedIds((prev) => new Set(prev).add(projectId));
    } catch (err) {
      // mutation's onError already shows toast; nothing more to do
    } finally {
      setLoadingId(null);
    }
  };

  const handleUndo = async (projectId: string) => {
    try {
      setLoadingId(projectId);
      await toggleBookmark({ projectId, action: "add" });
      // successful re-add -> clear soft-removed state
      setRemovedIds((prev) => {
        const n = new Set(prev);
        n.delete(projectId);
        return n;
      });
    } catch (err) {
      // onError handled by mutation
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <GenericProjectList
      title="Bookmarked Projects"
      projects={items}
      total={total}
      isLoading={isPending}
      isError={isError}
      page={page}
      setPage={setPage}
      limit={3}
      showOwner={true}
      showBookmarkAction={true}
      isBookmarkedList={true}
      onToggleBookmark={handleRemove} // remove call
      loadingId={loadingId}
      removedIds={removedIds}
      onUndo={handleUndo}
    />
  );
};

export default BookmarksPanel;
