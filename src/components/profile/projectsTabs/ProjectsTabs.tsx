// src/components/profile/ProjectsTabs.tsx
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TabPlaceholder } from "./TabPlaceholder";
import MyProjectsPanel from "./MyProjectsPanel";
import ContributionsPanel from "./ContributionsPanel";
import BookmarksPanel from "./BookmarksPanel";
import { Search, Filter, Folder, Users, Bookmark, X, Sparkles } from "lucide-react";

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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-500">
      {/* Header: title + desktop search/filter (md+) + mobile icons (sm) */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Projects</h3>
        </div>

        {/* Desktop: search + filter inline */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative group">
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Search className="w-4 h-4 ml-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className="px-3 py-3 w-80 outline-none bg-transparent font-medium placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="px-3 hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                  title="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter by status"
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl font-medium hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          >
            <option value="">All status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Mobile: icons for search & filter */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          <button
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
        <div className="md:hidden mb-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <input
              ref={mobileSearchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              aria-label="Mobile search projects"
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-all duration-200"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
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
        <div className="md:hidden mb-4 animate-in slide-in-from-top-2 duration-300">
          <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-gray-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-500" />
                Filters
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Mobile filter by status"
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 outline-none transition-all duration-200"
              >
                <option value="">All status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setMobileFilterOpen(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Clear
              </button>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs: icon + label on md+, icon-only on mobile */}
      <Tabs value={active} onValueChange={(v) => openTab(v as any)}>
        <TabsList className="mb-6 flex gap-2 bg-gradient-to-r from-gray-100 to-gray-50 p-2 rounded-xl border border-gray-200">
          <TabsTrigger
            value="my"
            aria-label="My Projects"
            className="group flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <Folder className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden md:inline font-medium">My Projects</span>
          </TabsTrigger>

          <TabsTrigger
            value="contributed"
            aria-label="Contributed Projects"
            className="group flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden md:inline font-medium">Contributed</span>
          </TabsTrigger>

          <TabsTrigger
            value="bookmarks"
            aria-label="Bookmarks"
            className="group flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden md:inline font-medium">Bookmarks</span>
          </TabsTrigger>
        </TabsList>

        {/* Panels: pass debouncedSearch + statusFilter */}
        <TabsContent value="my" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {visited.my ? <MyProjectsPanel username={username} search={debouncedSearch} status={statusFilter} /> : <TabPlaceholder />}
        </TabsContent>

        <TabsContent value="contributed" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {visited.contributed ? <ContributionsPanel username={username} search={debouncedSearch} status={statusFilter} /> : <TabPlaceholder />}
        </TabsContent>

        <TabsContent value="bookmarks" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {visited.bookmarks ? <BookmarksPanel username={username} search={debouncedSearch} status={statusFilter} /> : <TabPlaceholder />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsTabs;
