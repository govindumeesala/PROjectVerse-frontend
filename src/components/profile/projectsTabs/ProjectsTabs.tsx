// src/components/profile/ProjectsTabs.tsx
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TabPlaceholder } from "./TabPlaceholder";
import MyProjectsPanel from "./MyProjectsPanel";
import ContributionsPanel from "./ContributionsPanel";
import BookmarksPanel from "./BookmarksPanel";
import { Search, Filter, Folder, Users, Bookmark, X } from "lucide-react";

/**
 * Responsive ProjectsTabs
 *
 * - Desktop: shows full search input + status select inline, tabs with icon + label
 * - Mobile: shows icon-only tabs, two icon buttons for search/filter that open overlays
 *
 * Panels accept props: search (string) and status ('' | 'ongoing' | 'completed')
 */

type Props = {
  username?: string;
}

const ProjectsTabs: React.FC<Props> = ({ username }) => {
  const [active, setActive] = useState<"my" | "contributed" | "bookmarks">("my");
  const [visited, setVisited] = useState({ my: true, contributed: false, bookmarks: false });

  // Search/filter state (applies to panels)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ongoing" | "completed">("");

  // Debounced search value (to avoid too many queries)
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Mobile overlays
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const openTab = (val: "my" | "contributed" | "bookmarks") => {
    setActive(val);
    setVisited((s) => ({ ...s, [val]: true }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header: title + desktop search/filter (md+) + mobile icons (sm) */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold">Projects</h3>

        {/* Desktop: search + filter inline */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Search className="w-4 h-4 ml-2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="px-3 py-2 w-72 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="px-2"
                title="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter by status"
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Mobile: icons for search & filter */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <button
            className="p-2 rounded-md border"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            className="p-2 rounded-md border"
            onClick={() => setMobileFilterOpen(true)}
            aria-label="Open filters"
            title="Filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile search overlay (simple, full-width under header) */}
      {mobileSearchOpen && (
        <div className="md:hidden mb-3">
          <div className="flex items-center gap-2">
            <input
              ref={mobileSearchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              aria-label="Mobile search projects"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 rounded-md border"
              aria-label="Close search"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile filter sheet */}
      {mobileFilterOpen && (
        <div className="md:hidden mb-3">
          <div className="p-3 border rounded-md bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Filters</div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-600">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Mobile filter by status"
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setMobileFilterOpen(false);
                }}
                className="px-3 py-1 border rounded-md"
              >
                Clear
              </button>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs: icon + label on md+, icon-only on mobile */}
      <Tabs value={active} onValueChange={(v) => openTab(v as any)}>
        <TabsList className="mb-4 flex gap-2">
          <TabsTrigger
            value="my"
            aria-label="My Projects"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Folder className="w-4 h-4" />
            <span className="hidden md:inline">My Projects</span>
          </TabsTrigger>

          <TabsTrigger
            value="contributed"
            aria-label="Contributed Projects"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Contributed</span>
          </TabsTrigger>

          <TabsTrigger
            value="bookmarks"
            aria-label="Bookmarks"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">Bookmarks</span>
          </TabsTrigger>
        </TabsList>

        {/* Panels: pass debouncedSearch + statusFilter */}
        <TabsContent value="my">
          {visited.my ? <MyProjectsPanel username={username} search={debouncedSearch} status={statusFilter} /> : <TabPlaceholder />}
        </TabsContent>

        <TabsContent value="contributed">
          {visited.contributed ? <ContributionsPanel username={username} search={debouncedSearch} status={statusFilter} /> : <TabPlaceholder />}
        </TabsContent>

        <TabsContent value="bookmarks">
          {visited.bookmarks ? <BookmarksPanel username={username} search={debouncedSearch} status={statusFilter} /> : <TabPlaceholder />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsTabs;
