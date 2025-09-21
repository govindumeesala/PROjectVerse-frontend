import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectDetails({ project }: { project: any }) {
  return (
    <div className="space-y-4">
      {/* Description */}
      <Card className="p-4">
        <p>{project.description}</p>
      </Card>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech: string) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      {/* Domains */}
      <div className="flex flex-wrap gap-2 mt-2">
        {project.domain.map((d: string) => (
          <Badge key={d} variant="secondary">
            {d}
          </Badge>
        ))}
      </div>

      {/* External Links */}
      <Card className="p-4 space-y-2">
        {project.githubURL && <a href={project.githubURL}>🔗 GitHub</a>}
        {project.deploymentURL && <a href={project.deploymentURL}>🚀 Deployment</a>}
        {project.additionalURL && <a href={project.additionalURL}>🌐 Additional Link</a>}
      </Card>

      {/* Status */}
      <Card className="p-4">
        <span>Status: </span>
        <Badge>{project.status}</Badge>
      </Card>
    </div>
  );
}
