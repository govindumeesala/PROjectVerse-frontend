import { useParams } from "react-router-dom";
import { useProject, useRequestToJoin } from "@/hooks/useProject";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ProjectPage() {
  const { username, projectTitle } = useParams<{ username: string; projectTitle: string }>();
  const { data: project, isLoading } = useProject(username!, projectTitle!);
  const { mutate: requestJoin, isPending: requesting } = useRequestToJoin(username!, projectTitle!);
  const location = useLocation();
  const joinButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (location.state?.highlightJoin && joinButtonRef.current) {
      // Scroll into view
      joinButtonRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      // Highlight animation
      joinButtonRef.current.classList.add("ring-4", "ring-blue-400", "animate-pulse");

      // Remove highlight after a few seconds
      setTimeout(() => {
        joinButtonRef.current?.classList.remove("ring-4", "ring-blue-400", "animate-pulse");
      }, 3000);
    }
  }, [location.state]);

  if (isLoading) return <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>;
  if (!project) return <div className="text-center p-10">Project not found</div>;

  const isOwner = project.owner.username === username; // depends on logged-in user check
  const alreadyRequested = project.alreadyRequested; // backend should include this flag

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">{project.owner.username} / {project.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline">⭐ Like</Button>
          <Button variant="outline">🔖 Bookmark</Button>

          {!isOwner && (
            <Button
              disabled={alreadyRequested || requesting}
              ref={joinButtonRef}
              variant="default"
              onClick={(e) => {
                e.stopPropagation(); // stop card click
                requestJoin();
              }}
            >
              {alreadyRequested ? "Request Sent" : "👥 Request to Join"}
            </Button>
          )}

          {isOwner && <Button variant="default">✏️ Edit</Button>}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left (Main) */}
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <p>{project.description}</p>
          </Card>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {project.domain.map((d: string) => (
              <Badge variant="secondary" key={d}>{d}</Badge>
            ))}
          </div>

          <Card className="p-4 space-y-2">
            {project.githubURL && <a href={project.githubURL} target="_blank">🔗 GitHub</a>}
            {project.deploymentURL && <a href={project.deploymentURL} target="_blank">🚀 Deployment</a>}
            {project.additionalURL && <a href={project.additionalURL} target="_blank">🌐 Additional Link</a>}
          </Card>

          <Card className="p-4">
            <span>Status: </span>
            <Badge variant={project.status === "completed" ? "secondary" : "default"}>
              {project.status}
            </Badge>
          </Card>
        </div>

        {/* Right (Sidebar) */}
        <div className="space-y-4">
          <Card className="p-4 flex items-center gap-3">
            <img src={project.owner.profilePhoto} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-bold">{project.owner.name}</div>
              <div className="text-sm text-gray-600">@{project.owner.username}</div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-2">Collaborators</h3>
            {project.collaborators?.length > 0 ? (
              project.collaborators.map((c: any) => (
                <div key={c._id} className="flex items-center gap-2">
                  <img src={c.profilePhoto} className="w-6 h-6 rounded-full" />
                  <span>{c.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No collaborators yet</p>
            )}
          </Card>

          {isOwner && (
            <Card className="p-4">
              <h3 className="font-bold mb-2">Join Requests</h3>
              {project.requests?.length > 0 ? (
                project.requests.map((r: any) => (
                  <div key={r._id} className="flex justify-between items-center">
                    <span>{r.collaborator.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">✅ Accept</Button>
                      <Button size="sm" variant="destructive">❌ Reject</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No pending requests</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
