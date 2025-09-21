// src/pages/ProjectPage.tsx
import { useParams, useLocation, Link } from "react-router-dom";
import {
  useProject,
  useRequestToJoin,
  useRespondToRequest,
} from "@/hooks/useProject";
import { Github, Globe, Link2, Edit, Loader2 } from "lucide-react";
import CreateProjectForm from "@/forms/CreateProjectForm";
import { useEffect, useRef, useState } from "react";
import CommentSection from "@/components/home/feed/CommentSection";
import ProjectActions from "@/components/ProjectActions";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Skeleton loader (unchanged)
const ProjectPageSkeleton = () => (
  <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
    <div className="h-10 w-1/3 bg-slate-200 animate-pulse rounded"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="w-full h-80 bg-slate-200 animate-pulse rounded-xl"></div>
        <div className="h-6 w-1/2 bg-slate-200 animate-pulse rounded"></div>
        <div className="h-6 w-1/3 bg-slate-200 animate-pulse rounded"></div>
      </div>
      <div className="space-y-6">
        <div className="h-48 bg-slate-200 animate-pulse rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function ProjectPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const { data: project, isLoading, isError } = useProject(username!, slug!);

  const queryClient = useQueryClient();
  const { mutate: requestJoin, isPending: requesting } = useRequestToJoin(
    username!,
    slug!,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project", username, slug] });
        setJoinDialogOpen(false);
        setFormData({ roleRequested: "", message: "" });
      },
    }
  );
  const { mutate: respondToRequest } = useRespondToRequest(username!, slug!, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", username, slug] });
    },
  });

  const location = useLocation();
  const joinButtonRef = useRef<HTMLButtonElement>(null);
  const [showComments, setShowComments] = useState(false);

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    roleRequested: "",
    message: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Inline edit mode
  const [editMode, setEditMode] = useState(false);

  // Highlight join button if redirected
  useEffect(() => {
    if (location.state?.highlightJoin && joinButtonRef.current) {
      joinButtonRef.current.scrollIntoView({ behavior: "smooth" });
      joinButtonRef.current.classList.add("ring-4", "ring-blue-400", "animate-pulse");
      setTimeout(() => {
        joinButtonRef.current?.classList.remove("ring-4", "ring-blue-400", "animate-pulse");
      }, 3000);
    }
  }, [location.state]);

  if (isLoading) return <ProjectPageSkeleton />;
  if (isError || !project) return <div className="text-center p-10">Project not found</div>;

  const isOwner = project.isOwner;
  const alreadyRequested = project.alreadyRequested;

  const handleSubmitRequest = () => {
    setFormError(null);
    if (!formData.roleRequested) return setFormError("Please select a role.");
    if (!formData.message.trim()) return setFormError("Please enter a message.");
    requestJoin(formData);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      {/* Title */}
      <div className="flex items-center gap-4 -ml-2">
        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
        {isOwner && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setEditMode((v) => !v)}
          >
            <Edit className="w-4 h-4" /> {editMode ? "Close Edit" : "Edit"}
          </Button>
        )}
      </div>

      {/* Edit mode renders full form inline */}
      {editMode ? (
        <div className="bg-white rounded-xl shadow-sm">
          <CreateProjectForm
            mode="edit"
            username={username}
            slug={slug}
            initialValues={{
              title: project.title,
              description: project.description,
              domain: Array.isArray(project.domain) ? project.domain : project.domain ? [project.domain] : [],
              techStack: Array.isArray(project.techStack) ? project.techStack : project.techStack ? [project.techStack] : [],
              status: project.status,
              lookingForContributors: !!project.lookingForContributors,
              githubURL: project.githubURL || "",
              deploymentURL: project.deploymentURL || "",
              demoURL: project.additionalURL || project.additionalUrl || "",
            }}
            onSuccess={() => {
              setEditMode(false);
              queryClient.invalidateQueries({ queryKey: ["project", username, slug] });
            }}
          />
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {project.projectPhoto && (
            <img
              src={project.projectPhoto}
              alt={project.title}
              className="rounded-xl w-full object-cover max-h-96 border border-slate-200 shadow-sm"
            />
          )}

          {/* Actions + Comments directly under actions */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <ProjectActions
              project={project}
              isOwner={isOwner}
              onToggleComments={() => setShowComments((p) => !p)}
            />
            {showComments && (
              <div className="bg-white rounded-lg shadow p-4">
                <CommentSection projectId={project._id} onNewComment={() => {}} />
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.githubURL && (
              <a href={project.githubURL} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-black">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.deploymentURL && (
              <a href={project.deploymentURL} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                <Globe className="w-4 h-4" /> Live
              </a>
            )}
            {project.additionalUrl && (
              <a href={project.additionalUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                <Link2 className="w-4 h-4" /> More
              </a>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Contributors only (removed duplicate collaborations) */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-3">Contributors</h3>
            {project.contributors?.length > 0 ? (
              <div className="space-y-3">
                {project.contributors.map((c: any) => (
                  <Link to={`/${c.username}`} key={c._id} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-md">
                    <img src={c.profilePhoto || "/default-avatar.png"} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-sm text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-500">@{c.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No contributors yet.</p>
            )}
          </div>

          {/* Requests (owner only) moved to sidebar to avoid duplication */}

      {/* Join button (non-owner) */}
      {!isOwner && (
        <div className="bg-white rounded-lg shadow p-4">
          {(() => {
            const disabled =
              project.alreadyContributor || alreadyRequested || !project.lookingForContributors;
            let label = "Request to Join";
            if (project.alreadyContributor) label = "Already a contributor";
            else if (alreadyRequested) label = "Request Sent";
            else if (!project.lookingForContributors) label = "Not accepting contributors";
            return (
              <Button
                ref={joinButtonRef}
                onClick={() => setJoinDialogOpen(true)}
                disabled={disabled}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {label}
              </Button>
            );
          })()}
        </div>
      )}

      {/* Sidebar */}
      <ProjectSidebar
        project={project}
        isOwner={isOwner}
        onRespond={({ requestId, action }) =>
          respondToRequest({ requestId, action })
        }
      />
        </div>
      </div>
      )}

      {/* Removed old Edit Project modal in favor of inline form */}

      {/* Join Request Dialog (unchanged) */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Join Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select
                value={formData.roleRequested}
                onValueChange={(val) => setFormData((f) => ({ ...f, roleRequested: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Fullstack</SelectItem>
                  <SelectItem value="ml">Machine Learning</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                rows={4}
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitRequest} disabled={requesting} className="bg-blue-600 text-white">
              {requesting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {requesting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
