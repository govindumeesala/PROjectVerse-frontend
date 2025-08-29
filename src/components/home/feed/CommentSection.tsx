
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, addCommentApi } from "@/api/commentApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function CommentSection({ projectId,onNewComment }: { projectId: string , onNewComment: () => void}) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", projectId],
    queryFn: () => getComments(projectId),
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      addCommentApi({ projectId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
      setNewComment("");
      toast.success("Comment added!");
      onNewComment?.();
    },
    onError: () => toast.error("Failed to add comment"),
  });

  return (
    <div className="border-t pt-3 space-y-3">
      {/* Comment input */}
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isPending}
        />
        <Button
          size="sm"
          onClick={() => {
            if (newComment.trim()) addComment({ content: newComment });
          }}
          disabled={isPending}
        >
          Post
        </Button>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-6 bg-slate-100 rounded" />
          <div className="h-6 bg-slate-100 rounded w-2/3" />
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {comments?.length ? (
            comments.map((c: any) => (
              <div key={c._id} className="flex items-start gap-2">
                <img
                  src={c.user?.profilePhoto || "/default-avatar.png"}
                  alt={c.user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm shadow-sm">
                  <span className="font-medium text-slate-800">{c.user?.name}</span>
                  <p className="text-slate-700">{c.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
