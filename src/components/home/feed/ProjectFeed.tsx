import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjectFeed } from "@/api/projectApi";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ProjectFilters onFilterChange={setFilters} />
      
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
