import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Globe, Link2 } from "lucide-react";
import CommentSection from "./CommentSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import ProjectActions from "@/components/ProjectActions";

export default function ProjectCard({ project, refetch }: any) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [, setLiked] = useState(Boolean(project.likedByUser));
  const [, setLikes] = useState(Number(project.likesCount ?? 0));
  const [, setBookmarked] = useState(Boolean(project.bookmarkedByUser));
  const [, setCommentsCount] = useState(Number(project.commentsCount ?? 0));

  const handleProjectClick = () =>
    navigate(`/${project.owner.username}/${project.slug}`);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/${project.owner.username}`);
  };

  const displayStatus =
    project.status === "ongoing" && project.lookingForContributors
      ? "Looking for collaborators"
      : project.status;

  return (
    <Card
      onClick={handleProjectClick}
      className="w-full shadow-lg rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      {/* HEADER */}
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between p-6">
        <div className="flex items-start gap-4 flex-grow">
          {project.owner?.profilePhoto && (
            <Avatar
              className="w-12 h-12 border-2 border-slate-300 flex-shrink-0 cursor-pointer"
              onClick={handleProfileClick}
            >
              <AvatarImage
                src={project.owner.profilePhoto}
                alt={project.owner.name}
              />
              <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-grow">
            <h2 className="font-bold text-xl text-slate-800 leading-tight">
              {project.title}
            </h2>
            <p
              className="text-sm text-slate-600 font-medium mt-1 cursor-pointer hover:underline"
              onClick={handleProfileClick}
            >
              by {project.owner?.name}
            </p>
            {project.domain && (
              <span className="text-xs text-slate-500 italic mt-1 block">
                Domain: {project.domain}
              </span>
            )}
          </div>
        </div>
        <span
          className={`self-start md:self-auto mt-1 md:mt-0 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
            displayStatus === "ongoing" ||
            displayStatus === "Looking for collaborators"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {displayStatus}
        </span>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-6 px-6 pb-6">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {project.description}
        </p>

        {project.projectPhoto && (
          <img
            src={project.projectPhoto}
            alt={project.title}
            className="rounded-xl w-full object-cover max-h-72 border border-slate-200 shadow-sm"
          />
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack?.map((tech: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Contributors */}
        {project.collaborations?.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 font-medium">
              Contributors:
            </span>
            <div className="flex -space-x-2 overflow-hidden">
              <TooltipProvider>
                {project.collaborations.map((user: any) => (
                  <Tooltip key={user._id}>
                    <TooltipTrigger asChild>
                      <Avatar className="w-8 h-8 border-2 border-white transition-transform hover:scale-110">
                        <AvatarImage
                          src={user.profilePhoto || ""}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {project.githubURL && (
            <a
              href={project.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-slate-800 text-white hover:bg-black transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
          {project.deploymentURL && (
            <a
              href={project.deploymentURL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" /> Golive
            </a>
          )}
          {project.additionalUrl && (
            <a
              href={project.additionalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <Link2 className="w-4 h-4" /> More
            </a>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100"
          onClick={(e) => e.stopPropagation()} // prevent card navigation
        >
          <ProjectActions
            project={project}
            isOwner={project.isOwner}
            onLikeChange={(liked, likes) => {
              setLiked(liked);
              setLikes(likes);
            }}
            onBookmarkChange={(booked) => setBookmarked(booked)}
            onToggleComments={() => setShowComments((s) => !s)}
            redirectJoinToProject={true}
            navigateToProject={() =>
              navigate(`/${project.owner.username}/${project.slug}`, {
                state: { highlightJoin: true },
              })
            }
          />
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <CommentSection
              projectId={project._id}
              onNewComment={() => setCommentsCount((c) => c + 1)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
