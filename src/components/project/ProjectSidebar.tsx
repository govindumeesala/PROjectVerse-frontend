import { Card } from "@/components/ui/card";
import ProjectRequests from "@/components/project/ProjectRequests";
import { Link } from "react-router-dom";

export default function ProjectSidebar({ project, isOwner, onRespond }: { project: any; isOwner: boolean; onRespond?: (args: { requestId: string; action: "accept" | "reject" }) => void }) {
  return (
    <div className="space-y-4">
      {/* Owner */}
      <Link to={`/${project.owner.username}`}>
        <Card className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
          <img
            src={project.owner.profilePhoto || "/default-avatar.png"}
            alt={project.owner.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-bold">{project.owner.name}</div>
            <div className="text-sm text-gray-600">@{project.owner.username}</div>
          </div>
        </Card>
      </Link>

      {/* Join Requests (owner only) */}
      {isOwner && <ProjectRequests requests={project.requests || []} onRespond={onRespond} />}
    </div>
  );
}
