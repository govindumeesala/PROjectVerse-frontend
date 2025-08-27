// should not be used in the profile page 

import React from "react";
import { useGetMyProjects } from "@/api/projectApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const TopProjects: React.FC = () => {
  const { projects, isPending } = useGetMyProjects();

  if (isPending) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="font-semibold text-gray-700 mb-3">Your Projects</div>
        <Skeleton className="h-8 mb-2 rounded-md" />
        <Skeleton className="h-8 mb-2 rounded-md" />
        <Skeleton className="h-8 mb-2 rounded-md" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="font-semibold text-gray-700 mb-3">Your Projects</div>
        <p className="text-sm text-gray-500">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="font-semibold text-gray-700 mb-3">Your Projects</div>
      <ul className="space-y-3">
        {projects.map((project: any) => (
          <li
            key={project._id}
            className="group border-b border-slate-100 last:border-0 pb-2"
          >
            <Link
              to={`/projects/${project._id}`}
              className="font-medium text-sky-600 group-hover:underline text-sm"
            >
              {project.title}
            </Link>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
              <span>
                {project.status === "completed" ? (
                  <span className="text-green-600">● Completed</span>
                ) : (
                  <span className="text-blue-600">● Active</span>
                )}
              </span>
              <span>
                {project.createdAt
                  ? formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </span>
            </div>
            {project.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.techStack.slice(0, 3).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs bg-slate-100 text-gray-600 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-slate-100 text-gray-500 rounded-md">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 text-right">
        <Link
          to="/projects/my-projects"
          className="text-xs text-sky-600 hover:underline"
        >
          View all →
        </Link>
      </div>
    </div>
  );
};

export default TopProjects;
