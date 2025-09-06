// should not be used in the profile page 

import React from "react";
import { useGetUserProjects } from "@/api/projectApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";
import { Folder, Plus } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const YourProjects: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const { projects, isPending } = useGetUserProjects(user?.username, 1, true, "", "", 10);

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Your Projects</h2>
          <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-1">
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Your Projects</h2>
          <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-1">
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
        <p className="text-sm text-slate-500">No Projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Your Projects</h2>
        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-1">
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>
      
      <div className="space-y-1">
        {projects.map((project: any) => (
          <div
            key={project._id}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            <Folder className="w-4 h-4 text-slate-500" />
            <Link
              to={`/projects/${project._id}`}
              className="text-sm text-slate-700 group-hover:text-slate-900 flex-1 min-w-0 truncate"
            >
              {project.title}
            </Link>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <button className="text-sm text-slate-600 hover:text-slate-800 hover:underline">
          Show more
        </button>
      </div>
    </div>
  );
};

export default YourProjects;
