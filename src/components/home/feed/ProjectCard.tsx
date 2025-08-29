import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { likeProject,unlikeProject, requestToJoinProject } from "@/api/projectApi";
import { toggleBookmarkApi } from "@/api/userApi";
import { toast } from "sonner";

export default function ProjectCard({ project, refetch }: any) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(project.likesCount || 0);
  const [liked, setLiked] = useState(project.likedByUser || false);
  const [bookmarked, setBookmarked] = useState(project.bookmarkedByUser || false);
  const [commentsCount, setCommentsCount] = useState(project.commentsCount || 0);

 
  // ❤️ Toggle Like
  const handleLike = async () => {
    try {
      const res = await (liked ? unlikeProject : likeProject)(project._id);
      if (res.success) {
        setLiked((prev: boolean) => !prev);
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

  return (
    <Card className="w-full shadow-md rounded-2xl border border-slate-100 bg-white overflow-hidden">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-semibold text-lg text-slate-800 leading-tight">{project.title}</h2>
          <p className="text-sm text-slate-500">{project.owner?.name}</p>
          {project.domain && (
            <span className="text-xs text-slate-600 italic">Domain: {project.domain}</span>
          )}
        </div>
        <span
          className={`self-start md:self-auto mt-1 md:mt-0 px-3 py-1 text-xs rounded-full ${
            displayStatus === "ongoing" || displayStatus === "Looking for collaborators"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {displayStatus}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.techStack?.map((tech: string, idx: number) => (
            <span key={idx} className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.githubURL && (
            <a
              href={project.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs rounded-full bg-slate-900 text-white flex items-center gap-1 hover:bg-black transition"
            >
              <Github className="w-3 h-3" /> GitHub
            </a>
          )}
          {project.deploymentURL && (
            <a
              href={project.deploymentURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition"
            >
              <Globe className="w-3 h-3" /> Demo
            </a>
          )}
          {project.additionalUrl && (
            <a
              href={project.additionalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs rounded-full bg-emerald-600 text-white flex items-center gap-1 hover:bg-emerald-700 transition"
            >
              <Link2 className="w-3 h-3" /> More
            </a>
          )}
        </div>

        {project.projectPhoto && (
          <img src={project.projectPhoto} alt={project.title} className="rounded-xl w-full object-cover max-h-72" />
        )}

        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={(project.likedByUser || liked) ? "text-red-500" : "text-slate-600"}
          >
            <Heart className="w-4 h-4 mr-1" fill={(project.likedByUser || liked) ? "red" : "none"} /> {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments((prev) => !prev)}
            className="text-slate-600"
          >
            <MessageCircle className="w-4 h-4 mr-1" /> {commentsCount}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={(project.bookmarkedByUser || bookmarked)? "text-blue-500" : "text-slate-600"}
          >
            <Bookmark className="w-4 h-4 mr-1" fill={(project.bookmarkedByUser || bookmarked) ? "blue" : "none"} />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare} className="text-slate-600">
            <Share2 className="w-4 h-4 mr-1" />
          </Button>

          {project.lookingForContributors && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestJoin}
              className="md:ml-auto w-full md:w-auto"
            >
              Request to Join
            </Button>
          )}
        </div>

        {showComments && (
          <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
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
