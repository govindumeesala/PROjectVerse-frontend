// src/components/profile/ProjectsTabs.tsx
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // shadcn/ui wrapper
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyProjects,
  useGetContributedProjects,
  Project,
} from "@/api/projectApi"; // make sure these hooks exist and match signatures
import { useGetBookmarks } from "@/api/userApi";

const PAGE_LIMIT = 3;

const ProjectsTabs: React.FC = () => {
  const [active, setActive] = useState<"my" | "contributed" | "bookmarks">("my");
  const [visited, setVisited] = useState({ my: true, contributed: false, bookmarks: false });

  const openTab = (val: "my" | "contributed" | "bookmarks") => {
    setActive(val);
    setVisited((s) => ({ ...s, [val]: true }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Projects</h3>
      </div>

      <Tabs value={active} onValueChange={(v) => openTab(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="my" aria-label="My Projects">
            My Projects
          </TabsTrigger>
          <TabsTrigger value="contributed" aria-label="Contributed Projects">
            Contributed
          </TabsTrigger>
          <TabsTrigger value="bookmarks" aria-label="Bookmarked Projects">
            Bookmarks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my">{visited.my ? <MyProjectsPanel /> : <TabPlaceholder />}</TabsContent>

        <TabsContent value="contributed">
          {visited.contributed ? <ContributionsPanel /> : <TabPlaceholder />}
        </TabsContent>

        <TabsContent value="bookmarks">
          {visited.bookmarks ? <BookmarksPanel /> : <TabPlaceholder />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsTabs;

/* ---------- Placeholder ---------- */
const TabPlaceholder: React.FC = () => (
  <div>
    <Skeleton className="h-12 rounded mb-3" />
    <Skeleton className="h-12 rounded mb-3" />
    <Skeleton className="h-12 rounded" />
  </div>
);

/* ---------- Panels (modular) ---------- */

const MyProjectsPanel: React.FC = () => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetMyProjects(page, true);

  return (
    <GenericProjectList
      title="My Projects"
      projects={projects}
      total={total}
      isLoading={isPending}
      isError={isError}
      page={page}
      setPage={setPage}
      limit={PAGE_LIMIT}
      showOwner={false} // do not show owner for "My Projects"
    />
  );
};

const ContributionsPanel: React.FC = () => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetContributedProjects(page, true);

  return (
    <GenericProjectList
      title="Contributed Projects"
      projects={projects}
      total={total}
      isLoading={isPending}
      isError={isError}
      page={page}
      setPage={setPage}
      limit={PAGE_LIMIT}
      showOwner={true}
    />
  );
};

const BookmarksPanel: React.FC = () => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetBookmarks(page, true);

  return (
    <GenericProjectList
      title="Bookmarked Projects"
      projects={projects}
      total={total}
      isLoading={isPending}
      isError={isError}
      page={page}
      setPage={setPage}
      limit={PAGE_LIMIT}
      showOwner={true}
    />
  );
};

/* ---------- Generic list (used by panels) ---------- */

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
}> = ({ title, projects, total, isLoading, isError, page, setPage, limit, showOwner = true }) => {
  return (
    <div>
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
            <ProjectCard key={p._id} project={p} showOwner={showOwner} />
          ))}
        </div>
      )}

      <div className="mt-4">
        <SimplePagination page={page} setPage={setPage} total={total} limit={limit} />
      </div>
    </div>
  );
};

/* ---------- ProjectCard (shows owner photo optionally, contributors if any) ---------- */

const ProjectCard: React.FC<{ project: Project; showOwner?: boolean }> = ({ project, showOwner = true }) => {
  const domains = Array.isArray(project.domain) ? project.domain.join(", ") : project.domain ?? "";
  const techs = Array.isArray(project.techStack) ? project.techStack.join(", ") : (project.techStack as any) ?? "";

  return (
    <div className="flex items-start gap-3 p-3 border rounded-md">
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
            {/* Owner (conditionally rendered) */}
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

            {/* Contributors (if any) */}
            {Array.isArray((project as any).contributors) && (project as any).contributors.length > 0 ? (
              <div className={`ml-3 flex items-center gap-2 ${!showOwner ? "" : ""}`}>
                <div className="text-xs text-gray-500">Contributors:</div>
                <div className="flex -space-x-2">
                  {(project as any).contributors.map((c: any) => (
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

          {/* small meta on right (reserved) */}
          <div className="text-xs text-gray-500">{/* reserved for future actions */}</div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Simple Pagination ---------- */

const SimplePagination: React.FC<{
  page: number;
  setPage: (p: number) => void;
  total: number;
  limit: number;
}> = ({ page, setPage, total, limit }) => {
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={prev} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        <button onClick={next} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </nav>
  );
};
