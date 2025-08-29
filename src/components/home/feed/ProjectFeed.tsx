import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjectFeed } from "@/api/projectApi";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectFeed() {
  const [filters, setFilters] = useState<{
    domain?: string[];
    techStack?: string[];
    search?: string;
  }>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["projects", filters],
    queryFn: ({ pageParam }) =>
      getProjectFeed({
        cursor: pageParam,
        ...filters,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

  const projects = data?.pages.flatMap((page) => page.projects) || [];
  // 👇 Intersection observer hook
  const { ref, inView } = useInView({
    threshold: 0.5, // trigger when 50% visible
  });

  // 👇 Trigger fetchNextPage when inView becomes true
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  const isInitialLoading = !data && !isFetchingNextPage;

  return (
    <div className="space-y-6">
      {/* Home Title */}
      <div className="pb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Home</h1>
      </div>

      <ProjectFilters onFilterChange={setFilters} />
      
      {isInitialLoading && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-48 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-48 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      )}

      {projects.map((project, idx) => {
        // Attach observer to last project card
        if (idx === projects.length - 1) {
          return (
            <div ref={ref} key={project._id}>
              <ProjectCard project={project} />
            </div>
          );
        }
        return <ProjectCard key={project._id} project={project} />;
      })}

      {isFetchingNextPage && (
        <p className="text-center text-gray-500">Loading more...</p>
      )}
    </div>
  );
}
