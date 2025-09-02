import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Github,
  Globe,
  Link2,
} from "lucide-react";
import CommentSection from "./CommentSection";
import {
  likeProject,
  unlikeProject,
  requestToJoinProject,
} from "@/api/projectApi";
import { toggleBookmarkApi } from "@/api/userApi";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectCard({ project, refetch }: any) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(project.likesCount || 0);
  const [liked, setLiked] = useState(project.likedByUser || false);
  const [bookmarked, setBookmarked] = useState(
    project.bookmarkedByUser || false
  );
  const [commentsCount, setCommentsCount] = useState(
    project.commentsCount || 0
  );

  // ❤️ Toggle Like
  const handleLike = async () => {
    try {
      const res = await (liked ? unlikeProject : likeProject)(project._id);
      if (res.success) {
        setLiked((prev: any) => !prev);
        setLikes(res.data.likes); // backend sends updated count
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  // 🔖 Toggle Bookmark
  const handleBookmark = async () => {
    try {
      const action = bookmarked ? "remove" : "add";
      const res = await toggleBookmarkApi(project._id, action);
      if (res.success) {
        setBookmarked(action === "add");
        toast.success(
          action === "add" ? "Added to bookmarks" : "Removed from bookmarks"
        );
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  // 📤 Share
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/project/${project._id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // 🙋 Request to Join
  const handleRequestJoin = async () => {
    try {
      const res = await requestToJoinProject(project._id);
      if (res.success) toast.success("Request sent successfully!");
    } catch {
      toast.error("Failed to send join request");
    }
  };

  const displayStatus =
    project.status === "ongoing" && project.lookingForContributors
      ? "Looking for collaborators"
      : project.status;
  console.log(project);

  return (
    <Card className="w-full shadow-lg rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between p-6">
        <div className="flex items-start gap-4 flex-grow">
          {project.owner?.profilePhoto && (
            <Avatar className="w-12 h-12 border-2 border-slate-300 flex-shrink-0">
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
            <p className="text-sm text-slate-600 font-medium mt-1">
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

        <div className="flex flex-wrap gap-2">
          {project.githubURL && (
            <a
              href={project.githubURL}
              target="_blank"
              rel="noopener noreferrer"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <Link2 className="w-4 h-4" /> More
            </a>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`transition-colors ${
              project.likedByUser || liked ? "text-red-500" : "text-slate-500"
            } hover:bg-red-50 hover:text-red-600`}
          >
            <Heart
              className="w-4 h-4 mr-1 transition-transform group-hover:scale-110"
              fill={project.likedByUser || liked ? "red" : "none"}
            />{" "}
            {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments((prev) => !prev)}
            className="text-slate-500 hover:bg-slate-50 hover:text-slate-600"
          >
            <MessageCircle className="w-4 h-4 mr-1" /> {commentsCount}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`transition-colors ${
              project.bookmarkedByUser || bookmarked
                ? "text-blue-500"
                : "text-slate-500"
            } hover:bg-blue-50 hover:text-blue-600`}
          >
            <Bookmark
              className="w-4 h-4 mr-1 transition-transform group-hover:scale-110"
              fill={project.bookmarkedByUser || bookmarked ? "blue" : "none"}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-slate-500 hover:bg-slate-50 hover:text-slate-600"
          >
            <Share2 className="w-4 h-4 mr-1" />
          </Button>

          {project.lookingForContributors && (
            <Button
              variant="default"
              size="sm"
              onClick={handleRequestJoin}
              className="md:ml-auto w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Request to Join
            </Button>
          )}
        </div>

        {showComments && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <CommentSection
              projectId={project._id}
              onNewComment={() => setCommentsCount((c: number) => c + 1)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
