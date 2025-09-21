import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { likeProject, unlikeProject } from "@/api/projectApi";
import { toggleBookmarkApi } from "@/api/userApi";
import { toast } from "sonner";
import { useState } from "react";

export default function ProjectActions({
  project,
  isOwner,
  onLikeChange,
  onBookmarkChange,
  onToggleComments,
  navigateToProject,
  redirectJoinToProject,
}: {
  project: any;
  isOwner?: boolean;
  onLikeChange?: (liked: boolean, likes: number) => void;
  onBookmarkChange?: (bookmarked: boolean) => void;
  onToggleComments?: () => void;
  navigateToProject?: () => void;
  redirectJoinToProject?: boolean;
}) {
  const [liked, setLiked] = useState(Boolean(project.likedByUser));
  const [likes, setLikes] = useState(Number(project.likesCount ?? 0));
  const [bookmarked, setBookmarked] = useState(Boolean(project.bookmarkedByUser));

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await (liked ? unlikeProject : likeProject)(project._id);
      if (res.success) {
        setLiked(!liked);
        setLikes(res.data.likes);
        onLikeChange?.(!liked, res.data.likes);
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const action = bookmarked ? "remove" : "add";
      const res = await toggleBookmarkApi(project._id, action);
      if (res.success) {
        const state = action === "add";
        setBookmarked(state);
        onBookmarkChange?.(state);
        toast.success(state ? "Added to bookmarks" : "Removed from bookmarks");
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/${project.owner.username}/${project.slug}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`transition-colors ${
          liked ? "text-red-500" : "text-slate-500"
        } hover:bg-red-50 hover:text-red-600`}
      >
        <Heart className="w-4 h-4 mr-1" fill={liked ? "red" : "none"} /> {likes}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComments?.();
        }}
        className="text-slate-500 hover:bg-slate-50 hover:text-slate-600"
      >
        <MessageCircle className="w-4 h-4 mr-1" /> {project.commentsCount ?? 0}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`transition-colors ${
          bookmarked ? "text-blue-500" : "text-slate-500"
        } hover:bg-blue-50 hover:text-blue-600`}
      >
        <Bookmark className="w-4 h-4 mr-1" fill={bookmarked ? "blue" : "none"} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-slate-500 hover:bg-slate-50 hover:text-slate-600"
      >
        <Share2 className="w-4 h-4 mr-1" />
      </Button>

      {/* 🔑 Switch based on owner */}
      {!isOwner && project.lookingForContributors && redirectJoinToProject && (
        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigateToProject?.();
          }}
          className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
        >
          Request to Join
        </Button>
      )}

      
    </div>
  );
}
