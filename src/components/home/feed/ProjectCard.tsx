import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, Github, Globe, Link2 } from "lucide-react";
import CommentSection from "./CommentSection";
import {
  likeProject,
  unlikeProject,
  bookmarkProject,
  unbookmarkProject,
  requestToJoinProject,
} from "@/api/projectApi";
import { toast } from "sonner";
import { getComments } from "@/api/commentApi";
import { useQuery } from "@tanstack/react-query";

export default function ProjectCard({ project, refetch }: any) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(project.likes?.length || 0);
  const [liked, setLiked] = useState(
    project.likes?.some((u: string) => u === localStorage.getItem("userId"))
  );
  const [bookmarked, setBookmarked] = useState(
    project.bookmarks?.some((u: string) => u === localStorage.getItem("userId"))
  );

  // 🔹 Fetch comments
  const { data: comments } = useQuery({
    queryKey: ["comments", project._id],
    queryFn: () => getComments(project._id),
  });

  // 🔹 Sync comment count with fetched comments
  const [commentsCount, setCommentsCount] = useState(0);
  useEffect(() => {
    if (comments) {
      setCommentsCount(comments.length);
    }
  }, [comments]);

  // 🔹 Compute status dynamically
  const displayStatus =
    project.status === "ongoing" && project.lookingForContributors
      ? "Looking for collaborators"
      : project.status;

  // ❤️ Like/Unlike
  const handleLike = async () => {
    try {
      if (liked) {
        const res = await unlikeProject(project._id);
        if (res.success) {
          setLiked(false);
          setLikes((prev: number) => prev - 1);
        }
      } else {
        const res = await likeProject(project._id);
        if (res.success) {
          setLiked(true);
          setLikes((prev: number) => prev + 1);
        }
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  // 🔖 Bookmark toggle
  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        const res = await unbookmarkProject(project._id);
        if (res.success) {
          setBookmarked(false);
          toast.success("Removed from bookmarks");
        }
      } else {
        const res = await bookmarkProject(project._id);
        if (res.success) {
          setBookmarked(true);
          toast.success("Added to bookmarks");
        }
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };
  console.log(project);
  // 📤 Share project link
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/project/${project._id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // 🙋 Request to join project
  const handleRequestJoin = async () => {
    try {
      const res = await requestToJoinProject(project._id);
      if (res.success) {
        toast.success("Request sent successfully!");
      }
    } catch {
      toast.error("Failed to send join request");
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">{project.title}</h2>
          <p className="text-sm text-gray-500">{project.owner?.name}</p>
          {project.domain && (
            <span className="text-xs text-gray-600 italic">
              Domain: {project.domain}
            </span>
          )}
        </div>
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            displayStatus === "ongoing" || displayStatus === "Looking for collaborators"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {displayStatus}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">{project.description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack?.map((tech: string, idx: number) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-gray-100 rounded-lg"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project URLs (GitHub, Demo, Additional) */}
        <div className="flex flex-wrap gap-3">
          {project.githubURL && (
            <a
              href={project.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs rounded-full bg-gray-800 text-white flex items-center gap-1 hover:bg-gray-900 transition"
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
              className="px-3 py-1 text-xs rounded-full bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition"
            >
              <Link2 className="w-3 h-3" /> More
            </a>
          )}
        </div>

        {project.projectPhoto && (
          <img
            src={project.projectPhoto}
            alt={project.title}
            className="rounded-xl w-full object-cover max-h-64"
          />
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-6 pt-3">
          {/* ❤️ Like */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={liked ? "text-red-500" : ""}
          >
            <Heart className="w-4 h-4 mr-1" fill={liked ? "red" : "none"} /> {likes}
          </Button>

          {/* 💬 Comment */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <MessageCircle className="w-4 h-4 mr-1" /> {commentsCount}
          </Button>

          {/* 🔖 Bookmark */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={bookmarked ? "text-blue-500" : ""}
          >
            <Bookmark className="w-4 h-4 mr-1" fill={bookmarked ? "blue" : "none"} />
          </Button>

          {/* 📤 Share */}
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1" />
          </Button>

          {/* 🙋 Request to join */}
          {project.lookingForContributors && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestJoin}
              className="ml-auto"
            >
              Request to Join
            </Button>
          )}
        </div>

        {/* Inline comments */}
        {showComments && (
          <CommentSection
            projectId={project._id}
            onNewComment={() => setCommentsCount((c: number) => c + 1)}
          />
        )}
      </CardContent>
    </Card>
  );
}
